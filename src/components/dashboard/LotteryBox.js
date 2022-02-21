import React from "react"
import stackNFTGenesisAbi from '../../abi/stack_nft_genesis.json'
const stackNFTGenesisContractAddress = '0xbD72cFc3d0055438BE59662Dbf581e90B21b6e45'

const LotteryBox = ({ walletAddress, walletStackBalance, setAlert }) => {

  const ticketPrice = 400
  const maxNumberOfTicket = 50
  const [numberOfTicket, setnumberOfTicket] = React.useState(1)

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

  const buyTickets = async () => {
    let contract = new window.web3.eth.Contract(stackNFTGenesisAbi, stackNFTGenesisContractAddress)
    await contract.methods.stakeForTickets(numberOfTicket).send({ from: walletAddress })
  }

  return (
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
  )
}

export default LotteryBox