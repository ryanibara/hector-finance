import Decimal from "decimal.js";
import Head from "next/head";
import { StaticImageData } from "next/image";
import { FC, useEffect, useMemo, useReducer, useState, VFC } from "react";
import RebaseTimer from "src/components/RebaseTimer";
import { StaticImg } from "src/components/StaticImg";
import hectorImg from "public/icons/hector.svg";
import { FANTOM, THE_GRAPH_URL } from "src/constants";
import { balanceOf } from "src/contracts/erc20";
import {
  getEpochInfo,
  getHecCircSupply,
  getStakingIndex,
  HEC_DECIMAL,
  stake,
  unStake,
} from "src/contracts/stakingContract";
import {
  Erc20Token,
  FANTOM_BLOCK_TIME,
  FANTOM_HECTOR,
  FANTOM_sHEC,
  formatCurrency,
  sleep,
  useAsyncEffect,
  useDecimalInput,
} from "src/util";
import { useWallet, Wallet, WalletState } from "src/wallet";
import Radio from "src/components/Radio";
import CoinInput from "src/components/CoinInput";
import Submit from "src/components/Submit";
import * as Erc20 from "src/contracts/erc20";

function useBalance(
  token: Erc20Token,
  wallet: Wallet,
): [Decimal, React.DispatchWithoutAction] {
  const [balance, setBalance] = useState(new Decimal(0));

  /**
   * Whenever `refreshes` bumps, we need to restart the
   * polling `useAsyncEffect` below.
   */
  const [refreshes, refreshBalance] = useReducer(
    (prev: number): number => prev + 1,
    0,
  );

  useAsyncEffect(
    async (signal) => {
      if (wallet.state !== WalletState.Connected) {
        return;
      }

      while (!signal.abort) {
        const freshBalance = await Erc20.balanceOf(
          wallet.provider,
          token,
          wallet.address,
        );

        if (signal.abort) {
          return;
        }

        if (freshBalance.isOk) {
          setBalance((prev) =>
            prev.eq(freshBalance.value) ? prev : freshBalance.value,
          );
        }

        // If this timeout is too slow, you can probably make it faster.
        await sleep(FANTOM_BLOCK_TIME * 10);
      }
    },
    [token, wallet, refreshes],
  );

  return useMemo(() => [balance, refreshBalance], [balance, refreshBalance]);
}

