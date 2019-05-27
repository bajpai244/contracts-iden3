pragma solidity ^0.5.0;

import './UnstructuredStorage.sol';

/**
* @title Manages the state variables of a DelegateProxy
*/
contract DelegateProxySlotStorage {

    using UnstructuredStorage for bytes32;

    // IMPL_SLOT=keccak256("iden3.core.impl.slot")
    bytes32 constant private IMPL_SLOT = 0x1233c892137aa32e0f1c4b5359db9038b88dde2eb3927c5ee83dc8c9b3e17c0f;
    // RECOVERER_SLOT=keccak256("iden3.core.recoverer.slot")
    bytes32 constant private RECOVERER_SLOT = 0x44f094e9bb0645dc669d08e0f0767e604381cfc211e15a1dbae98fd3b535f285;
    // PROPOSED_SLOT=keccak256("iden3.core.recovererprop.slot")
    bytes32 constant private PROPOSED_SLOT = 0x9e67005d2760c1e41a2ea81ffa69f265791c0630cb5295c10534812389883dc4;

    /**
    * @dev returns information about the proxy state
    * @return impl is the address of the code to be called
    * @return recoverer is the address authorized to recover the identity
    * @return proposed is the address proposed to be the replacement for recover
    */
    function getProxyInfo() internal view returns (address impl, address recoverer, address proposed) {
        return (
            IMPL_SLOT.getStorageAddress(),
            RECOVERER_SLOT.getStorageAddress(),
            PROPOSED_SLOT.getStorageAddress()
        );
    }

    /**
    * @dev sets the code to be called
    * @return _address of the code
    */
    function setProxyImpl(address _address) internal {
        IMPL_SLOT.setStorageAddress(_address);
    }

    /**
    * @dev sets the address authorized to recover the identity
    * @return _address of caller
    */
    function setProxyRecoverer(address _address) internal {
        RECOVERER_SLOT.setStorageAddress(_address);
    }

    /**
    * @dev sets the address proposed to be the replacement for recover
    * @return _address of the proposed
    */
    function setProxyRecovererProp(address _address) internal {
        PROPOSED_SLOT.setStorageAddress(_address);
    }
}
