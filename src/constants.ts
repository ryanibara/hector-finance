import Decimal from "decimal.js";
import CurveLogo from "public/icons/curve.webp";
import DaiLogo from "public/icons/dai.svg";
import HecLogo from "public/icons/hector.svg";
import TorLogo from "public/icons/tor.svg";
import UsdcLogo from "public/icons/usdc.svg";
import WftmLogo from "public/icons/wftm.svg";
import { AVALANCHE, BINANCE, ETHEREUM, FANTOM } from "./chain";
import { Erc20Token } from "./contracts/erc20";
import { Farm } from "./contracts/staking";

export const THE_GRAPH_URL =
  "https://api.thegraph.com/subgraphs/name/hectordao-hec/hector-dao";
export const THE_ALT_GRAPH_URL =
  "https://api.thegraph.com/subgraphs/name/hectordao-hec/hector-dao-alt";
export const ETH_GRAPH_URL =
  "https://api.thegraph.com/subgraphs/name/hectordao-hec/hector-eth";
export const EPOCH_INTERVAL = 28800;

export const GRAPH_DATA = `
query {
  protocolMetrics(first: 1000, orderBy: timestamp, orderDirection: desc) {
    id
    timestamp
    hecCirculatingSupply
    sHecCirculatingSupply
    totalSupply
    hecPrice
    marketCap
    totalValueLocked
    treasuryRiskFreeValue
    treasuryMarketValue
    nextEpochRebase
    nextDistributedHec
    treasuryDaiMarketValue
    treasuryDaiLPMarketValue
    treasuryDaiRiskFreeValue
    treasuryUsdcMarketValue
    treasuryUsdcLPMarketValue
    treasuryUsdcRiskFreeValue
    treasuryMIMMarketValue
    treasuryMIMRiskFreeValue
    treasuryWFTMMarketValue
    treasuryWFTMRiskFreeValue
    treasuryFRAXRiskFreeValue
    treasuryFRAXMarketValue
    treasuryInvestments
    treasuryBOOMarketValue
    treasuryBOORiskFreeValue
    treasuryCRVRiskFreeValue
    treasuryCRVMarketValue
    treasuryWETHRiskFreeValue
    treasuryWETHMarketValue
    currentAPY
    runwayCurrent
    treasuryHecDaiPOL
    bankBorrowed
    bankSupplied
    treasuryFantomValidatorValue
    treasuryFantomDelegatorValue
    treasuryTORLPValue
    treasuryDaiTokenAmount,
    treasuryUsdcTokenAmount,
    treasuryWFTMTokenAmount,
    treasuryFRAXTokenAmount,
    treasuryBOOTokenAmount,
    treasuryCRVTokenAmount,
    treasuryWETHTokenAmount,
    hecDaiTokenAmount,
  }
  tors(first: 1000, orderBy: timestamp, orderDirection: desc) {
    id
    timestamp
    torTVL
    supply
  }
}
`;

export interface SubgraphData {
  protocolMetrics: ProtocolMetrics[];
  tors: Tors[];
}

interface Tors {
  id: string;
  timestamp: string;
  torTVL: string;
  supply: string;
}

export interface ProtocolMetrics {
  id: string;
  timestamp: string;
  hecCirculatingSupply: string;
  sHecCirculatingSupply: string;
  totalSupply: string;
  hecPrice: string;
  marketCap: string;
  totalValueLocked: string;
  treasuryRiskFreeValue: string;
  treasuryMarketValue: string;
  nextEpochRebase: string;
  nextDistributedHec: string;
  treasuryDaiMarketValue: string;
  treasuryDaiLPMarketValue: string;
  treasuryDaiRiskFreeValue: string;
  treasuryUsdcMarketValue: string;
  treasuryUsdcLPMarketValue: string;
  treasuryUsdcRiskFreeValue: string;
  treasuryMIMMarketValue: string;
  treasuryMIMRiskFreeValue: string;
  treasuryWFTMMarketValue: string;
  treasuryWFTMRiskFreeValue: string;
  treasuryFRAXRiskFreeValue: string;
  treasuryFRAXMarketValue: string;
  treasuryInvestments: string;
  treasuryBOOMarketValue: string;
  treasuryBOORiskFreeValue: string;
  treasuryCRVRiskFreeValue: string;
  treasuryCRVMarketValue: string;
  treasuryWETHRiskFreeValue: string;
  treasuryWETHMarketValue: string;
  currentAPY: string;
  runwayCurrent: string;
  treasuryHecDaiPOL: string;
  bankBorrowed: string;
  bankSupplied: string;
  bankTotal: string;
  treasuryFantomValidatorValue: string;
  treasuryFantomDelegatorValue: string;
  treasuryTORLPValue: string;
  treasuryBaseRewardPool?: string;
  treasuryIlluviumBalance?: string;
  treasuryEthMarketValue?: string;
  treasuryMaticBalance?: string;
  treasuryRFMaticBalance?: string;
  treasuryRFIlluviumBalance?: string;
  torTVL: string;
  staked: string;
  illuviumTokenAmount: string;
}
// export const MWEI_PER_ETHER = BigNumber.from("1000000000000");

