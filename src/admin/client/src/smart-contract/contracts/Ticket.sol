pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;

import "./ERC721Full.sol";
import "./Event.sol";

contract Ticket is ERC721Full, Event {
  mapping(uint => Ticket) public tickets;
  // mapping(string => bool) _ticketExists;
  uint256 public ticketCount = 0;

  constructor() ERC721Full("Ticket", "TCK") public {
  }

  struct Ticket {
    uint eventId;
    string ticketDetail;
  }

  function incrementCount() internal {
    ticketCount += 1;
  }

  function mint(string[] memory _tickets) public {
    for(uint index = 0; index < _tickets.length; index++) {
      tickets[ticketCount] = Ticket(eventId - 1, _tickets[index]);
      _mint(msg.sender, ticketCount);
      incrementCount();
    }
    // require(!_ticketExists[_ticket]);

    // _ticketExists[_ticket] = true;
  }

  // function transferFrom(address _from, address _to, uint256 _tokenId) public {
  //   _transferFrom(_from, _to, _tokenId);
  // }

}
