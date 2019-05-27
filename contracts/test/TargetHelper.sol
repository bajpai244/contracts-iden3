pragma solidity ^0.5.0;

contract TargetHelper{
    uint public value;
    constructor() public {
        value = 1;
    }
    function inc(uint _param) public {
        value = value + _param;
    }
}