// NOTE could get this from an outside source since it changes slightly over time
export const BLOCK_RATE_SECONDS = 1;

export const TOKEN_DECIMALS = 9;

export const FANTOM_ADDRESS = {
  FANTOM_VALIDATOR: "0x35796Ce4Ed757075D346c1bc374D67628fadcbB1",
  SECOND_FANTOM_VALIDATOR: "0x9c2036151781661D08184163Cbb89dFD3b921075",
  THIRD_FANTOM_VALIDATOR: "0xBE4b73f5Caff476Ed0Cdb4C043236fce81f4dC6C",
  DAI: "0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E",
  USDC: "0x04068da6c83afcfa0e13ba15a6696662335d5b75",
  MIM: "0x82f0B8B456c1A451378467398982d4834b6829c1",
  FRAX: "0xdc301622e621166bd8e82f2ca0a26c13ad0be355",
  WFTM: "0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83",
  TOR: "0x74E23dF9110Aa9eA0b6ff2fAEE01e740CA1c642e",
  DAILP: "0xbc0eecdA2d8141e3a26D2535C57cadcb1095bca9",
  USDCLP: "0xd661952749f05acc40503404938a91af9ac1473b",
  FRAXLP: "0x0f8D6953F58C0dd38077495ACA64cbd1c76b7501",

  HEC: "0x5C4FDfc5233f935f20D2aDbA572F770c2E377Ab0",
  SHEC: "0x75bdef24285013387a47775828bec90b91ca9a5f",
  WSHEC: "0x94CcF60f700146BeA8eF7832820800E2dFa92EdA",

  STAKING: "0xD12930C8deeDafD788F437879cbA1Ad1E3908Cc5", // The new staking contract
  STAKING_HELPER: "0x2694c2AAab19950B37FE47478276B5D4a2A73C45", // Helper contract used for Staking only
  DISTRIBUTOR: "0x41400d445359f5aD51650C76746C98D79174b2e3",
  OLD_STAKING: "0x9ae7972BA46933B3B20aaE7Acbf6C311847aCA40",
  OLD_STAKING_HELPER: "0x2ca8913173D36021dC56922b5db8C428C3fdb146",
  OLD_SHEC: "0x36F26880C6406b967bDb9901CDe43ABC9D53f106",

  BONDINGCALC: "0xA36De21abd90b27e5EfF108D761Ab4fe06fD4Ab4",
  gOHMBONDINGCALC: "0xC13E8C5465998BDD1D91952243774d55B12dBEd0",
  BONDINGCALC_ALT: "0x783A734D5C65e44D3CC0C74e331C4d4F23407E64",
  TREASURY: "0xCB54EA94191B280C296E6ff0E37c7e76Ad42dC6A",
  DAO_WALLET: "0x677d6EC74fA352D4Ef9B1886F6155384aCD70D90",
  REDEEM_HELPER: "0xe78D7ECe7969d26Ae39b2d86BbC04Ae32784daF2",
  AGGREGATOR: "0x7dc6bad2798ba1AcD8cf34F9a3eF3a168252e1A6",

  FARMING_AGGREGATOR: "0x86fb74B3b1949985AC2081B9c679d84BB44A2bf2",

  DAI_TOR_USDC_POOL: "0x24699312CB27C26Cfc669459D670559E5E44EE60",
  DAI_TOR_USDC_FARM: "0x61B71689684800f73eBb67378fc2e1527fbDC3b3",

  TOR_WFTM_POOL: "0x41d88635029c4402BF9914782aE55c412f8F2142",
  TOR_WFTM_FARM: "0xD54d478975990927c0Bb9803708A3eD5Dc1cFa20",

  TOR_MINTER: "0x9b0c6FfA7d0Ec29EAb516d3F2dC809eE43DD60ca",
  TOR_REDEEM: "0x45aC684B6b9Ee1A8647F51170C90c8f943D002E3",
  TOR_LP_AMOUNTS: "0xE4D581869BFc6238d544b0e4c9D678Ad51192654",
  CURVE_FI: "0x78D51EB71a62c081550EfcC0a9F9Ea94B2Ef081c",

  OLD_HEC_BURN_ALLOCATOR: "0x3fF53A304d3672693e90bb880653925db6e63C51",
  HEC_BURN_ALLOCATOR: "0xD3Ea3b2313d24e0f2302b21f04D0F784CDb6389B",

  STAKING_GATEWAY: "0xfF03889aBC1a36BDF176f6dd6742CB58705c8517",
  TOR_WFTM_FARM_REWARDS: "0xD54d478975990927c0Bb9803708A3eD5Dc1cFa20",
  TOR_WFTM_POOL_PRICER: "0x4e0bE969429976Cfd2fB7DE4bac7C5a46d1887D6",
  TOR_WFTM_FARM_REWARD_PRICER: "0xB6328dcc014B3D4B6639f055d2d6B6935236D114",

  HEC_DAI_LP_44_BOND: "0x124C23a4119122f05a4C9D2287Ed19fC00f8059a",
  DAI_44_BOND: "0xE1Cc7FE3E78aEfe6f93D1614A09156fF296Bc81E",
};

