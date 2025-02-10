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
    mapping(address => mapping(address => bool)) private access;
    mapping(address => mapping(address => bool)) private requestedAccess;
    mapping(address => address[]) private accessList;
    mapping(address => address[]) private accessRequests;
    mapping(address => mapping(address => string)) public accessRequestNotes;


    event HealthRecordUpdated(address indexed owner, string ipfsHash);
    event AccessRevoked(address indexed owner, address indexed permissionedUser);
    event AccessRequested(address indexed owner, address indexed requester, string note);
    event AccessRequestAccepted(address indexed owner, address indexed requester);
    event AccessRequestRejected(address indexed owner, address indexed requester);

    /**
     * @dev Updates the health record the given IPFS hash. If the record has no owner, the sender is set as the owner.
     * @param _ipfsHash The IPFS hash of the complete health record JSON.
     */
    function setOwner(string memory _ipfsHash, address owner) public {
        require(healthRecords[owner].updates.length == 0, "Record owner already set");
        HealthRecord storage record = healthRecords[owner];
        access[owner][owner] = true;

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
    function updateHealthRecord(address owner, string memory newIpfsHash) public {
        require(msg.sender == owner || access[owner][msg.sender],
        "Not authorized to update this record"
    );
        HealthRecord storage record = healthRecords[owner];

        record.ipfsHash = newIpfsHash;
        
        record.updates.push(Update({
            updater: msg.sender,
            timestamp: block.timestamp,
            description: "Added note to record"
        }));
        emit HealthRecordUpdated(owner, newIpfsHash);
    }

    /**
     * @dev Grants access to the sender's health record to a specified address.
     * @param requester The address to grant access to.
     */
    function grantAccess(address requester) public {
        require(requester != address(0), "Invalid grantee address");
        require(!access[msg.sender][requester], "Access already granted");
        require(requestedAccess[msg.sender][requester], "No access request found");

        access[msg.sender][requester] = true;
        accessList[msg.sender].push(requester);
        for (uint256 i = 0; i < accessRequests[msg.sender].length; i++) {
            if (accessRequests[msg.sender][i] == requester) {
                accessRequests[msg.sender][i] = accessRequests[msg.sender][accessRequests[msg.sender].length - 1];
                accessRequests[msg.sender].pop();
                break;
            }
        }
        requestedAccess[msg.sender][requester] = false;
        emit AccessRequestAccepted(msg.sender, requester);
    }

    /**
     * @dev Denies an access request.
     * @param requester The address of the user requesting access.
     */
    function denyAccessRequest(address requester) public {
        require(requester != address(0), "Invalid requester");
        require(requestedAccess[msg.sender][requester], "No access request found");

        for (uint256 i = 0; i < accessRequests[msg.sender].length; i++) {
            if (accessRequests[msg.sender][i] == requester) {
                accessRequests[msg.sender][i] = accessRequests[msg.sender][accessRequests[msg.sender].length - 1];
                accessRequests[msg.sender].pop();
                break;
            }
        }
        requestedAccess[msg.sender][requester] = false;
        emit AccessRequestRejected(msg.sender, requester);
    }

    /**
     * @dev Requests access to another user's health record.
     * @param recordOwner The address of the health record owner.
     */
    function requestAccess(address recordOwner, string memory note) public {
        require(recordOwner != msg.sender, "Cannot request access to your own record");
        require(!access[recordOwner][msg.sender], "Access already granted");

        for (uint256 i = 0; i < accessRequests[recordOwner].length; i++) {
            require(requestedAccess[recordOwner][msg.sender] != true, "Access already requested");
        }

        accessRequests[recordOwner].push(msg.sender);
        requestedAccess[recordOwner][msg.sender] = true;

        accessRequestNotes[recordOwner][msg.sender] = note;
        emit AccessRequested(recordOwner, msg.sender, note);
    }

    /**
     * @dev Revokes access to the sender's health record from a specified address.
     * @param permissionedUser The address to revoke access from.
     */
    function revokeAccess(address permissionedUser) public {
        require(permissionedUser != address(0), "Invalid grantee address");
        require(access[msg.sender][permissionedUser], "Access not granted");

        access[msg.sender][permissionedUser] = false;
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
 * @dev Checks if a specific requester has access to the owner's health record.
 * @param owner The address of the health record owner.
 * @return A boolean indicating if the requester has access.
 */
    function hasRequestedAccess(address owner) public view returns (bool) {
        return requestedAccess[owner][msg.sender];
    }

    /**
     * @dev Checks if a specific requester has access to the owner's health record.
     * @param owner The address of the health record owner.
     * @return A boolean indicating if the requester has access.
     */
    function hasAccess(address owner) public view returns (bool) {
        return access[owner][msg.sender];
    }

    /**
     * @dev Retrieves the health record of a specified owner if the caller has access.
     * @param recordOwner The address of the health record owner.
     * @return The IPFS hash of the complete health record JSON.
     */
    function getHealthRecord(address recordOwner) public view returns (string memory) {
        require(
            recordOwner == msg.sender || access[recordOwner][msg.sender],
            "Access denied"
        );
        return healthRecords[recordOwner].ipfsHash;
    }

    /**
     * @dev Retrieves the health record of a specified owner if the caller has access.
     * @return The IPFS hash of the complete health record JSON.
     */
    function getOwnHealthRecord() public view returns (string memory) {
        return healthRecords[msg.sender].ipfsHash;
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

    function getAccessRequests() public view returns (address[] memory, string[] memory) {
        uint256 length = accessRequests[msg.sender].length;
        address[] memory requesters = new address[](length); 
        string[] memory notes = new string[](length);  

        for (uint256 i = 0; i < length; i++) {
            requesters[i] = accessRequests[msg.sender][i];  
            notes[i] = accessRequestNotes[msg.sender][requesters[i]]; 
        }

        return (requesters, notes);
    }


}
