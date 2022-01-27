import React from 'react'
import { connect } from 'react-redux'
import Web3 from "web3"
import Web3Modal from "web3modal"
import logo from '../../img/logo.svg'
import ellipseAddress from '../../utils/ellipseAddress'
import { setAlert } from '../../actions/alert'
import stackAbi from '../../abi/stack.json'

const Dashboard = ({ setAlert }) => {

  const providerOptions = {
    /* See Provider Options Section */
  }

  const web3Modal = new Web3Modal({
    network: "mainnet", // optional
    cacheProvider: true, // optional
    providerOptions // required
  })

  const [walletAddress, setWalletAddress] = React.useState(null)
  const [walletBalance, setWalletBalance] = React.useState(null)
  const [mintValue, setMintValue] = React.useState(2)
  const [lotteryValue, setLotteryValue] = React.useState(2000)
  const [bidValue, setBidValue] = React.useState(3000)
  const [top20Biders, setTop20Biders] = React.useState([])
  const [top20Bids, setTop20Bids] = React.useState([])
  const [showModal, setShowModal] = React.useState('none')

  const mintMaxValue = 50

  const mintValueIncrement = () => {
    if (mintValue + 1 > mintMaxValue) {
      setAlert('Maximum Value Overflow', 'warning')
      return
    }
    setMintValue(mintValue + 1)
  }

  const mintValueDecrement = () => {
    if (mintValue - 1 < 1) {
      setAlert('It can not be set as 0', 'warning')
      return
    }
    setMintValue(mintValue - 1)
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
      let contract = new window.web3.eth.Contract(stackAbi, '0xeF84982226130c86af2F22473a3b1891Dd7F7495')
      let balance = await contract.methods.balanceOf('0x9284aFA605f2639d59b3d102Da325A39e53B1465').call()
      setWalletBalance(balance)
    }
  }

  const getTop20Biders = async () => {
    if (window.web3.eth) {
      let contract = new window.web3.eth.Contract(stackAbi, '0xeF84982226130c86af2F22473a3b1891Dd7F7495')
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
    setWalletAddress(localStorage.getItem('walletAddress'))
    loadWeb3()
    getPageData()
  }, [])

  const placeBid = async () => {
    let contract = new window.web3.eth.Contract(stackAbi, '0xeF84982226130c86af2F22473a3b1891Dd7F7495')
    await contract.methods.placeBid(bidValue).send({ from: walletAddress })
  }

  const mintNFT = async (stackValue) => {
    let contract = new window.web3.eth.Contract(stackAbi, '0xeF84982226130c86af2F22473a3b1891Dd7F7495')
    await contract.methods.stakeForTickets(stackValue).send({ from: walletAddress })
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
          <div className='col-md-4 text-center text-primary h3 p-4'>
            <i className='fa fa-university'></i>
            <span className='ml-2'>Staking</span>
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
      <div className='container'>
        <div className='row pt-5'>
          <div className='col-md-6'>
            <div className='box-shadow rounded-lg p-3 m-3' style={{ minHeight: '280px' }}>
              <div className='h2 text-center'>Mint Your Node NFT</div>
              <div className='text-center text-primary'>Current Node Generation: 1</div>
              <div className='text-center'>
                <i onClick={() => mintValueDecrement()} className="fa fa-minus h3 mr-3 font-weight-lighter cursor-pointer"></i>
                <span>
                  <span className='h1 font-weight-bolder'>{mintValue}/</span>
                  <span className='h3'>{mintMaxValue}</span>
                </span>
                <i onClick={() => mintValueIncrement()} className="fa fa-plus h3 ml-3 font-weight-lighter cursor-pointer"></i>
              </div>
              <div className='text-center'>
                <span className='text-primary'>Price: </span>
                <span className='text-white'>400</span>
                <span className='text-primary'> STACK</span>
              </div>
              <div className='row mb-3'>
                <div className='col-md-6 text-center mt-3'>
                  <button className='btn btn-primary rounded-pill' onClick={() => setShowModal('block')}>Mint with STACK</button>
                  <div className='mt-2 small'>
                    <span className='text-primary'>Wallet Balance: </span>
                    <span className='text-white'>{walletBalance} STACK</span>
                  </div>
                </div>
                <div className='col-md-6 text-center mt-3'>
                  <button className='btn btn-primary rounded-pill'>Mint with staked STACK</button>
                  <div className='mt-2 small'>
                    <span className='text-primary'>Staked for lottery: </span>
                    <span className='text-white'>{lotteryValue} STACK</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='col-md-6'>
            <div className='box-shadow rounded-lg p-3 m-3' style={{ minHeight: '280px' }}>
              <div className='h2 text-center'>Node NFT Lottery</div>
              <div className='text-center text-primary'>Stake your STACK to get more lottery tickets</div>
              <div className='text-center mt-3'>
                <span className='h1 font-weight-bolder border-bottom'>
                  <input
                    type='number'
                    value={lotteryValue}
                    style={{ maxWidth: '150px' }}
                    className='stack-input'
                    onChange={e => setLotteryValue(e.target.value)}
                  />
                </span>
                <span className='h3'>STACK</span>
              </div>
              <div className='text-center mt-4 pt-1'>
                <button className='btn btn-primary rounded-pill'>Stake STACK</button>
              </div>
            </div>
          </div>
        </div>
        <div className='row py-5'>
          <div className='col-md-3'></div>
          <div className='col-md-6'>
            <div className='box-shadow rounded-lg p-3 m-3'>
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
              <div className='text-center mt-4'>
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
                <button onClick={() => placeBid()} className='btn btn-primary rounded-pill px-4'>Submit</button>
              </div>
              <div className='text-center my-3 px-5'>
                The auction will end at a random time on a random day before DATE
              </div>
            </div>
          </div>
          <div className='col-md-3'></div>
        </div>
      </div>
      <div className='modal mt-5 pt-5' style={{ display: showModal }}>
        <div className='modal-dialog'>
          <div className='modal-content bg-dark box-shadow'>
            <div className='modal-header box-shadow'>
              <h5 className='modal-title'>Please Confirm...</h5>
            </div>
            <div className='modal-body box-shadow'>
              <div className='text-center'>
                <i onClick={() => mintValueDecrement()} className="fa fa-minus h3 mr-3 font-weight-lighter cursor-pointer"></i>
                <span>
                  <span className='h1 font-weight-bolder'>{mintValue}/</span>
                  <span className='h3'>{mintMaxValue}</span>
                </span>
                <i onClick={() => mintValueIncrement()} className="fa fa-plus h3 ml-3 font-weight-lighter cursor-pointer"></i>
              </div>
              <div className='text-center'>
                <span className='text-primary'>Price: </span>
                <span className='text-white'>400</span>
                <span className='text-primary'> STACK</span>
              </div>
            </div>
            <div className='modal-footer box-shadow'>
              <button onClick={() => setShowModal('none')} className='width-60 btn btn-primary rounded-pill btn-sm'>Mint</button>
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