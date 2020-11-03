import React from "react"
import ReactDOM from "react-dom"
import { ThemeProvider } from "styled-components"
import { Loader, Title } from "@gnosis.pm/safe-react-components"
import SafeProvider from "@rmeissner/safe-apps-react-sdk"

import GlobalStyle from "./GlobalStyle"
import App from "./App"
import { Connector } from "./web3/ConnectionContext"
import getTheme from "./theme"

const theme = getTheme()

ReactDOM.render(
  <>
    <GlobalStyle />
    <ThemeProvider theme={theme}>
      <SafeProvider
        loading={
          <>
            <Title size="md">Waiting for Safe...</Title>
            <Loader size="md" />
          </>
        }
      >
        <Connector>
          <App />
        </Connector>
      </SafeProvider>
    </ThemeProvider>
  </>,
  document.getElementById("root")
)
