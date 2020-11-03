import daiIcon from "./images/asset_DAI.svg";
import usdcIcon from "./images/asset_USDC.svg";
import usdtIcon from "./images/asset_USDT.svg";
import tokens, { Token} from "./tokens";
import { contractAddresses } from '@pooltogether/current-pool-data'
import Big, { BigSource } from 'big.js'

export type AVAILABLE_TOKENS = 'dai' | 'usdc' | 'usdt'

export const web3Provider = 'https://rinkeby.infura.io/v3/c6b741d4895e44b9918bb1c4ea0b8c0a';

export type TokenItem = {
  id: string;
  label: string;
  iconUrl: string;
  decimals: number;
  tokenAddr: string;
  poolAddr: string;
  strategyAddr: string;
};

export const TOKEN_DETAILS = {
  dai: {
    id: "DAI",
    label: "DAI",
    iconUrl: daiIcon,
    decimals: 18,
  },
  usdc: {
    id: "USDC",
    label: "USDC",
    iconUrl: usdcIcon,
    decimals: 6,
  },
  usdt: {
    id: "USDT",
    label: "USDT",
    iconUrl: usdtIcon,
    decimals: 6,
  },
}

export const getTokenList = async (connection: any): Promise<Array<TokenItem>> => {
  if (!connection) {
    return []
  }

  const networkId: 1 | 4 = await connection?.eth.net.getId()

  const tokensByNetwork = tokens[networkId];

  if (!tokensByNetwork) {
    throw Error(`No token configuration for ${networkId}`);
  }

  const availablePoolsTokens = Object.keys(contractAddresses[networkId])

  return availablePoolsTokens.filter(tokenId => ['dai', 'usdc', 'usdt'].includes(tokenId))
    .map((tokenId: string) => ({
      ...TOKEN_DETAILS[tokenId as AVAILABLE_TOKENS],
      tokenAddr: tokensByNetwork[tokenId as Token],
      poolAddr: contractAddresses[networkId][tokenId].prizePool.toLocaleLowerCase(),
      strategyAddr: contractAddresses[networkId][tokenId].prizeStrategy.toLocaleLowerCase()
    }))
};

export const formatBigNumber = (number: BigSource, tokenItem?: {decimals: number}, precision = 2): string => {
  if (!tokenItem) {
    return ''
  }

  return new Big(number).div(10 ** tokenItem.decimals).toFixed(precision)
}