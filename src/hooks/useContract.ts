import { useEffect } from "react"
import { useConnection } from "../web3/ConnectionContext"
import ethers from 'ethers'
import useAsyncMemo from "./useAsyncMemo"

const getContact = ((provider: any, networkId: any, address: string, abi: any) => {
  if (networkId && address && abi) {
    const signer: any = provider?.getSigner?.()
    if (signer) {
      return new ethers.Contract(address, abi, ethers.getDefaultProvider(networkId)).connect(signer)
    }
    return new ethers.Contract(address, abi, ethers.getDefaultProvider(networkId))
  }
  return null
})

const useContract = (addressRetriever: string | Function, abi: any) => {
  const { networkId, safeInfo, provider, contracts, setContracts } = useConnection()

  const address = useAsyncMemo<string>(async () => {
    if (typeof addressRetriever === 'string') {
      return addressRetriever
    } else if (addressRetriever instanceof Function) {
      return await addressRetriever()
    }
    return ''
  }, '', [addressRetriever])

  useEffect(() => {
    if (address && !contracts?.[address] && provider && abi && safeInfo.safeAddress) {
      setContracts((contracts: any) => ({...contracts, [address]: getContact(provider, networkId, address, abi)}))
    }
  }, [abi, networkId, safeInfo.safeAddress, provider, address, setContracts, addressRetriever, contracts])


  return contracts?.[address]
} 

export default useContract