import { SerializedNftFarmConfig } from 'config/constants/types'
import BigNumber from 'bignumber.js'
import { BIG_TEN, BIG_ZERO } from '../../utils/bigNumber'
import { fetchPublicFarmsData } from './fetchPublicFarmData'
import { fetchMasterChefData } from './fetchMasterChefData'
import farmsConfig from 'config/constants/nftFarms'
import { getAddress } from 'utils/addressHelpers'
import { multicallPolygonv1 } from 'utils/multicall'
import sousChefABI from 'config/abi/sousChef.json'

const smartNftStakeFarms = farmsConfig.filter((f) => f.contractAddresses)
const startEndBlockCalls = smartNftStakeFarms.flatMap((nftFarmConfig) => {
  return [
    {
      address: getAddress(nftFarmConfig.contractAddresses),
      name: 'startBlock',
    },
    {
      address: getAddress(nftFarmConfig.contractAddresses),
      name: 'bonusEndBlock',
    },
  ]
})

export const fetchNftFarmsBlockLimits = async () => {
  const startEndBlockRaw = await multicallPolygonv1(sousChefABI, startEndBlockCalls)

  const startEndBlockResult = startEndBlockRaw.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / 2)

    if (!resultArray[chunkIndex]) {
      // eslint-disable-next-line no-param-reassign
      resultArray[chunkIndex] = [] // start a new chunk
    }

    resultArray[chunkIndex].push(item)

    return resultArray
  }, [])

  return smartNftStakeFarms.map((nftFarmConfig, index) => {
    const [[startBlock], [endBlock]] = startEndBlockResult[index]
    return {
      pid: nftFarmConfig.pid,
      startBlock: startBlock.toNumber(),
      endBlock: endBlock.toNumber(),
    }
  })
}

const fetchFarms = async (farmsToFetch: SerializedNftFarmConfig[], currentBlock: number) => {

  const blockLimits = await fetchNftFarmsBlockLimits()
  
  // Information about LP Token Contract(Pair)
  const farmResult = await fetchPublicFarmsData(farmsToFetch)

  // Only farms in nftStakeContract(not smartchef)
  const coinCollectFarms = farmsToFetch.filter((f) => !f.contractAddresses)

  // Information about Farming Pools on Masterchef
  const masterChefResult = await fetchMasterChefData(coinCollectFarms)


  return farmsToFetch.map((farm, index) => {
    const blockLimit = blockLimits.find((entry) => entry.pid === farm.pid)
    const isPoolEndBlockExceeded = currentBlock > 0 && blockLimit ? currentBlock > Number(blockLimit.endBlock) : false
    const isPoolFinished = farm.isFinished || isPoolEndBlockExceeded

    // LP Token Contract(Pair) datas
    const [lpTokenBalanceMC, lpTotalSupply] = farmResult[index]
      
    // Farming Pools on Masterchef
    const [info, totalAllocPoint] = coinCollectFarms.includes(farm) ? masterChefResult[index] : [null,null]
    const allocPoint = info ? new BigNumber(info.allocPoint?._hex) : BIG_ZERO
    const poolWeight = totalAllocPoint ? allocPoint.div(new BigNumber(totalAllocPoint)) : BIG_ZERO

    return {
      ...farm,
      ...blockLimit,
      lpTotalSupply: new BigNumber(lpTotalSupply).toJSON(),
      totalStaked: new BigNumber(lpTokenBalanceMC).toJSON(),
      poolWeight: poolWeight.toJSON(),
      multiplier: `${allocPoint.div(100).toString()}X`,
      isFinished: isPoolFinished,
    }
  })
}

export default fetchFarms
