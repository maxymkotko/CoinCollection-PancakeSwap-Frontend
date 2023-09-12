import React from 'react'
import { Flex, Link, Text, TimerIcon } from '@pancakeswap/uikit'
import { getPolygonScanLink } from 'utils'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import Balance from 'components/Balance'
import { getFullDisplayBalance } from 'utils/formatBalance'
import { Token } from '@coincollect/sdk'

interface MaxStakeRowProps {
  small?: boolean
  stakingLimit: BigNumber
  currentBlock: number
  stakingLimitEndBlock: number
  stakingToken: Token
  hasPoolStarted: boolean
}

const MaxStakeRow: React.FC<MaxStakeRowProps> = ({
  small = false,
  stakingLimit,
  currentBlock,
  stakingLimitEndBlock,
  stakingToken,
  hasPoolStarted,
}) => {
  const { t } = useTranslation()

  return (
    <Flex flexDirection="column">
      <Flex justifyContent="space-between" alignItems="center">
        <Text small={small}>{t('Max. stake')}:</Text>
        <Text small={small}>{`${getFullDisplayBalance(stakingLimit, stakingToken.decimals, 0)} ${
          stakingToken.symbol
        }`}</Text>
      </Flex>
      {hasPoolStarted && (
        <Flex justifyContent="space-between" alignItems="center">
          <Text small={small}>{t('Stake limit ends')}:</Text>
          <Link external href={getPolygonScanLink(stakingLimitEndBlock, 'countdown')}>
            <Balance
              small={small}
              value={Math.max(stakingLimitEndBlock - currentBlock, 0)}
              decimals={0}
              color="primary"
            />
            <Text small={small} ml="4px" color="primary" textTransform="lowercase">
              {t('Blocks')}
            </Text>
            <TimerIcon ml="4px" color="primary" />
          </Link>
        </Flex>
      )}
    </Flex>
  )
}

export default MaxStakeRow
