import React from 'react'
import { connect } from 'react-redux'
import Web3 from "web3"
import Web3Modal from "web3modal"
import logo from '../../img/logo.svg'
import ellipseAddress from '../../utils/ellipseAddress'
import { setAlert } from '../../actions/alert'
import stackNFTGenesisAbi from '../../abi/stack_nft_genesis.json'
import stackOsAbi from '../../abi/stack_os.json'
import stackNFT2SonAbi from '../../abi/stack_nft2_son.json'
import polygonUsdtAbi from '../../abi/polygon_usdt.json'
import polygonUsdcAbi from '../../abi/polygon_usdc.json'
import polygonDaiAbi from '../../abi/polygon_dai.json'
import dfynRouter02Abi from '../../abi/dfyn_router02.json'
import stackUsdcPairAbi from '../../abi/stack_usdc_pair.json'
const stackNFTGenesisContractAddress = '0xbD72cFc3d0055438BE59662Dbf581e90B21b6e45'
const stackOSContractAddress = '0x980111ae1B84E50222C8843e3A7a038F36Fecd2b'
const stackNFT2SonContractAddress = '0x8aD072Dc246F72A1f632d5FD79da12EcbF87713a'
const polygonUsdtAddress = '0xc2132d05d31c914a87c6611c10748aeb04b58e8f'
const polygonUsdcAddress = '0x2791bca1f2de4661ed88a30c99a7a9449aa84174'
const polygonDaiAddress = '0x490e379c9cff64944be82b849f8fd5972c7999a7'
const dfynRouter02Address = '0xA102072A4C07F06EC3B4900FDC4C7B80b6c57429'
const stackUsdcPairAddress = '0x4efd21b3e10110bD4d88A8b3ad34EeB4D4B1FcFD'

