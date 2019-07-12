pragma solidity ^0.4.24;
// 0.5.0;

contract MyContract {    // name of the contract

  // define variables here
  string public myMessage = "";
  address public owner;

  constructor (string _message) public {
    myMessage = _message;
    owner = msg.sender;
  }

  // function setOwner(address _newOwner) public {
  //   owner = _newOwner;
  // }
  modifier onlyOwner {
    require(msg.sender == owner, "Only owner can call this function.");
    _;
  }

  function setMessage(string _message) public onlyOwner {
    // require(owner == msg.sender);
    myMessage = _message;
  }
}
