// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HealthInfo {

    struct Update {
        address updater;
        uint256 timestamp;
    }
    struct HealthRecord {
        string ipfsHash; // Single IPFS hash storing all patient data as a JSON object
        address owner;
        Update[] updates;
    }

    mapping(address => HealthRecord) private healthRecords;
    mapping(address => mapping(address => bool)) private accessPermissions;
    mapping(address => address[]) private accessList;


    event HealthRecordUpdated(address indexed owner, string ipfsHash);
    event AccessGranted(address indexed owner, address indexed permissionedUser);
    event AccessRevoked(address indexed owner, address indexed permissionedUser);

    /**
     * @dev Updates the health record the given IPFS hash. If the record has no owner, the sender is set as the owner.
     * @param _ipfsHash The IPFS hash of the complete health record JSON.
     */
    function addOrUpdateHealthRecord(string memory _ipfsHash) public {
        HealthRecord storage record = healthRecords[msg.sender];
        
        if (record.owner == address(0)) {
            record.owner= msg.sender;
        }

        record.ipfsHash = _ipfsHash;
        
        record.updates.push(Update({
            updater: msg.sender,
            timestamp: block.timestamp
        }));
        emit HealthRecordUpdated(msg.sender, _ipfsHash);
    }

    /**
     * @dev Grants access to the sender's health record to a specified address.
     * @param permissionedUser The address to grant access to.
     */
    function grantAccess(address permissionedUser) public {
        require(permissionedUser != address(0), "Invalid grantee address");
        require(!accessPermissions[msg.sender][permissionedUser], "Access already granted");

        accessPermissions[msg.sender][permissionedUser] = true;
        accessList[msg.sender].push(permissionedUser);
        emit AccessGranted(msg.sender, permissionedUser);
    }

    /**
     * @dev Revokes access to the sender's health record from a specified address.
     * @param permissionedUser The address to revoke access from.
     */
    function revokeAccess(address permissionedUser) public {
        require(permissionedUser != address(0), "Invalid grantee address");
        require(accessPermissions[msg.sender][permissionedUser], "Access not granted");

        accessPermissions[msg.sender][permissionedUser] = false;
        for (uint256 i = 0; i < accessList[msg.sender].length; i++) {
            if (accessList[msg.sender][i] == permissionedUser) {
                accessList[msg.sender][i] = accessList[msg.sender][accessList[msg.sender].length - 1];
                accessList[msg.sender].pop();
                break;
            }
        }
        emit AccessRevoked(msg.sender, permissionedUser);
    }

    /**
     * @dev Retrieves the health record of a specified owner if the caller has access.
     * @param recordOwner The address of the health record owner.
     * @return The IPFS hash of the complete health record JSON.
     */
    function getHealthRecord(address recordOwner) public view returns (string memory) {
        require(
            recordOwner == msg.sender || accessPermissions[recordOwner][msg.sender],
            "Access denied"
        );
        return healthRecords[recordOwner].ipfsHash;
    }

    function getUpdates(address recordOwner) public view returns (address[] memory, uint256[] memory) {
        HealthRecord storage record = healthRecords[recordOwner];
        require(
            recordOwner == msg.sender || accessPermissions[recordOwner][msg.sender],
            "Access denied"
        );

        uint256 length = record.updates.length;
        address[] memory updaters = new address[](length);
        uint256[] memory timestamps = new uint256[](length);

        for (uint256 i = 0; i < length; i++) {
            updaters[i] = record.updates[i].updater;
            timestamps[i] = record.updates[i].timestamp;
        }

        return (updaters, timestamps);
}
    function getAccessList(address owner) public view returns (address[] memory) {
        require(
            owner == msg.sender || accessPermissions[owner][msg.sender],
            "Access denied"
        );
        return accessList[owner];
    }


}
