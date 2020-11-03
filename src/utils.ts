import { ethers } from 'ethers'
import { TokenItem } from './config'
import Big from 'big.js'

export const SECONDS_PER_BLOCK = 14

export const estimatePrize = async (token: TokenItem, poolContract: ethers.Contract, strategyContract: ethers.Contract, cTokenContract: ethers.Contract) => {
  if (token && poolContract && strategyContract && cTokenContract) {
    const [
      supplyRateByBlock,
      awardBalance,
      balance,
      periodEndAt,
    ] = await Promise.all([
      cTokenContract.supplyRatePerBlock(),
      poolContract.callStatic.captureAwardBalance(),
      poolContract.callStatic.balance(),
      strategyContract?.prizePeriodEndAt(),
    ])

    const numberOfBlocks = new Big(periodEndAt)
      .minus(Date.now() / 1000)
      .div(SECONDS_PER_BLOCK)

    const scaledBalance = new Big(balance).div(10 ** token.decimals)
    const scaledAwardBalance = new Big(awardBalance).div(
      10 ** token.decimals
    )
    const scaledSupplyRatePerBlock = new Big(supplyRateByBlock).div(
      10 ** 18
    )

    const prize = scaledBalance
      .times(numberOfBlocks)
      .times(scaledSupplyRatePerBlock)
      .plus(scaledAwardBalance)

    return prize.toFixed(2)
  }
}