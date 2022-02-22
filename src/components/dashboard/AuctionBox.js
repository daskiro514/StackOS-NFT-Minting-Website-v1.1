import React from "react"
import stackNFTGenesisAbi from '../../abi/stack_nft_genesis.json'
import ellipseAddress from '../../utils/ellipseAddress'
import Spinner from '../layout/Spinner'
const stackNFTGenesisContractAddress = '0x7fD93DF7F2229cA6344b8aEb411785eDb378D2B5'
var firstIntervalID = -1

const AuctionBox = ({ walletAddress, walletStackBalance }) => {

  const [bidValue, setBidValue] = React.useState(1000)
  const [top20Biders, setTop20Biders] = React.useState([])
  const [top20Bids, setTop20Bids] = React.useState([])

  const getTop20Biders = async () => {
    setTop20Biders([])
    if (window.web3.eth) {
      let contract = new window.web3.eth.Contract(stackNFTGenesisAbi, stackNFTGenesisContractAddress)
      let _top20Biders = []
      let _top20Bids = []

      for (var i = 20; i >= 1; i--) {
        let bider = await contract.methods.topBiders(i).call()
        if (bider !== '0x0000000000000000000000000000000000000000') {
          _top20Biders.push(bider)
          let bid = await contract.methods.topBids(i).call()
          _top20Bids.push(bid / 10 ** 18)
        } else {
          break
        }
      }

      setTop20Biders(_top20Biders)
      setTop20Bids(_top20Bids)
    }
  }

  React.useEffect(() => {
    if (walletAddress) {
      getTop20Biders()
    }
  }, [walletAddress])

  React.useEffect(() => {
    var intervalID = setInterval(async function () {
      if (walletAddress) {
        getTop20Biders()
      }
    }, 30 * 1000)

    if (firstIntervalID < 0) {
      firstIntervalID = intervalID
    } else {
      clearInterval(intervalID)
    }
  }, [walletAddress])

  const placeBid = async () => {
    let contract = new window.web3.eth.Contract(stackNFTGenesisAbi, stackNFTGenesisContractAddress)
    await contract.methods.placeBid(bidValue).send({ from: walletAddress })
  }

  return (
    <div className='box-shadow rounded-lg p-3'>
      <div className='h2 text-center'>Auction</div>
      <div className='text-primary text-center mb-3'>Top 20 Bids</div>
      {top20Biders.length > 0 ?
        top20Biders.map((item, index) =>
          <div key={index} className='d-flex justify-content-between py-2 border-bottom border-secondary'>
            <div className='text-primary d-flex'>
              <div className='mr-3 width-20'>{index + 1}</div>
              <div className='badge rounded-pill bg-primary text-primary font-18 mr-2'>8</div>
              <div>{ellipseAddress(item)}</div>
            </div>
            <div className='mr-4'>{top20Bids[index]} STACK</div>
          </div>
        )
        :
        <>
          <div className="text-center">You should connect your wallet.</div>
          <Spinner />
        </>
      }
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
  )
}

export default AuctionBox