import React from "react"
import Big from "big.js"
import { Loader, Text } from "@gnosis.pm/safe-react-components"
import { ThemeTextSize } from "@gnosis.pm/safe-react-components/dist/theme"
import { Button } from "@material-ui/core"

const BalanceText = ({
  decimals = 0,
  amount,
  label = "",
  unit = "",
  precision = 2,
  size = "md",
  loading = false,
  onClick,
  ...props
}: {
  decimals?: number
  amount?: any
  label?: string
  unit?: string
  precision?: number
  size?: ThemeTextSize
  loading?: boolean
  onClick?: () => void
}) => {
  return loading ? (
    <Loader size="xs" />
  ) : (
    <Button variant="text" onClick={onClick}>
      <Text size={size} {...props}>
        {label && `${label} `}
        {new Big(amount.toString()).div(`1e${decimals}`).toFixed(precision)}
        {unit && ` ${unit}`}
      </Text>
    </Button>
  )
}

export default BalanceText
