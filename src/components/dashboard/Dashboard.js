import React from 'react'
import { connect } from 'react-redux'
import Web3 from "web3"
import Web3Modal from "web3modal"
import logo from '../../img/logo.svg'
import ellipseAddress from '../../utils/ellipseAddress'
import { setAlert } from '../../actions/alert'
import stackOsAbi from '../../abi/stack_os.json'
import polygonUsdtAbi from '../../abi/polygon_usdt.json'
import polygonUsdcAbi from '../../abi/polygon_usdc.json'
import polygonDaiAbi from '../../abi/polygon_dai.json'
import LotteryBox from './LotteryBox'
import AuctionBox from './AuctionBox'
import MintBox from './MintBox'
import db from '../../utils/firebase'
import TicketsBox from './TicketsBox'

const stackOSContractAddress = '0x980111ae1B84E50222C8843e3A7a038F36Fecd2b'
const polygonUsdtAddress = '0xc2132d05d31c914a87c6611c10748aeb04b58e8f'
const polygonUsdcAddress = '0x2791bca1f2de4661ed88a30c99a7a9449aa84174'
const polygonDaiAddress = '0x490e379c9cff64944be82b849f8fd5972c7999a7'

const Dashboard = ({ setAlert }) => {

  const [userTickets, setUserTickets] = React.useState([])
  const [lastGenerationAddress, setLastGenerationAddress] = React.useState(null)

  const getUserTickets = async () => {
    setUserTickets((await db.collection('userTickets').get()).docs.map(doc => ({
      ...doc.data(), id: doc.id
    })))
  }

  const getLastGenerationAddress = async () => {
    let generation = (await db.collection('generation').get()).docs.map(doc => ({
      ...doc.data(), id: doc.id
    })).pop()
    setLastGenerationAddress(generation.genAddress)
  }

  React.useEffect(() => {
    async function fetchData() {
      await getUserTickets()
      await getLastGenerationAddress()
    }
    fetchData()
  }, [])

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

  const getWalletBalance = React.useCallback(async () => {
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
      }
    }
  }, [walletAddress])

  React.useEffect(() => {
    let _walletAddress = localStorage.getItem('walletAddress')
    if (_walletAddress !== 'null') {
      setWalletAddress(_walletAddress)
    }
    loadWeb3()
  }, [])

  React.useEffect(() => {
    if (walletAddress) {
      getWalletBalance()
    }
  }, [walletAddress, getWalletBalance])

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
              <div className={'mr-3 px-2 py-1 ' + (topTab === 'Gen1+' ? 'header-nav-border-bottom' : '')} onClick={() => setTopTab('Gen1+')}>
                Gen1+
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
                  <div className='col-md-4 text-center cursor-pointer' onClick={() => setTab('Lottery')}>
                    <div className={'p-2 ' + (tab === 'Lottery' ? 'box-shadow-bold' : null)}>
                      Lottery
                    </div>
                  </div>
                  <div className='col-md-4 text-center cursor-pointer' onClick={() => setTab('Auction')}>
                    <div className={'p-2 ' + (tab === 'Auction' ? 'box-shadow-bold' : null)}>
                      Auction
                    </div>
                  </div>
                  <div className='col-md-4 text-center cursor-pointer' onClick={() => setTab('Tickets')}>
                    <div className={'p-2 ' + (tab === 'Tickets' ? 'box-shadow-bold' : null)}>
                      Tickets
                    </div>
                  </div>
                </div>
              </div>
              {tab === 'Lottery'
                ?
                <LotteryBox
                  walletAddress={walletAddress}
                  walletStackBalance={walletStackBalance}
                  setAlert={setAlert}
                />
                : tab === 'Auction'
                  ?
                  <AuctionBox
                    walletAddress={walletAddress}
                    walletStackBalance={walletStackBalance}
                  />
                  : tab === 'Tickets' ?
                    <TicketsBox
                      walletAddress={walletAddress}
                      setAlert={setAlert}
                      userTickets={userTickets}
                      lastGenerationAddress={lastGenerationAddress}
                    />
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
              <MintBox
                walletAddress={walletAddress}
                walletStackBalance={walletStackBalance}
                walletUsdtBalance={walletUsdtBalance}
                walletUsdcBalance={walletUsdcBalance}
                walletDaiBalance={walletDaiBalance}
              />
            </div>
            <div className='col-md-3'></div>
          </div>
        </div>
      }
    </div>
  )
}

const mapStateToProps = state => ({

})

export default connect(mapStateToProps, { setAlert })(Dashboard)

