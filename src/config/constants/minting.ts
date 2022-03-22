import { Token, ChainId } from '@pancakeswap/sdk'
import tokens from './tokens'
import farms from './farms'
import { Ifo, Minting } from './types'

//export const cakeBnbLpToken = new Token(ChainId.MAINNET, farms[1].lpAddresses[ChainId.MAINNET], 18, farms[1].lpSymbol)

const ifos: Minting[] = [
  {
    id: 'era',
    address: '0x569B70fc565AFba702d9e77e75FD3e3c78F57eeD',
    isActive: true,
    status: 'coming_soon',
    name: 'CoinCollect NFTs',
    poolBasic: {
      saleAmount: '500 NFT',
      raiseAmount: '$360,000',
      cakeToBurn: '$0',
      distributionRatio: 0.2,
    },
    poolUnlimited: {
      saleAmount: '4500 NFT',
      raiseAmount: '$1,440,000',
      cakeToBurn: '$0',
      distributionRatio: 0.8,
    },
    currency: tokens.cake,
    token: tokens.collect,
    releaseBlockNumber: 15156634,
    campaignId: '511180000',
    articleUrl: 'https://coincollect.org',
    tokenOfferingPrice: 0.09,
    version: 3.1,
    telegramUrl: 'https://t.me/CoinCollectOrg',
    twitterUrl: 'https://twitter.com/CoinCollectOrg',
    description:
      'CoinCollect is a Decentralized NFT finance Protocol operating on Multi-Chains, that helps NFT traders, high yield farmers, liquidity providers, developers and web 3.0 startups to participate in an open financial market with no barriers to entry.',
  },
]

export default ifos
