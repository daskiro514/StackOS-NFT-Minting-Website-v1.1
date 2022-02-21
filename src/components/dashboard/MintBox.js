import React from "react"
import stackNFT2SonAbi from '../../abi/stack_nft2_son.json'
import dfynRouter02Abi from '../../abi/dfyn_router02.json'
import stackUsdcPairAbi from '../../abi/stack_usdc_pair.json'

const stackNFT2SonContractAddress = '0x8aD072Dc246F72A1f632d5FD79da12EcbF87713a'
const dfynRouter02Address = '0xA102072A4C07F06EC3B4900FDC4C7B80b6c57429'
const stackUsdcPairAddress = '0x4efd21b3e10110bD4d88A8b3ad34EeB4D4B1FcFD'
const polygonUsdtAddress = '0xc2132d05d31c914a87c6611c10748aeb04b58e8f'
const polygonUsdcAddress = '0x2791bca1f2de4661ed88a30c99a7a9449aa84174'
const polygonDaiAddress = '0x490e379c9cff64944be82b849f8fd5972c7999a7'

const MintBox = ({ walletAddress, walletStackBalance, walletUsdtBalance, walletUsdcBalance, walletDaiBalance }) => {
  const [mintValue, setMintValue] = React.useState(100)
  const [currency, setCurrency] = React.useState('STACK')
  const [walletBalance, setWalletBalance] = React.useState(null)
  const [mintPrice, setMintPrice] = React.useState(null)
  const [mintUsdPrice, setMintUsdPrice] = React.useState(null)
  const [mintStackPrice, setMintStackPrice] = React.useState(null)

  React.useEffect(() => {
    setMintPrice(mintUsdPrice)
    if (currency === 'STACK') {
      setWalletBalance(walletStackBalance)
      setMintPrice(mintStackPrice)
    }
    if (currency === 'USDT') {
      setWalletBalance(walletUsdtBalance)
    }
    if (currency === 'USDC') {
      setWalletBalance(walletUsdcBalance)
    }
    if (currency === 'DAI') {
      setWalletBalance(walletDaiBalance)
    }
  }, [currency, mintUsdPrice, mintStackPrice, walletStackBalance, walletUsdtBalance, walletUsdcBalance, walletDaiBalance])

  React.useEffect(() => {
    setWalletBalance(walletStackBalance)
    setMintPrice(mintStackPrice)
  }, [walletStackBalance, mintStackPrice])


  const getMintUsdPrice = async () => {
    if (window.web3.eth) {
      let contract = new window.web3.eth.Contract(stackNFT2SonAbi, stackNFT2SonContractAddress)
      let _mintUsdPrice = await contract.methods.mintPrice().call()
      _mintUsdPrice = _mintUsdPrice / 10 ** 18
      setMintUsdPrice(_mintUsdPrice)
    }
  }

  React.useEffect(() => {
    getMintUsdPrice()
  }, [])

  const getUsdcAndStackReserves = React.useCallback(async () => {
    if (window.web3.eth) {
      let contract = new window.web3.eth.Contract(stackUsdcPairAbi, stackUsdcPairAddress)
      let _reserves = await contract.methods.getReserves().call()
      let _usdcReserve = _reserves[0]
      let _stackReserve = _reserves[1]

      let contract1 = new window.web3.eth.Contract(dfynRouter02Abi, dfynRouter02Address)
      let _mintStackPrice = await contract1.methods.getAmountOut(mintUsdPrice * 10 ** 6, _usdcReserve, _stackReserve).call()
      _mintStackPrice = _mintStackPrice / 10 ** 18
      setMintStackPrice(_mintStackPrice)
    }
  }, [mintUsdPrice])

  React.useEffect(() => {
    if (mintUsdPrice) {
      getUsdcAndStackReserves()
    }
  }, [mintUsdPrice, getUsdcAndStackReserves])

  const mintNFT = async () => {
    let contract = new window.web3.eth.Contract(stackNFT2SonAbi, stackNFT2SonContractAddress)
    if (currency === 'STACK') {
      await contract.methods.mint(mintValue).send({ from: walletAddress })
    } else if (currency === 'USDT') {
      await contract.methods.mintForUsd(mintValue, polygonUsdtAddress).send({ from: walletAddress })
    } else if (currency === 'USDC') {
      await contract.methods.mintForUsd(mintValue, polygonUsdcAddress).send({ from: walletAddress })
    } else if (currency === 'DAI') {
      await contract.methods.mintForUsd(mintValue, polygonDaiAddress).send({ from: walletAddress })
    }
  }

  return (
    <div className='py-5 text-center'>
      <div className='box-shadow rounded-lg p-3' style={{ minHeight: '280px' }}>
        <div className='h2 text-center'>Mint Your Node NFT</div>
        <div className='text-center text-primary my-2'>Current Node Generation: 1</div>
        <div className='text-center my-2'>
          <span className='h3 border-bottom mx-2'>
            <input
              type='number'
              value={mintValue}
              className='stack-input h3'
              onChange={e => setMintValue(e.target.value)}
            />
          </span>
          <span>NFT</span>
        </div>
        <div className='text-center my-2'>
          <select className='currency-select h4 rounded-lg' value={currency} onChange={e => setCurrency(e.target.value)}>
            <option value='STACK'>STACK</option>
            <option value='USDT'>USDT</option>
            <option value='USDC'>USDC</option>
            <option value='DAI'>DAI</option>
          </select>
        </div>
        <div className='row'>
          <div className='col-6'>
            <div className='text-primary text-right'>Price:</div>
          </div>
          <div className='col-6 pl-0 text-left'>
            <span className='text-white'>{mintPrice}</span>
            <span className='text-primary'> {currency}</span>
          </div>
        </div>
        <div className='row'>
          <div className='col-6'>
            <div className='text-primary text-right'>Wallet Balance:</div>
          </div>
          <div className='col-6 pl-0 text-left'>
            <span className='text-white'>{walletBalance}</span>
            <span className='text-primary'> {currency}</span>
          </div>
        </div>
        <div className='row'>
          <div className='col-6'>
            <div className='text-primary text-right'>Total Amount to Buy:</div>
          </div>
          <div className='col-6 pl-0 text-left'>
            <span className='text-white'>{mintPrice * mintValue}</span>
            <span className='text-primary'> {currency}</span>
          </div>
        </div>
        <div className='row mb-3'>
          <div className='col-md-12 text-center mt-3'>
            <button
              className='btn btn-primary rounded-pill'
              onClick={() => mintNFT()}
              disabled={mintPrice * mintValue > walletBalance ? true : false}
            >
              Mint NFTs
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MintBox