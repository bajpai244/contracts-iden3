pragma solidity ^0.5.0;

import './verifier.sol';
import './RootCommits.sol';

// contract Whitelist {
//   function register(address addr) public;
// }

contract CheckFullCircuit {

  RootCommits roots;
  Verifier verifier;
  address addressCA;

  constructor(address smVerifier, address smRoots, address smWhitelist, address addrCA) public  {
    roots = RootCommits(smRoots);
    verifier = Verifier(smVerifier);
    addressCA = addrCA;
  }

  function inputToAddres(uint input) internal pure returns(address){
    return address(uint160(input));
  }

  function verify(uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[9] memory input ) public returns(address) {
    address idAdd = inputToAddres(input[]);
    require(bytes32(input[0]) == roots.getRoot(address1),'Root has been not found');
    require(bytes32(input[1]) == roots.getRoot(address2),'Root has been not found');
    require(bytes32(input[2]) == roots.getRoot(address3),'Root has been not found');
    require(bytes32(input[3]) == roots.getRoot(address4),'Root has been not found');
    require(verifier.verifyProof(a, b, c, input) == true,'Zk proof is not valid');
    //require(addToSm(idAdd))
  }
}

/* Order inputs
[0] -->
[1] -->
[2] -->
[3] -->
[4] -->
[5] -->
[6] -->
[7] -->
[8] -->
[9] --> 
*/