export const messages = {
  please_connect:
    "Please connect your wallet to the Fantom network to use Wonderland.",
  please_connect_wallet: "Please connect your wallet.",
  try_mint_more: (value: string) =>
    `You're trying to mint more than the maximum payout available! The maximum mint payout is ${value} HEC.`,
  before_minting: "Before minting, enter a value.",
  existing_mint:
    "You have an existing mint. Minting will reset your vesting period and forfeit any pending claimable rewards. We recommend claiming rewards first or using a fresh wallet. Do you still wish to proceed?",
  before_stake: "Before staking, enter a value.",
  before_unstake: "Before un staking, enter a value.",
  tx_successfully_send: "Your transaction was successful",
  your_balance_updated: "Your balance was successfully updated",
  nothing_to_claim: "You have nothing to claim",
  something_wrong: "Something went wrong",
  switch_to_fantom: "Switch to the Fantom network?",
  slippage_too_small: "Slippage too small",
  slippage_too_big: "Slippage too big",
  your_balance_update_soon: "Your balance will update soon",
  account_update: "Your account will update soon",
};

export const ETHEREUM_RPC = "https://cloudflare-eth.com";
export const FANTOM_RPC = "https://rpc.ftm.tools/";
export const AVALANCHE_RPC = "https://avalanche.public-rpc.com";
export const BSC_RPC = "https://bscrpc.com";
export const POLYGON_RPC = "https://polygon-rpc.com";

export const FANTOM_DAI: Erc20Token = {
  name: "DAI",
  symbol: "DAI",
  logo: DaiLogo,
  address: FANTOM_ADDRESS.DAI,
  chain: FANTOM.id,
  decimals: 18,
  wei: new Decimal(10 ** 18),
};

export const FANTOM_USDC: Erc20Token = {
  name: "USDC",
  symbol: "USDC",
  logo: UsdcLogo,
  address: FANTOM_ADDRESS.USDC,
  chain: FANTOM.id,
  decimals: 6,
  wei: new Decimal(10 ** 6),
};

export const FANTOM_TOR: Erc20Token = {
  name: "Tor",
  symbol: "TOR",
  coingecko: "tor",
  logo: TorLogo,
  address: FANTOM_ADDRESS.TOR,
  chain: FANTOM.id,
  decimals: 18,
  wei: new Decimal(10 ** 18),
};

export const FANTOM_WFTM: Erc20Token = {
  name: "Wrapped Fantom",
  symbol: "wFTM",
  coingecko: "wrapped-fantom",
  logo: WftmLogo,
  address: FANTOM_ADDRESS.WFTM,
  chain: FANTOM.id,
  decimals: 18,
  wei: new Decimal(10 ** 18),
};

export const FANTOM_CURVE: Erc20Token = {
  name: "Curve",
  symbol: "crvLP",
  logo: CurveLogo,
  address: FANTOM_ADDRESS.DAI_TOR_USDC_POOL,
  chain: FANTOM.id,
  decimals: 18,
  wei: new Decimal(10 ** 18),
};

export const FANTOM_STAKED_CURVE: Erc20Token = {
  name: "Staked Curve",
  symbol: "crvLP",
  logo: CurveLogo,
  address: FANTOM_ADDRESS.DAI_TOR_USDC_FARM,
  chain: FANTOM.id,
  decimals: 18,
  wei: new Decimal(10 ** 18),
};

export const FANTOM_SPOOKY_FTM_TOR: Erc20Token = {
  name: "FTM+TOR Spooky LP",
  symbol: "spLP",
  address: "0x41d88635029c4402bf9914782ae55c412f8f2142",
  logo: TorLogo,
  chain: FANTOM.id,
  decimals: 18,
  wei: new Decimal(10 ** 18),
};

export const FANTOM_SPOOKY_FTM_WSHEC: Erc20Token = {
  name: "FTM+WSHEC Spooky LP",
  symbol: "spLP",
  address: "0x0bfe6f893a6bc443b575ddf361a30f39aa03e59c",
  logo: HecLogo,
  chain: FANTOM.id,
  decimals: 18,
  wei: new Decimal(10 ** 18),
};

