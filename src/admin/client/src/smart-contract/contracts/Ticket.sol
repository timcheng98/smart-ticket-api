pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;

import "./ERC721Full.sol";
import "./Event.sol";

contract Ticket is ERC721Full, Event {
  mapping(uint256 => Ticket) public tickets;
  // mapping(string => bool) _ticketExists;
  uint256 public ticketCount = 0;
  address public ticketContractOwner;

  constructor() ERC721Full("Ticket", "TCK") public {
    ticketContractOwner = msg.sender;
  }

  struct Ticket {
    uint256 eventId;
    string ticketDetail;
    uint256 ticketId;
  }

  function incrementCount() internal {
    ticketCount += 1;
  }


  function mint(string[] memory _tickets) public {
    for(uint index = 0; index < _tickets.length; index++) {
      _mint(msg.sender, ticketCount);
      tickets[ticketCount] = Ticket(eventId - 1, _tickets[index], ticketCount);
      incrementCount();
    }
    // require(!_ticketExists[_ticket]);

    // _ticketExists[_ticket] = true;
  }

  function mintByEvent(string[] memory _tickets, uint256 _eventId) public {
    for(uint index = 0; index < _tickets.length; index++) {
      _mint(msg.sender, ticketCount);
      tickets[ticketCount] = Ticket(_eventId, _tickets[index], ticketCount);
      incrementCount();
    }
  }
  
  function multiTransferFrom(address _from, address _to, uint256[] memory _tokenIds) public {
    for(uint index = 0; index < _tokenIds.length; index++) {
      safeTransferFrom(_from, _to, _tokenIds[index]);
    }
  }

}