const Dashboard = ({ setAlert }) => {

  const providerOptions = {
    /* See Provider Options Section */
  }

  const web3Modal = new Web3Modal({
    network: "mainnet", // optional
    cacheProvider: true, // optional
    providerOptions // required
  })

  const [topTab, setTopTab] = React.useState('Gen0')
  const [tab, setTab] = React.useState('Lottery')

  const [walletAddress, setWalletAddress] = React.useState(null)
  const [walletStackBalance, setWalletStackBalance] = React.useState(null)
  const [walletUsdtBalance, setWalletUsdtBalance] = React.useState(null)
  const [walletUsdcBalance, setWalletUsdcBalance] = React.useState(null)
  const [walletDaiBalance, setWalletDaiBalance] = React.useState(null)
  const ticketPrice = 400
  const [numberOfTicket, setnumberOfTicket] = React.useState(1)
  const [bidValue, setBidValue] = React.useState(1000)
  const [top20Biders, setTop20Biders] = React.useState([])
  const [top20Bids, setTop20Bids] = React.useState([])
  const [showModal, setShowModal] = React.useState('none')

  const maxNumberOfTicket = 50

  const ticketNumberIncrement = () => {
    if (numberOfTicket + 1 > maxNumberOfTicket) {
      setAlert('Maximum Value Overflow', 'warning')
      return
    }
    setnumberOfTicket(numberOfTicket + 1)
  }

  const ticketNumberDecrement = () => {
    if (numberOfTicket - 1 < 1) {
      setAlert('It can not be set as 0', 'warning')
      return
    }
    setnumberOfTicket(numberOfTicket - 1)
  }

  const connectWallet = async () => {
    let _provider = null
    let _web3 = null
    let _accounts = null

    _provider = await web3Modal.connect()
    _web3 = new Web3(_provider)
    _accounts = await _web3.eth.getAccounts()

    setWalletAddress(_accounts[0].toLowerCase())
    localStorage.setItem('walletAddress', _accounts[0].toLowerCase())
  }

  const disconnectWallet = async () => {
    setWalletAddress(null)
    localStorage.setItem('walletAddress', null)
  }

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    } else {
      console.log("Non-Ethereum browser detected. You should consider trying MetaMask!")
    }
  }

  const getWalletBalance = async () => {
    if (window.web3.eth) {
      let contractForStack = new window.web3.eth.Contract(stackOsAbi, stackOSContractAddress)
      let contractForUsdt = new window.web3.eth.Contract(polygonUsdtAbi, polygonUsdtAddress)
      let contractForUsdc = new window.web3.eth.Contract(polygonUsdcAbi, polygonUsdcAddress)
      let contractForDai = new window.web3.eth.Contract(polygonDaiAbi, polygonDaiAddress)
      if (walletAddress) {
        let stackBalance = await contractForStack.methods.balanceOf(walletAddress).call()
        stackBalance = stackBalance / 10 ** 18
        setWalletStackBalance(stackBalance)

        let usdtBalance = await contractForUsdt.methods.balanceOf(walletAddress).call()
        usdtBalance = usdtBalance / 10 ** 6
        setWalletUsdtBalance(usdtBalance)

        let usdcBalance = await contractForUsdc.methods.balanceOf(walletAddress).call()
        usdcBalance = usdcBalance / 10 ** 6
        setWalletUsdcBalance(usdcBalance)

        let daiBalance = await contractForDai.methods.balanceOf(walletAddress).call()
        daiBalance = daiBalance / 10 ** 18
        setWalletDaiBalance(daiBalance)
      } else {
        setWalletAddress()
      }
    }
  }

  const getTop20Biders = async () => {
    if (window.web3.eth) {
      let contract = new window.web3.eth.Contract(stackNFTGenesisAbi, '0xeF84982226130c86af2F22473a3b1891Dd7F7495')
      let _top20Biders = await contract.methods.topBiders(20).call()
      if (_top20Biders === '0x0000000000000000000000000000000000000000') {
        setTop20Biders([])
      } else {
        alert('There are some top biders')
      }
      let _top20Bids = await contract.methods.topBids(20).call()
      if (_top20Bids === '0') {
        setTop20Bids([])
      } else {
        alert('There are some top bids')
      }
    }
  }

  const getPageData = async () => {
    await getWalletBalance()
    await getTop20Biders()
  }

  React.useEffect(() => {
    let _walletAddress = localStorage.getItem('walletAddress')
    if (_walletAddress !== 'null') {
      setWalletAddress(_walletAddress)
    }
    loadWeb3()
  }, [])

  React.useEffect(() => {
    if (walletAddress) {
      getPageData()
    }
  }, [walletAddress])

  const placeBid = async () => {
    let contract = new window.web3.eth.Contract(stackNFTGenesisAbi, stackNFTGenesisContractAddress)
    await contract.methods.placeBid(bidValue).send({ from: walletAddress })
  }

  const buyTickets = async () => {
    let contract = new window.web3.eth.Contract(stackNFTGenesisAbi, '0xeF84982226130c86af2F22473a3b1891Dd7F7495')
    await contract.methods.stakeForTickets(numberOfTicket).send({ from: walletAddress })
  }

  const [mintValue, setMintValue] = React.useState(100)
  const [mintPrice, setMintPrice] = React.useState(null)
  const [mintUsdPrice, setMintUsdPrice] = React.useState(null)
  const [mintStackPrice, setMintStackPrice] = React.useState(null)

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

  const getUsdcAndStackReserves = async () => {
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
  }

  React.useEffect(() => {
    if (mintUsdPrice) {
      getUsdcAndStackReserves()
    }
  }, [mintUsdPrice])

  const [currency, setCurrency] = React.useState('STACK')
  const [walletBalance, setWalletBalance] = React.useState(null)

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
    <div className='customer-dashboard bg-dark text-white'>
      <div className='left-image'></div>
      <div className='right-image'></div>
      <div className='container-fluid'>
        <div className='row bg-dark header-box-shadow'>
          <div className='col-md-4 p-4'>
            <img src={logo} alt='SETIMAGE' />
          </div>
          <div className='col-md-4 text-center text-primary h3 p-3'>
            <div className='d-flex justify-content-center cursor-pointer'>
              <div className={'mr-3 px-2 py-1 ' + (topTab === 'Gen0' ? 'header-nav-border-bottom' : '')} onClick={() => setTopTab('Gen0')}>
                Gen0
              </div>
              <div className={'mr-3 px-2 py-1 ' + (topTab === 'Gen1' ? 'header-nav-border-bottom' : '')} onClick={() => setTopTab('Gen1')}>
                Gen1
              </div>
            </div>
          </div>
          <div className='col-md-4 text-right p-4'>
            {walletAddress
              ?
              <>
                <span className='mr-3'>{ellipseAddress(walletAddress)}</span>
                <button
                  className='btn btn-primary rounded-pill'
                  onClick={() => disconnectWallet()}
                >
                  Disconnect
                </button>
              </>
              :
              <button
                className='btn btn-primary rounded-pill'
                onClick={() => connectWallet()}
              >
                Connect Wallet
              </button>
            }
          </div>
        </div>
      </div>
      {topTab === 'Gen0'
        ?
        <div className='container'>
          <div className='row py-5'>
            <div className='col-md-3'></div>
            <div className='col-md-6'>
              <div className='box-shadow rounded-lg'>
                <div className='row'>
                  <div className='col-md-6 text-center cursor-pointer' onClick={() => setTab('Lottery')}>
                    <div className={'p-2 ' + (tab === 'Lottery' ? 'box-shadow-bold' : null)}>
                      Lottery
                    </div>
                  </div>
                  <div className='col-md-6 text-center cursor-pointer' onClick={() => setTab('Auction')}>
                    <div className={'p-2 ' + (tab === 'Auction' ? 'box-shadow-bold' : null)}>
                      Auction
                    </div>
                  </div>
                </div>
              </div>
              {tab === 'Lottery'
                ?
                <div className='box-shadow rounded-lg p-3'>
                  <div className='h2 text-center'>Number of Tickets</div>
                  <div className='text-center'>
                    <i onClick={() => ticketNumberDecrement()} className="fa fa-minus h3 mr-3 font-weight-lighter cursor-pointer"></i>
                    <span>
                      <span className='h1 font-weight-bolder'>{numberOfTicket}/</span>
                      <span className='h3'>{maxNumberOfTicket}</span>
                    </span>
                    <i onClick={() => ticketNumberIncrement()} className="fa fa-plus h3 ml-3 font-weight-lighter cursor-pointer"></i>
                  </div>
                  <div className='row'>
                    <div className='col-6'>
                      <div className='text-primary text-right'>Price:</div>
                    </div>
                    <div className='col-6 pl-0'>
                      <span className='text-white'>{ticketPrice}</span>
                      <span className='text-primary'> STACK</span>
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-6'>
                      <div className='text-primary text-right'>Wallet Balance:</div>
                    </div>
                    <div className='col-6 pl-0'>
                      <span className='text-white'>{walletStackBalance}</span>
                      <span className='text-primary'> STACK</span>
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-6'>
                      <div className='text-primary text-right'>Total Amount to Buy:</div>
                    </div>
                    <div className='col-6 pl-0'>
                      <span className='text-white'>{numberOfTicket * ticketPrice}</span>
                      <span className='text-primary'> STACK</span>
                    </div>
                  </div>
                  <div className='text-center mt-3'>
                    <button
                      className='btn btn-primary rounded-pill'
                      disabled={numberOfTicket * ticketPrice > walletStackBalance ? true : false}
                      onClick={() => buyTickets()}
                    >
                      Buy Ticket
                    </button>
                  </div>
                </div>
                : tab === 'Auction'
                  ?
                  <div className='box-shadow rounded-lg p-3'>
                    <div className='h2 text-center'>Auction</div>
                    <div className='text-primary text-center mb-3'>Top 20 Bids</div>
                    {[1, 2, 3, 4, 5, 6].map((item, index) =>
                      <div key={index} className='d-flex justify-content-between py-2 border-bottom border-secondary'>
                        <div className='text-primary'>
                          <span className='mr-3'>{index + 1}</span>
                          <span className='badge rounded-pill bg-primary text-primary font-18 mr-2'>8</span>
                          <span>0x8be3...37e</span>
                        </div>
                        <div className='mr-4'>2000 STACK (FAKE)</div>
                      </div>
                    )}
                    {top20Bids.map((item, index) =>
                      <div key={index} className='d-flex justify-content-between py-2 border-bottom border-secondary'>
                        <div className='text-primary'>
                          <span className='mr-3'>{index + 1}</span>
                          <span className='badge rounded-pill bg-primary text-primary font-18 mr-2'>8</span>
                          <span>0x8be3...37e</span>
                        </div>
                        <div className='mr-4'>2000 STACK</div>
                      </div>
                    )}
                    <div className='row mt-4'>
                      <div className='col-6'>
                        <div className='text-primary text-right'>Wallet Balance:</div>
                      </div>
                      <div className='col-6 pl-0'>
                        <span className='text-white'>{walletStackBalance}</span>
                        <span className='text-primary'> STACK</span>
                      </div>
                    </div>
                    <div className='text-center mt-3'>
                      <span className='text-primary'>Place your bid: </span>
                      <span className='h3 border-bottom mx-2'>
                        <input
                          type='number'
                          value={bidValue}
                          className='stack-input h3'
                          onChange={e => setBidValue(e.target.value)}
                        />
                      </span>
                      <span>STACK</span>
                    </div>
                    <div className='text-center mt-2 pt-1'>
                      <button
                        onClick={() => placeBid()}
                        className='btn btn-primary rounded-pill px-4'
                        disabled={bidValue > walletStackBalance ? true : false}
                      >
                        Submit
                      </button>
                    </div>
                    <div className='text-center my-3 px-5'>
                      The auction will end at a random time on a random day before DATE
                    </div>
                  </div>
                  : null
              }
            </div>
            <div className='col-md-3'></div>
          </div>
        </div>
        :
        <div className='container'>
          <div className='row'>
            <div className='col-md-3'></div>
            <div className='col-md-6'>
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
            </div>
            <div className='col-md-3'></div>
          </div>
        </div>
      }

      <div className='modal mt-5 pt-5' style={{ display: showModal }}>
        <div className='modal-dialog'>
          <div className='modal-content bg-dark box-shadow'>
            <div className='modal-header box-shadow'>
              <h5 className='modal-title'>Please Confirm...</h5>
            </div>
            <div className='modal-body box-shadow'>
              <div className='text-center'>
                <i onClick={() => ticketNumberDecrement()} className="fa fa-minus h3 mr-3 font-weight-lighter cursor-pointer"></i>
                <span>
                  <span className='h1 font-weight-bolder'>{numberOfTicket}/</span>
                  <span className='h3'>{maxNumberOfTicket}</span>
                </span>
                <i onClick={() => ticketNumberIncrement()} className="fa fa-plus h3 ml-3 font-weight-lighter cursor-pointer"></i>
              </div>
              <div className='text-center'>
                <span className='text-primary'>Price: </span>
                <span className='text-white'>400</span>
                <span className='text-primary'> STACK</span>
              </div>
            </div>
            <div className='modal-footer box-shadow'>
              <button onClick={() => setShowModal('none')} className='width-60 btn btn-primary rounded-pill btn-sm'>Buy</button>
              <button onClick={() => setShowModal('none')} className='width-60 btn btn-primary rounded-pill btn-sm'>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = state => ({

})

export default connect(mapStateToProps, { setAlert })(Dashboard)