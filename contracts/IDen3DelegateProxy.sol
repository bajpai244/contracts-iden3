pragma solidity ^0.5.0;

import './lib/DelegateProxy.sol';
import './IDen3SlotStorage.sol';

/**
* @title a specialized delegate proxy for IDen3Impl
*/
contract IDen3DelegateProxy is DelegateProxy, IDen3SlotStorage {
    constructor(
    	address _operational,
      address _relayer,
    	address _recoverer,
    	address _revoker,
    	address _impl
    )
    DelegateProxy   (_impl, _recoverer)
    IDen3SlotStorage(_relayer,_revoker)
    public {
        // we need this for the conterfactual, but is not stored
    	_operational;
    }
}
