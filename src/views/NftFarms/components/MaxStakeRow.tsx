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
  stakingTokenSymbol: string
  hasPoolStarted: boolean
}

const MaxStakeRow: React.FC<MaxStakeRowProps> = ({
  small = false,
  stakingLimit,
  currentBlock,
  stakingLimitEndBlock,
  stakingTokenSymbol,
  hasPoolStarted,
}) => {
  const { t } = useTranslation()

  return (
    <Flex flexDirection="column">
      <Flex justifyContent="space-between" alignItems="center">
        <Text small={small}>{t('Max. stake per user')}:</Text>
        <Text small={small}>{`${stakingLimit.toNumber()} ${
          stakingTokenSymbol
        }`}</Text>
      </Flex>
      {hasPoolStarted && (
        <Flex justifyContent="space-between" alignItems="center">
          <Text small={small}>{t('Max. stake limit ends in')}:</Text>
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
