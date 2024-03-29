import { Decimal } from "decimal.js";
import { NextPage } from "next";
import Head from "next/head";
import { StaticImageData } from "next/image";
import DaiLogo from "public/icons/dai.svg";
import TorLogo from "public/icons/tor.svg";
import React, { useEffect, useState, VFC } from "react";
import { FANTOM } from "src/chain";
import { CoinInput } from "src/components/CoinInput";
import { DappPage } from "src/components/DappPage";
import { PageHeader, PageSubheader } from "src/components/Header";
import { StaticImg } from "src/components/StaticImg";
import { Submit } from "src/components/Submit";
import { Tab, Tabs } from "src/components/Tab";
import { Transaction, TransactionModal } from "src/components/Transaction";
import { FANTOM_ADDRESS, FANTOM_DAI, FANTOM_TOR } from "src/constants";
import * as Minter from "src/contracts/torMinter";
import { useBalance } from "src/hooks/balance";
import { asyncEffect, useDecimalInput } from "src/util";
import { useWallet } from "src/wallet";

const MintPage: NextPage = () => {
  const wallet = useWallet(FANTOM);
  const [dai, daiInput, setDaiInput] = useDecimalInput();
  const [tor, torInput, setTorInput] = useDecimalInput();
  const [view, setView] = useState<"mint" | "redeem">("mint");
  const [tx, setTx] = useState<Transaction>();
  const [mintLimit, setMintLimit] = useState(new Decimal(0));
  const [redeemLimit, setRedeemLimit] = useState(new Decimal(0));

  const [daiBalance, refreshDaiBalance] = useBalance(
    FANTOM,
    FANTOM_DAI,
    wallet,
  );
  const [torBalance, refreshTorBalance] = useBalance(
    FANTOM,
    FANTOM_TOR,
    wallet,
  );

  useEffect(() => {
    asyncEffect(async (abort) => {
      if (!wallet.connected) {
        return;
      }
      const [mintLimit, redeemLimit] = await Promise.all([
        Minter.getMintLimit(FANTOM, wallet.address),
        Minter.getRedeemLimit(FANTOM, wallet.address),
      ]);
      if (abort()) {
        return;
      }
      if (mintLimit.isOk) {
        setMintLimit(mintLimit.value);
      }
      if (redeemLimit.isOk) {
        setRedeemLimit(redeemLimit.value);
      }
    });
  }, [wallet]);

  return (
    <DappPage>
      <main className="w-full space-y-4">
        <Head>
          <title>Mint — Hector Finance</title>
        </Head>
        <div>
          <PageHeader>Mint</PageHeader>
          <PageSubheader>
            Buy and sell Tor, Hector&apos;s stablecoin
          </PageSubheader>
        </div>

        {/* Choose mint or redeem. */}
        <Tabs>
          <Tab
            selected={view === "mint"}
            label="Mint"
            onSelect={() => {
              refreshDaiBalance();
              setDaiInput("");
              setTorInput("");
              setView("mint");
            }}
          />
          <Tab
            selected={view === "redeem"}
            label="Redeem"
            onSelect={() => {
              refreshTorBalance();
              setDaiInput("");
              setTorInput("");
              setView("redeem");
            }}
          />
        </Tabs>

        {/* Mint */}
        {view === "mint" && (
          <>
            <CoinInput
              label="Selling"
              amount={daiInput}
              onChange={setDaiInput}
              balance={daiBalance}
              token={FANTOM_DAI}
            />

            <Buying amount={dai} tokenImage={TorLogo} tokenName="Tor" />
            <div className="flex text-base dark:text-gray-200">
              <div className="flex-1">Mint Limit</div>
              {mintLimit && <div>{mintLimit.toFixed(2)}</div>}
            </div>

            <Submit
              label="Mint"
              disabled={dai.lte(0) || dai.gt(daiBalance) || !wallet.connected}
              onClick={() => {
                setTx({
                  title: "Mint",
                  chain: FANTOM,
                  allowance: {
                    token: FANTOM_DAI,
                    spender: FANTOM_ADDRESS.TOR_MINTER,
                    amount: dai,
                  },
                  send: (wallet) =>
                    Minter.mintWithDai(wallet.provider, wallet.address, dai),
                });
              }}
            />
          </>
        )}
        {/* Redeem */}
        {view === "redeem" && (
          <>
            <CoinInput
              label="Selling"
              amount={torInput}
              onChange={setTorInput}
              balance={torBalance}
              token={FANTOM_TOR}
            />

            <Buying amount={tor} tokenImage={DaiLogo} tokenName="Dai" />
            <div className="flex text-base dark:text-gray-200">
              <div className="flex-1 ">Redeem Limit</div>
              {redeemLimit && <div>{redeemLimit.toFixed(2)}</div>}
            </div>

            <Submit
              label="Redeem"
              disabled={tor.lte(0) || tor.gt(torBalance) || !wallet.connected}
              onClick={() => {
                setTx({
                  title: "Redeem",
                  chain: FANTOM,
                  allowance: {
                    token: FANTOM_TOR,
                    spender: FANTOM_ADDRESS.TOR_MINTER,
                    amount: tor,
                  },
                  send: (wallet) =>
                    Minter.redeemToDai(wallet.provider, wallet.address, tor),
                });
              }}
            />
          </>
        )}
        {wallet.connected && tx && (
          <TransactionModal
            tx={tx}
            wallet={wallet}
            onClose={(success) => {
              setTx(undefined);
              if (success) {
                setDaiInput("");
                setTorInput("");
              }
            }}
          />
        )}
      </main>
    </DappPage>
  );
};

const Buying: VFC<{
  amount: Decimal;
  tokenImage: StaticImageData;
  tokenName: string;
}> = ({ amount, tokenImage, tokenName }) => (
  <div className="block space-y-2">
    <div className="dark:text-gray-200">Buying</div>
    <div
      className="flex h-12 items-center gap-2 rounded bg-gray-100 px-3 dark:bg-gray-700"
      title={`${tokenName} purchase amount`}
    >
      <StaticImg src={tokenImage} alt={tokenName} className="h-6 w-6" />
      <div className="dark:text-gray-200">{tokenName}</div>
      {amount.gt(0) ? (
        <div className="flex-grow text-right dark:text-gray-200">
          ≈ {amount.toString()}
        </div>
      ) : (
        <div className="flex-grow text-right text-gray-400">0.00</div>
      )}
    </div>
  </div>
);

export default MintPage;
