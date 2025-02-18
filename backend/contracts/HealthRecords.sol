// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HealthRecords {

    struct Update {
        address updater;
        uint256 timestamp;
        string description;
    }

    struct AccessRequest {
        address requester;
        string note;
    }

    mapping(address => string) private ipfsHashes;
    mapping(string => bool) private usedIpfsHashes;
    mapping(address => Update[]) private updates;
    mapping(address => mapping(address => bool)) private access;
    mapping(address => mapping(address => bool)) private requestedAccess;
    mapping(address => address[]) private accessList;
    mapping(address => AccessRequest[]) private accessRequests;


    event HealthRecordHashUpdated(address indexed owner, address indexed updater);
    event AccessRequested(address indexed owner, address indexed requester);
    event AccessRequestAccepted(address indexed owner, address indexed requester);
    event AccessRequestRejected(address indexed owner, address indexed requester);
    event AccessRevoked(address indexed owner, address indexed user);

    modifier onlyAccess {
        require(access[msg.sender][msg.sender], "Access denied");
        _;
    }

    /**
     * @dev Initializes a patient health record.
     * @param owner The address of the patient.
     * @param ipfsHash The IPFS hash of the health record.
     */
    function initializePatientRecord(address owner, string memory ipfsHash) public {
        require(updates[owner].length == 0, "Owner already exists");
        require(!usedIpfsHashes[ipfsHash], "IPFS hash already used");

        access[owner][owner] = true;
        ipfsHashes[owner] = ipfsHash;
        usedIpfsHashes[ipfsHash] = true;

        updates[owner].push(Update({
            updater: owner,
            timestamp: block.timestamp,
            description: "Initialized health record"
        }));
    }

    /**
     * @dev Updates the ipfs hash of the owner.
     * @param owner The address of the patient.
     * @param newIpfsHash The IPFS hash of the health record.
     * @param description The description of the change.
     */
    function updatePatientHash(address owner, string memory newIpfsHash, string memory description) onlyAccess public {
        require(updates[owner].length != 0, "Owner is not initialized");
        require(!usedIpfsHashes[newIpfsHash], "IPFS hash already used");
        usedIpfsHashes[ipfsHashes[owner]] = false;
        ipfsHashes[owner] = newIpfsHash;
        usedIpfsHashes[newIpfsHash] = true;
        updates[owner].push(Update({
            updater: msg.sender,
            timestamp: block.timestamp,
            description: description
        }));

        emit HealthRecordHashUpdated(owner, msg.sender);
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
            if (accessRequests[msg.sender][i].requester == requester) {
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
            if (accessRequests[msg.sender][i].requester == requester) {
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

        accessRequests[recordOwner].push(AccessRequest(msg.sender, note));
        requestedAccess[recordOwner][msg.sender] = true;

        emit AccessRequested(recordOwner, msg.sender);
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
     * @param owner The address of the health record owner.
     * @return The IPFS hash of the complete health record JSON.
     */
    function getHealthRecord(address owner) onlyAccess public view returns (string memory) {
        return ipfsHashes[owner];
    }

    /**
     * @dev Retrieves the health record of a specified owner if the caller has access.
     * @return The IPFS hash of the complete health record JSON.
     */
    function getOwnHealthRecord() public view returns (string memory) {
        return ipfsHashes[msg.sender];
    }

    function getUpdates() public view returns (address[] memory, uint256[] memory, string[] memory) {
        uint256 length = updates[msg.sender].length;
        address[] memory updaters = new address[](length);
        uint256[] memory timestamps = new uint256[](length);
        string[] memory description = new string[](length);

        for (uint256 i = 0; i < length; i++) {
            updaters[i] = updates[msg.sender][i].updater;
            timestamps[i] = updates[msg.sender][i].timestamp;
            description[i] = updates[msg.sender][i].description;
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
            requesters[i] = accessRequests[msg.sender][i].requester;  
            notes[i] = accessRequests[msg.sender][i].note; 
        }

        return (requesters, notes);
    }


}
