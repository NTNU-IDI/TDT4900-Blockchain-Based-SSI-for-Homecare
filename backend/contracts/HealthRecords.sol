// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

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

    event HealthRecordUpdated(address indexed owner, address indexed updater);
    event AccessRequested(address indexed owner, address indexed requester);
    event AccessRequestAccepted(address indexed owner, address indexed requester);
    event AccessRequestRejected(address indexed owner, address indexed requester);
    event AccessRevoked(address indexed owner, address indexed user);

    modifier onlyAccess (address owner) {
        require(access[owner][msg.sender], "Access denied");
        _;
    }

    /**
     * @dev Initializes a client health record.
     * @param owner The address of the client.
     * @param ipfsHash The IPFS hash of the health record.
     */
    function initializeClientRecord(address owner, string memory ipfsHash) public {
        require(updates[owner].length == 0, "Owner already has a record");
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
     * @param owner The address of the client.
     * @param newIpfsHash The new IPFS hash of the health record.
     * @param description The description of the change.
     */
    function updateClientRecord(address owner, string memory newIpfsHash, string memory description) onlyAccess(owner) public {
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

        emit HealthRecordUpdated(owner, msg.sender);
    }

    /**
     * @dev Grants access to the sender's health record to a specified address.
     * @param requester The address to grant access to.
     */
    function grantAccess(address requester) public {
        require(requester != address(0), "Invalid requester");
        require(!access[msg.sender][requester], "Access already granted");
        require(requestedAccess[msg.sender][requester], "No access request found");

        access[msg.sender][requester] = true;
        accessList[msg.sender].push(requester);
        uint256 length = accessRequests[msg.sender].length;
        for (uint256 i = 0; i < length; i++) {
            if (accessRequests[msg.sender][i].requester == requester) {
                accessRequests[msg.sender][i] = accessRequests[msg.sender][length - 1];
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
        require(!access[msg.sender][requester], "Access already granted");
        require(requestedAccess[msg.sender][requester], "No access request found");

        uint256 length = accessRequests[msg.sender].length;
        for (uint256 i = 0; i < length; i++) {
            if (accessRequests[msg.sender][i].requester == requester) {
                accessRequests[msg.sender][i] = accessRequests[msg.sender][length - 1];
                accessRequests[msg.sender].pop();
                break;
            }
        }
        requestedAccess[msg.sender][requester] = false;
        emit AccessRequestRejected(msg.sender, requester);
    }

    /**
     * @dev Requests access to a client's health record.
     * @param owner The client address.
     * @param note Optional note with sent request
     */
    function requestAccess(address owner, string memory note) public {
        require(owner != msg.sender, "Cannot request access to your own record");
        require(!access[owner][msg.sender], "Access already granted");
        require(!requestedAccess[owner][msg.sender], "Access already requested");

        accessRequests[owner].push(AccessRequest(msg.sender, note));
        requestedAccess[owner][msg.sender] = true;

        emit AccessRequested(owner, msg.sender);
    }

    /**
     * @dev Revokes access to the sender's health record from a specified address.
     * @param permissionedUser The address to revoke access from.
     */
    function revokeAccess(address permissionedUser) public {
        require(permissionedUser != address(0), "Invalid user address");
        require(access[msg.sender][permissionedUser], "User does not have access");

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

    function hasRequestedAccess(address owner) public view returns (bool) {
        return requestedAccess[owner][msg.sender];
    }
    function hasAccess(address owner) public view returns (bool) {
        return access[owner][msg.sender];
    }
    function getHealthRecord(address owner) onlyAccess(owner) public view returns (string memory) {
        return ipfsHashes[owner];
    }
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
