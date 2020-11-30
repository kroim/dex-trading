import React, { createContext, useContext, useState, useEffect, useMemo } from 'react'
import { ethers } from 'ethers'
import { useBlockNumber } from './Application'

const GasContext = createContext()

function useGasContext() {
  return useContext(GasContext)
}

export default function Provider({ children }) {
  const [gasPrice, setGasPrice] = useState()

  const globalBlockNumber = useBlockNumber()

  useEffect(() => {
    fetch("https://gasbsc.justliquidity.org/").then((res) => {
      res.json().then(gasInfo => {
        try {
          // setGasPrice(ethers.BigNumber.from(gasInfo.data.fast))
          setGasPrice(ethers.BigNumber.from(gasInfo.fast).mul(1000000000))
        } catch {}
      })
    })
  }, [globalBlockNumber])

  return (
    <GasContext.Provider value={useMemo(() => [gasPrice, { setGasPrice }], [gasPrice, setGasPrice])}>
      {children}
    </GasContext.Provider>
  )
}

export function useGasPrice() {
  const [gasPrice] = useGasContext()
  return gasPrice
}
