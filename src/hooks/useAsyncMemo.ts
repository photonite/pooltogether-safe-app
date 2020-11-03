import { useState, useEffect, useMemo } from 'react'

export function useAsyncMemo<T>(
  callback: () => Promise<T>,
  init: T,
  dependencies: any[] = [],
  onError?: (e: Error) => void,
): T {
  const [output, setOutput] = useState<T>(init)

  const _callback = useMemo(callback, dependencies)

  useEffect(() => {
    let isNotCancelled = true
    setOutput(init)
    _callback.then(payload => {
      if (isNotCancelled) {
        setOutput(payload)
      }
    })

    return () => {
      isNotCancelled = false
    }
  }, [_callback, init])

  useEffect(() => {
    _callback.catch(onError)
  }, [_callback, onError])

  return output
}

export default useAsyncMemo
