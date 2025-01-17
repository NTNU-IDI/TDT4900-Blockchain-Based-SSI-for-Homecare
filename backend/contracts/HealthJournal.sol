// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HealthInfo {
    address private owner;

    struct HealthRecord {
        string ipfsHash; // Single IPFS hash storing all patient data as a JSON object
    }

    mapping(address => HealthRecord) private healthRecords;
    mapping(address => mapping(address => bool)) private accessPermissions;

    event HealthRecordUpdated(address indexed owner, string ipfsHash);
    event AccessGranted(address indexed owner, address indexed grantee);
    event AccessRevoked(address indexed owner, address indexed grantee);

    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Updates the health record for the sender with a single IPFS hash.
     * @param _ipfsHash The IPFS hash of the complete health record JSON.
     */
    function updateHealthRecord(string memory _ipfsHash) public {
        healthRecords[msg.sender] = HealthRecord(_ipfsHash);
        emit HealthRecordUpdated(msg.sender, _ipfsHash);
    }

    /**
     * @dev Grants access to the sender's health record to a specified address.
     * @param grantee The address to grant access to.
     */
    function grantAccess(address grantee) public {
        accessPermissions[msg.sender][grantee] = true;
        emit AccessGranted(msg.sender, grantee);
    }

    /**
     * @dev Revokes access to the sender's health record from a specified address.
     * @param grantee The address to revoke access from.
     */
    function revokeAccess(address grantee) public {
        accessPermissions[msg.sender][grantee] = false;
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
}
