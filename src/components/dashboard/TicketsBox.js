import React from "react"
import stackNFTGenesisAbi from '../../abi/stack_nft_genesis.json'
import winningTickets from "../../utils/winningTickets"
const stackNFTGenesisContractAddress = '0x7fD93DF7F2229cA6344b8aEb411785eDb378D2B5'

const TicketsBox = ({ walletAddress, setAlert, userTickets, lastGenerationAddress }) => {

  const [userTicket, setUserTicket] = React.useState({
    ticketsBought: [],
    ticketsClaimed: [],
    ticketsReturned: [],
    ticketsTransferred: [],
  })

  const [ticketsHeld, setTicketsHeld] = React.useState([])
  const [ticketsWon, setTicketsWon] = React.useState([])
  const [ticketsLost, setTicketsLost] = React.useState([])

  React.useEffect(() => {
    let _ticketsWon = []
    let _ticketsLost = []
    for (var i = 0; i < ticketsHeld.length; i++) {
      if (winningTickets.indexOf(ticketsHeld[i]) > -1) {
        _ticketsWon.push(ticketsHeld[i])
      } else {
        _ticketsLost.push(ticketsHeld[i])
      }
    }
    setTicketsWon(_ticketsWon)
    setTicketsLost(_ticketsLost)
  }, [ticketsHeld, winningTickets])

  React.useEffect(() => {
    let _ticketsBought = userTicket.ticketsBought
    let _ticketsClaimed = userTicket.ticketsClaimed
    let _ticketsReturned = userTicket.ticketsReturned
    let _ticketsTransferred = userTicket.ticketsTransferred

    let _ticketsHeld = [..._ticketsBought]

    if (_ticketsHeld) {
      if (_ticketsClaimed) {
        for (var i = 0; i < _ticketsClaimed.length; i++) {
          let indexInBought = _ticketsHeld.indexOf(_ticketsClaimed[i])
          if (indexInBought > -1) _ticketsHeld.splice(indexInBought, 1)
        }
      }
      if (_ticketsReturned) {
        for (i = 0; i < _ticketsReturned.length; i++) {
          let indexInBought = _ticketsHeld.indexOf(_ticketsReturned[i])
          if (indexInBought > -1) _ticketsHeld.splice(indexInBought, 1)
        }
      }
      if (_ticketsTransferred) {
        for (i = 0; i < _ticketsTransferred.length; i++) {
          let indexInBought = _ticketsHeld.indexOf(_ticketsTransferred[i])
          if (indexInBought > -1) _ticketsHeld.splice(indexInBought, 1)
        }
      }

      setTicketsHeld(_ticketsHeld)
    } else {
      return
    }
  }, [userTicket])

  React.useEffect(() => {
    if (userTickets.length > 0) {
      let _userTicket = userTickets.find(element => element.id === walletAddress)
      if (_userTicket) setUserTicket(_userTicket)
    }
  }, [userTickets])

  const claimReward = async () => {
    let contract = new window.web3.eth.Contract(stackNFTGenesisAbi, stackNFTGenesisContractAddress)
    await contract.methods.claimReward(ticketsWon).send({ from: walletAddress })
  }

  const returnStake = async () => {
    let contract = new window.web3.eth.Contract(stackNFTGenesisAbi, stackNFTGenesisContractAddress)
    await contract.methods.returnStake(ticketsLost).send({ from: walletAddress })
  }

  const [sendWalletAddress, setSendWalletAddress] = React.useState('')

  const transferTicket = async () => {
    let contract = new window.web3.eth.Contract(stackNFTGenesisAbi, stackNFTGenesisContractAddress)
    await contract.methods.transferTicket(ticketsLost, lastGenerationAddress).send({ from: walletAddress })
  }

  return (
    <div className='box-shadow rounded-lg p-3'>
      <div>
        <div className="m-4">
          <div className='row'>
            <div className="col-lg-12">
              {ticketsHeld.length > 0
                ?
                <div className="text-center">
                  <span className='text-primary font-22'>
                    Tickets Held:
                  </span>
                  {ticketsHeld.map((item, index) =>
                    <span className='text-white font-22' key={index}> {item}, </span>
                  )}
                </div>
                :
                <div className="text-center">
                  <span className='text-primary font-22'>
                    You have no Tickets.
                  </span>
                </div>
              }

            </div>
          </div>
        </div>

        <div className='row my-3'>
          <div className='col-lg-4 text-center'>
            <button
              className='btn btn-primary rounded-pill mt-2'
              onClick={() => claimReward()}
              disabled={ticketsWon.length === 0 ? true : false}
            >
              Claim NFTs
            </button>
          </div>
          <div className='col-lg-4 text-center'>
            <button
              className='btn btn-primary rounded-pill mt-2'
              onClick={() => returnStake()}
              disabled={ticketsLost.length === 0 ? true : false}
            >
              Return Stake
            </button>
          </div>
          <div className='col-lg-4 text-center'>
            <button
              className='btn btn-primary rounded-pill mt-2'
              onClick={() => transferTicket()}
              disabled={ticketsLost.length === 0 ? true : false}
            // data-toggle="modal" data-target="#myModal"
            >
              Transfer Tickets
            </button>
          </div>
        </div>
      </div>
      <div className="modal mt-5 pt-5" id="myModal">
        <div className='modal-dialog'>
          <div className='modal-content bg-dark box-shadow'>
            <div className='modal-header box-shadow'>
              <h5 className='modal-title'>Input the wallet address...</h5>
              <button className="close" data-dismiss="modal">&times;</button>
            </div>
            <div className="modal-body box-shadow">
              <div className="text-center m-3">
                <input
                  value={sendWalletAddress}
                  onChange={e => setSendWalletAddress(e.target.value)}
                  className='form-control'
                />
              </div>
            </div>
            <div className="modal-footer box-shadow">
              <button
                className="btn btn-primary rounded-pill"
                data-dismiss="modal"
                onClick={() => transferTicket(userTicket.ticketsBought, sendWalletAddress)}
              >
                Confirm
              </button>
              <button className="btn btn-primary rounded-pill" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TicketsBox