export const FANTOM_HEC: Erc20Token = {
  name: "Hector Finance",
  symbol: "HEC",
  logo: HecLogo,
  address: FANTOM_ADDRESS.HEC,
  chain: FANTOM.id,
  decimals: 9,
  wei: new Decimal(10 ** 9),
};

export const FANTOM_ANYSWAP_HEC: Erc20Token = {
  name: "Anyswap Hector Finance",
  symbol: "anyHEC",
  logo: HecLogo,
  address: "0x8564bA78F88B744FcC6F9407B9AF503Ad35adAFC",
  chain: FANTOM.id,
  decimals: 9,
  wei: new Decimal(10 ** 9),
};

export const FANTOM_ANYSWAP_TOR: Erc20Token = {
  name: "Anyswap Tor",
  symbol: "anyTOR",
  logo: TorLogo,
  address: "0xfF7B22053219eDf569499A3794829FB71D6F8821",
  chain: FANTOM.id,
  decimals: 18,
  wei: new Decimal(10 ** 18),
};

export const FANTOM_sHEC: Erc20Token = {
  name: "Staked Hector",
  symbol: "sHEC",
  logo: HecLogo,
  address: FANTOM_ADDRESS.SHEC,
  chain: FANTOM.id,
  decimals: 9,
  wei: new Decimal(10 ** 9),
};

export const FANTOM_wsHEC: Erc20Token = {
  name: "Wrapped Staked Hector",
  symbol: "wsHEC",
  coingecko: "wrapped-hec",
  logo: HecLogo,
  address: FANTOM_ADDRESS.WSHEC,
  chain: FANTOM.id,
  decimals: 18,
  wei: new Decimal(10 ** 18),
};

export const LP_FARM: Farm = {
  address: FANTOM_ADDRESS.DAI_TOR_USDC_FARM,
  stake: FANTOM_CURVE,
  reward: FANTOM_WFTM,
};

export const ETHEREUM_HEC: Erc20Token = {
  name: "Hector Finance",
  symbol: "HEC",
  logo: HecLogo,
  address: "0x29b3d220f0f1E37b342Cf7c48c1164BF5bf79eFa",
  chain: ETHEREUM.id,
  decimals: 9,
  wei: new Decimal(10 ** 9),
};

export const BINANCE_HEC: Erc20Token = {
  name: "Hector Finance",
  symbol: "HEC",
  logo: HecLogo,
  address: "0x638EEBe886B0e9e7C6929E69490064a6C94d204d",
  chain: BINANCE.id,
  decimals: 9,
  wei: new Decimal(10 ** 9),
};

export const BINANCE_ANYSWAP_HEC: Erc20Token = {
  name: "Anyswap Hector Finance",
  symbol: "anyHEC",
  logo: HecLogo,
  address: "0xe98803E5cE78Cf8AAD43267d9852A4057423Cb1d",
  chain: BINANCE.id,
  decimals: 9,
  wei: new Decimal(10 ** 9),
};

export const BINANCE_ANYSWAP_TOR: Erc20Token = {
  name: "Anyswap Tor",
  symbol: "anyTOR",
  logo: TorLogo,
  address: "0x80D209227Cf0A64E1FcbE62c7a80B8E691F0Ef4d",
  chain: BINANCE.id,
  decimals: 18,
  wei: new Decimal(10 ** 18),
};

export const AVALANCHE_HEC: Erc20Token = {
  name: "Hector Finance",
  symbol: "HEC",
  logo: HecLogo,
  address: "0x0149E2FA4104666f6af136f731757A04df5C8A68",
  chain: AVALANCHE.id,
  decimals: 9,
  wei: new Decimal(10 ** 9),
};

export const ETHERUEM_TOR: Erc20Token = {
  name: "Tor",
  symbol: "TOR",
  logo: TorLogo,
  address: "0x6b37374fe7980ae33fc87b0d66a490ec6903e87a",
  chain: ETHEREUM.id,
  decimals: 18,
  wei: new Decimal(10 ** 18),
};

export const BINANCE_TOR: Erc20Token = {
  name: "Tor",
  symbol: "TOR",
  logo: TorLogo,
  address: "0x1d6cbdc6b29c6afbae65444a1f65ba9252b8ca83",
  chain: BINANCE.id,
  decimals: 18,
  wei: new Decimal(10 ** 18),
};

export const AVALANCHE_TOR: Erc20Token = {
  name: "Tor",
  symbol: "TOR",
  logo: TorLogo,
  address: "0x790772d8f4115b608340a7aB25258fCa8da1ca2e",
  chain: AVALANCHE.id,
  decimals: 18,
  wei: new Decimal(10 ** 18),
};