export default function StakePage() {
  const wallet = useWallet();
  const [hec, hecInput, setHecInput] = useDecimalInput();
  const [sHec, sHecInput, setsHecInput] = useDecimalInput();
  const [stakingAPY, setStakingAPY] = useState<Decimal>();
  const [stakingTVL, setStakingTVL] = useState<string>();
  const [currentIndex, setCurrentIndex] = useState<Decimal>();
  const [hecBalance, refreshHecBalance] = useBalance(FANTOM_HECTOR, wallet);
  const [sHecBalance, refreshsHecBalance] = useBalance(FANTOM_sHEC, wallet);
  const [nextRewardAmount, setNextRewardAmount] = useState<Decimal>();
  const [nextRewardYield, setNextRewardYield] = useState<Decimal>();
  const [ROI, setROI] = useState<Decimal>();
  const [view, setView] = useState<"stake" | "unstake">("stake");

  useEffect(() => {
    const getStakingData = async () => {
      if (wallet.state === WalletState.Connected) {
        Promise.all([
          getEpochInfo(wallet.provider),
          getHecCircSupply(wallet.provider),
        ]).then(([epoch, circ]) => {
          if (circ.isOk && epoch.isOk) {
            const stakingRebase = epoch.value.distribute.div(
              new Decimal(circ.value),
            );
            const stakingRebasePercentage = stakingRebase.times(100);
            const trimmedBalance = Number(
              [sHecBalance]
                .filter(Boolean)
                .map((balance) => Number(balance))
                .reduce((a, b) => a + b, 0),
            );
            setROI(
              Decimal.pow(stakingRebase.plus(1), 5 * 3)
                .minus(1)
                .times(100),
            );
            setNextRewardYield(stakingRebasePercentage);
            setNextRewardAmount(
              stakingRebasePercentage.div(100).times(trimmedBalance),
            );
            setStakingAPY(
              Decimal.pow(stakingRebase.plus(1), 365 * 3)
                .minus(1)
                .times(100),
            );
          }
        });
        const index = await getStakingIndex(wallet.provider);
        if (index.isOk) {
          setCurrentIndex(new Decimal(index.value).div(FANTOM_HECTOR.wei));
        }
      }
    };
    getStakingData();
  }, [wallet, sHecBalance]);

  useEffect(() => {
    fetch(THE_GRAPH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `query{protocolMetrics(first: 1, orderBy: timestamp, orderDirection: desc) {
        totalValueLocked
      }}
    `,
      }),
    })
      .then((res) => res.json())
      .then(({ data }) =>
        setStakingTVL(
          formatCurrency(+data.protocolMetrics[0].totalValueLocked, 2),
        ),
      );
  }, []);

  return (
    <main className="w-full">
      <Head>
        <title>Stake — Hector Finance</title>
      </Head>
      <div className="mb-5">
        <h1 className="text-2xl font-semibold">Stake v2 (3,3)</h1>
        <RebaseTimer />
      </div>
      <div className="mb-5 flex justify-between text-center">
        <div>
          <div>APY</div>
          {stakingAPY && (
            <div className="text-xl font-semibold text-orange-500">
              {stakingAPY?.toFixed(0)}%
            </div>
          )}
        </div>
        <div>
          <div>Total Deposited</div>
          <div className="text-xl font-semibold text-orange-500">
            {stakingTVL}
          </div>
        </div>
        <div>
          <div>Current Index</div>
          {currentIndex && (
            <div className="text-xl font-semibold text-orange-500">
              {currentIndex?.toFixed(2)}
            </div>
          )}
        </div>
      </div>
      <div className="mb-5 space-y-1">
        <Radio
          checked={view === "stake"}
          onCheck={() => {
            setHecInput("");
            refreshHecBalance();
            setView("stake");
          }}
        >
          Stake
        </Radio>
        <Radio
          checked={view === "unstake"}
          onCheck={() => {
            setsHecInput("");
            refreshsHecBalance();
            setView("unstake");
          }}
        >
          Unstake
        </Radio>
      </div>
      <div className="mb-5">
        {hecBalance && view === "stake" && (
          <CoinInput
            amount={hecInput}
            tokenImage={hectorImg}
            tokenName="Hec"
            onChange={setHecInput}
            balance={hecBalance}
            label={"Stake"}
            decimalAmount={FANTOM_HECTOR.decimals}
          />
        )}
        {sHecBalance && view === "unstake" && (
          <CoinInput
            amount={sHecInput}
            tokenImage={hectorImg}
            tokenName="Hec"
            onChange={setsHecInput}
            balance={sHecBalance}
            label={"Unstake"}
            decimalAmount={FANTOM_sHEC.decimals}
          />
        )}
      </div>

      <div className="flex">
        <div className="flex-1 text-base">Next Reward Amount</div>
        <div>{nextRewardAmount?.toFixed(4)}</div>
      </div>
      <div className="flex">
        <div className="flex-1 text-base">Next Reward Yield</div>
        <div>{nextRewardYield?.toFixed(4)} %</div>
      </div>
      <div className="flex">
        <div className="flex-1 text-base">ROI (5-Day Rate)</div>
        <div>{ROI?.toFixed(4)} %</div>
      </div>
      {wallet.state === WalletState.Connected && hecBalance && sHecBalance && (
        <div className="mt-5">
          <Submit
            onClick={() =>
              view === "stake"
                ? stake(wallet.provider, wallet.address, hec)
                : unStake(wallet.provider, wallet.address, sHec)
            }
            label={view === "stake" ? "Stake" : "Unstake"}
          ></Submit>
        </div>
      )}
    </main>
  );
}