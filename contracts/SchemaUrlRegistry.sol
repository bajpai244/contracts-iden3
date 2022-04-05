// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.0;

/**
 * @title Schema
 * @dev Schema contract
 */
contract SchemaUrlRegistry {
    struct Schema {
        address creator;
        string id;
        string credentialType;
        string url;
        uint256 timestamp;
        string desc;
    }

    mapping(string => Schema) schemaMap;
    string[] ids;

    /**
     * @dev save is function to store schema
     * @param id - hash of the schema
     * @param credentialType - schema credential type
     * @param url - schema uri
     */
    function save(string memory id, string memory credentialType, string memory url, string memory desc) public {
        require(schemaMap[id].creator == address(0), "Schema already exists");

        Schema memory s = Schema({// creating new schema
        creator : msg.sender,
        id : id,
        credentialType : credentialType,
        timestamp : block.timestamp,
        url : url,
        desc: desc
        });

        schemaMap[id] = s;
        ids.push(id);
    }

    function getIds() public view returns(string[] memory){
        return ids;
    }

    /**
     * @dev getSchemaById is function to retrieve ipfs utl by name
     * @param id - hash of the schema
    */
    function getSchemaById(string memory id)
    public
    view
    returns (string memory, string memory, string memory, string memory, address, uint256)
    {
        return (schemaMap[id].id, schemaMap[id].credentialType, schemaMap[id].url, schemaMap[id].desc, schemaMap[id].creator, schemaMap[id].timestamp);
    }
}
