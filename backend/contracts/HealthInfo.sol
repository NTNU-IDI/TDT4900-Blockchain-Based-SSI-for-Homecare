// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HealthInfo {

    struct Update {
        address updater;
        uint256 timestamp;
        string description;
    }
    struct HealthRecord {
        string ipfsHash; // Single IPFS hash storing all patient data as a JSON object
        Update[] updates;
    }

    mapping(address => HealthRecord) private healthRecords;
    mapping(address => mapping(address => bool)) private accessPermissions;
    mapping(address => address[]) private accessList;
    mapping(address => address[]) private accessRequests;


    event HealthRecordUpdated(address indexed owner, string ipfsHash);
    event AccessRevoked(address indexed owner, address indexed permissionedUser);
    event AccessRequested(address indexed owner, address indexed requester);
    event AccessRequestAccepted(address indexed owner, address indexed requester);
    event AccessRequestRejected(address indexed owner, address indexed requester);

    /**
     * @dev Updates the health record the given IPFS hash. If the record has no owner, the sender is set as the owner.
     * @param _ipfsHash The IPFS hash of the complete health record JSON.
     */
    function setOwner(string memory _ipfsHash, address owner) public {
        HealthRecord storage record = healthRecords[owner];

        record.ipfsHash = _ipfsHash;
        record.updates.push(Update({
            updater: msg.sender,
            timestamp: block.timestamp,
            description: "Initial record creation"
        }));
        

    }

    /**
     * @dev Updates the health record the given IPFS hash. If the record has no owner, the sender is set as the owner.
     * 
     */
    function updateHealthRecord(address owner) public {
        require(msg.sender == owner || accessPermissions[owner][msg.sender],
        "Not authorized to update this record"
    );
        HealthRecord storage record = healthRecords[owner];
        
        record.updates.push(Update({
            updater: msg.sender,
            timestamp: block.timestamp,
            description: "Record updated"
        }));
        emit HealthRecordUpdated(owner, " ");
    }

    /**
     * @dev Grants access to the sender's health record to a specified address.
     * @param requester The address to grant access to.
     */
    function grantAccess(address requester) public {
        require(requester != address(0), "Invalid grantee address");
        require(!accessPermissions[msg.sender][requester], "Access already granted");
        require(isAccessRequested(msg.sender, requester), "No access request found");

        accessPermissions[msg.sender][requester] = true;
        accessList[msg.sender].push(requester);
        for (uint256 i = 0; i < accessRequests[msg.sender].length; i++) {
            if (accessRequests[msg.sender][i] == requester) {
                accessRequests[msg.sender][i] = accessRequests[msg.sender][accessRequests[msg.sender].length - 1];
                accessRequests[msg.sender].pop();
                break;
            }
        }
        emit AccessRequestAccepted(msg.sender, requester);
    }

    /**
     * @dev Denies an access request.
     * @param requester The address of the user requesting access.
     */
    function denyAccessRequest(address requester) public {
        require(requester != address(0), "Invalid requester");
        require(isAccessRequested(msg.sender, requester), "No access request found");

        for (uint256 i = 0; i < accessRequests[msg.sender].length; i++) {
            if (accessRequests[msg.sender][i] == requester) {
                accessRequests[msg.sender][i] = accessRequests[msg.sender][accessRequests[msg.sender].length - 1];
                accessRequests[msg.sender].pop();
                break;
            }
        }
        emit AccessRequestRejected(msg.sender, requester);
    }

    /**
     * @dev Requests access to another user's health record.
     * @param recordOwner The address of the health record owner.
     */
    function requestAccess(address recordOwner) public {
        require(recordOwner != address(0), "Invalid record owner");
        require(recordOwner != msg.sender, "Cannot request access to your own record");

        for (uint256 i = 0; i < accessRequests[recordOwner].length; i++) {
            require(accessRequests[recordOwner][i] != msg.sender, "Access already requested");
        }

        accessRequests[recordOwner].push(msg.sender);
        emit AccessRequested(msg.sender, recordOwner);
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

    function isAccessRequested(address owner, address requester) internal view returns (bool) {
        for (uint256 i = 0; i < accessRequests[owner].length; i++) {
            if (accessRequests[owner][i] == requester) {
                return true;
            }
        }
        return false;
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

    function getUpdates() public view returns (address[] memory, uint256[] memory, string[] memory) {
        HealthRecord storage record = healthRecords[msg.sender];
        uint256 length = record.updates.length;
        address[] memory updaters = new address[](length);
        uint256[] memory timestamps = new uint256[](length);
        string[] memory description = new string[](length);

        for (uint256 i = 0; i < length; i++) {
            updaters[i] = record.updates[i].updater;
            timestamps[i] = record.updates[i].timestamp;
            description[i] = record.updates[i].description;
        }

        return (updaters, timestamps, description);
}
    function getAccessList() public view returns (address[] memory) {
        return accessList[msg.sender];
    }

    function getAccessRequests() public view returns (address[] memory) {
        return accessRequests[msg.sender];
    }


}
