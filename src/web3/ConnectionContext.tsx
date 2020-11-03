import React, { useCallback, useContext, useEffect, useState } from "react"
import initSdk, { SafeInfo } from "@gnosis.pm/safe-apps-sdk"
import Web3 from "web3"
import { ethers } from "ethers"

type NetworkId = 1 | 4
const networks = {
  1: "mainnet",
  4: "rinkeby",
}

const appsSdk = initSdk()

const ConnectionContext = React.createContext<any>(null)

export const Connector = ({ children }: { children: any }) => {
  const [safeInfo, setSafeInfo] = useState<SafeInfo>()
  const [connection, setConnection] = useState<any>()
  const [networkId, setNetworkId] = useState<NetworkId>()
  const [provider, setProvider] = useState<ethers.providers.Web3Provider>()
  const [txQueue, setTxQueue] = useState<Record<string, any>>({})

  const getContract = useCallback(
    (address: string, abi: any) => {
      if (provider && networkId && address && abi) {
        const signer: any = provider?.getSigner?.()
        if (signer) {
          return new ethers.Contract(address, abi, provider).connect(signer)
        }
        return new ethers.Contract(address, abi, provider)
      }
    },
    [networkId, provider]
  )

  useEffect(() => {
    const web3 = new Web3(process.env.REACT_APP_WEB3_PROVIDER_URL || "")
    setConnection(web3)
    web3.eth.net.getId().then((id: number) => {
      if ([1, 4].includes(id)) {
        setNetworkId(id as NetworkId)
        setProvider(
          ethers.getDefaultProvider(
            networks[id as NetworkId]
          ) as ethers.providers.Web3Provider
        )
      }
    })
  }, [])

  const wait = async (requestId: string, callback: Function) => {
    setTxQueue(({ ...queue }) => ({ ...queue, [requestId]: callback }))
  }

  // config safe connector
  useEffect(() => {
    appsSdk.addListeners({
      onSafeInfo: setSafeInfo,
      onTransactionConfirmation: (e) => {
        txQueue[e.requestId]?.("confirmed", e.safeTxHash)
      },
      onTransactionRejection: (e) => {
        txQueue[e.requestId]?.("rejected")
      },
    })

    return () => appsSdk.removeListeners()
  }, [txQueue])

  return (
    <ConnectionContext.Provider
      value={{
        safeInfo,
        connection,
        provider,
        networkId,
        network:
          typeof networkId !== "undefined" ? networks[networkId] : undefined,
        getContract,
        appsSdk,
        wait,
      }}
    >
      {children}
    </ConnectionContext.Provider>
  )
}

export const useConnection = (): any => {
  const context = useContext(ConnectionContext)

  if (!context) {
    throw new Error("Component rendered outside the provider tree")
  }
  return context
}

export default ConnectionContext
