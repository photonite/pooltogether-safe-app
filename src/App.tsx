import React, { useEffect, useState } from "react"
import { Title, Section, Text, Select } from "@gnosis.pm/safe-react-components"
import styled from "styled-components"
import { useConnection } from "./web3/ConnectionContext"
import { formatBigNumber, getTokenList, TokenItem } from "./config"
import CErc20 from "./abis/CErc20"
import PrizePool from "./abis/PrizePool"
import useAsyncMemo from "./hooks/useAsyncMemo"
import SingleRandomWinner from "./abis/SingleRandomWinner"
import WidgetWrapper from "./components/WidgetWrapper"
import Pool from "./components/Pool"

const SelectContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: left;

  margin-bottom: 15px;

  *:first-child {
    margin-right: 5px;
  }
`

const PoolTogetherWidget = () => {
  const {
    connection,
    getContract,
    safeInfo,
    provider,
    networkId,
  } = useConnection()
  const [tokens, setTokens] = useState<Array<TokenItem>>([])
  const [selectedToken, setSelectedToken] = useState<TokenItem | null>()
  const [pools, setPools] = useState<Record<string, any>>({})

  const tokenBalance = useAsyncMemo(
    async () => {
      if (safeInfo && selectedToken && pools[selectedToken.id]) {
        return pools[selectedToken.id].tokenContract.balanceOf(
          safeInfo.safeAddress
        )
      }
      return "0.00"
    },
    "0.00",
    [safeInfo, selectedToken, selectedToken && pools[selectedToken.id]]
  )

  useEffect(() => {
    if (connection && !tokens.length) {
      getTokenList(connection).then((tokens: Array<TokenItem>) => {
        setTokens(tokens)
        setSelectedToken(tokens[0])
      })
    }
  }, [connection, getContract, tokens.length])

  useEffect(() => {
    if (tokens.length && provider && networkId) {
      setPools(
        tokens.reduce(
          (pools, token: TokenItem) => ({
            ...pools,
            [token.id]: {
              tokenContract: getContract(token.tokenAddr, CErc20),
              poolContract: getContract(token.poolAddr, PrizePool),
              strategyContract: getContract(
                token.strategyAddr,
                SingleRandomWinner
              ),
            },
          }),
          {}
        )
      )
    }
  }, [getContract, networkId, provider, tokens])

  const onSelectItem = (id: string) => {
    if (!tokens.length) {
      return
    }
    const selectedToken = tokens.find((t) => t.id === id)
    if (!selectedToken) {
      return
    }
    setSelectedToken(selectedToken)
  }

  return (
    <WidgetWrapper>
      <Title size="xs">PoolTogether</Title>
      <Section>
        <SelectContainer>
          <Select
            items={tokens || []}
            activeItemId={selectedToken?.id || ""}
            onItemClick={onSelectItem}
          />
          <Text strong size="lg">
            ~ {!!selectedToken && formatBigNumber(tokenBalance, selectedToken)}
          </Text>
        </SelectContainer>
        {!!selectedToken && pools[selectedToken.id] && (
          <Pool
            pool={pools[selectedToken.id]}
            token={selectedToken}
            tokenBalance={tokenBalance}
          />
        )}
      </Section>
    </WidgetWrapper>
  )
}

export default PoolTogetherWidget
