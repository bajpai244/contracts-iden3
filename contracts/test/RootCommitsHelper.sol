pragma solidity ^0.5.0;

import "../RootCommits.sol";

contract RootCommitsHelper{

    function setDifferentRoots(address _id) public {
        RootCommits id = RootCommits(_id);
        id.setRoot(0x0000000000000000000000000000000000000000000000000000000000000001);
        id.setRoot(0x0000000000000000000000000000000000000000000000000000000000000002);
    }

}
