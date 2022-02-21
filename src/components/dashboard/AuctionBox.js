import React from "react"
import stackNFTGenesisAbi from '../../abi/stack_nft_genesis.json'
const stackNFTGenesisContractAddress = '0xbD72cFc3d0055438BE59662Dbf581e90B21b6e45'

const AuctionBox = ({ walletAddress, walletStackBalance }) => {

  const [bidValue, setBidValue] = React.useState(1000)
  const [top20Biders, setTop20Biders] = React.useState([])
  const [top20Bids, setTop20Bids] = React.useState([])

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

  React.useEffect(() => {
    if (walletAddress) {
      getTop20Biders()
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
      {top20Biders.map((item, index) =>
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
  )
}

export default AuctionBox