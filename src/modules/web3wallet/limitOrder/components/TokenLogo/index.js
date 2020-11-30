import React, { useState } from 'react'
import styled from 'styled-components'
import { isAddress } from '../../utils'

// import { ReactComponent as BnbLogo } from '../../assets/images/ethereum-logo.svg'
import { ReactComponent as BnbLogo } from '../../assets/images/bnb-logo.svg'

// const TOKEN_ICON_API = address =>
//   `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${isAddress(
//     address
//   )}/logo.png`
const TOKEN_ICON_API = address =>
  `https://tokens.bscswap.com/images/${isAddress(
    address
  )}.png`

const BAD_IMAGES = {}

const Image = styled.img`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  background-color: white;
  border-radius: 1rem;
`

const Emoji = styled.span`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
`

const StyledBnbLogo = styled(BnbLogo)`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
`

export default function TokenLogo({ address, size = '1rem', ...rest }) {
  const [error, setError] = useState(false)

  let path = ''
  if (address === 'BNB') {
    return <StyledBnbLogo size={size} />
  } else if (!error && !BAD_IMAGES[address]) {
    path = TOKEN_ICON_API(address.toLowerCase())
  } else {
    return (
      <Emoji {...rest} size={size}>
        <span style={{ lineHeight: 0 }} role="img" aria-label="Thinking">
          🌕
        </span>
      </Emoji>
    )
  }

  return (
    <Image
      {...rest}
      alt={address}
      src={path}
      size={size}
      onError={() => {
        BAD_IMAGES[address] = true
        setError(true)
      }}
    />
  )
}
