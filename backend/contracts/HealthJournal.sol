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
    mapping(address => address[]) private grantees;


    event HealthRecordUpdated(address indexed owner, string ipfsHash);
    event AccessGranted(address indexed owner, address indexed grantee);
    event AccessRevoked(address indexed owner, address indexed grantee);

    /**
     * @dev Updates the health record for the sender with a single IPFS hash.
     * @param _ipfsHash The IPFS hash of the complete health record JSON.
     */
    function addOrUpdateHealthRecord(string memory _ipfsHash) public {
        HealthRecord storage record = healthRecords[msg.sender];
        
        if (record.owner == address(0)) {
            record.owner= msg.sender; // Set the creator if it's a new record
        }

        record.ipfsHash = _ipfsHash;
        
        // Log the update
        record.updates.push(Update({
            updater: msg.sender,
            timestamp: block.timestamp
        }));
    }

    /**
     * @dev Grants access to the sender's health record to a specified address.
     * @param grantee The address to grant access to.
     */
    function grantAccess(address grantee) public {
        require(grantee != address(0), "Invalid grantee address");
        require(!accessPermissions[msg.sender][grantee], "Access already granted");

        accessPermissions[msg.sender][grantee] = true;
        grantees[msg.sender].push(grantee); // Add to grantees list
        emit AccessGranted(msg.sender, grantee);
    }

    /**
     * @dev Revokes access to the sender's health record from a specified address.
     * @param grantee The address to revoke access from.
     */
    function revokeAccess(address grantee) public {
        require(grantee != address(0), "Invalid grantee address");
        require(accessPermissions[msg.sender][grantee], "Access not granted");

        accessPermissions[msg.sender][grantee] = false;
        for (uint256 i = 0; i < grantees[msg.sender].length; i++) {
            if (grantees[msg.sender][i] == grantee) {
                grantees[msg.sender][i] = grantees[msg.sender][grantees[msg.sender].length - 1];
                grantees[msg.sender].pop();
                break;
            }
        }
        emit AccessRevoked(msg.sender, grantee);
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
    function getGrantees(address owner) public view returns (address[] memory) {
        require(
            owner == msg.sender || accessPermissions[owner][msg.sender],
            "Access denied"
        );
        return grantees[owner];
    }


}
