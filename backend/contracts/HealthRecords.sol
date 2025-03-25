// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;
import "hardhat/console.sol";

contract HealthRecords {
    struct Update {
        string updaterDID;
        uint256 timestamp;
        string description;
    }

    struct AccessRequest {
        string requesterDID;
        string note;
    }

    mapping(string => address) private didToAddress;
    mapping(address => string) private addressToDID;
    mapping(string => string) private didRoles;
    mapping(string => string) private ipfsHashes;
    mapping(string => bool) private usedIpfsHashes; 
    mapping(string => Update[]) private updates;
    mapping(string => mapping(string => bool)) private access; 
    mapping(string => mapping(string => bool)) private requestedAccess; 
    mapping(string => string[]) private accessList; 
    mapping(string => AccessRequest[]) private accessRequests; 

    event HealthRecordUpdated(string indexed ownerDID, string updaterDID);
    event AccessRequested(string indexed ownerDID, string requesterDID);
    event AccessRequestAccepted(string indexed ownerDID, string requesterDID);
    event AccessRequestRejected(string indexed ownerDID, string requesterDID);
    event AccessRevoked(string indexed ownerDID, string userDID);
    event DIDVerified(string indexed did, address indexed user);
    event DIDUpdated(string indexed did, address oldAddress, address newAddress);


    modifier onlyAccess(string memory ownerDID) {
        require(access[ownerDID][addressToDID[msg.sender]], "Access denied");
        require(verifyDID(msg.sender), "DID verification failed");
        _;
    }
        
    /**
     * @dev Registers or updates a DID for the caller with an associated role.
     * @param did The DID to associate with the caller's address.
     * @param role The role to associate with the DID.
     */
    function setDID(string memory did, string memory role) public {
        require(bytes(did).length > 0, "Invalid DID");
        require(bytes(role).length > 0, "Invalid role");
        require(didToAddress[did] == address(0), "DID already taken");

        string memory existingDID = addressToDID[msg.sender];
        if (bytes(existingDID).length > 0) {
            didToAddress[existingDID] = address(0);

        addressToDID[msg.sender] = did;
        didToAddress[did] = msg.sender;
        didRoles[did] = role;

        emit DIDVerified(did, msg.sender);
    }
    
    }

     /**
     * @dev Verifies that the caller has a DID associated with their address.
     * @return bool - True if the DID exists, false otherwise.
     */
    function verifyDID(address user) public view returns (bool) {
        return bytes(addressToDID[user]).length > 0;
    }

      /**
     * @dev Retrieves the DID associated with a specific address.
     * @param user The address to query.
     * @return string - The DID associated with the address.
     */
    function getDID(address user) public view returns (string memory) {
        return addressToDID[user];
    }

    
    /**
     * @dev Updates the address associated with a DID.
     * @param did The DID to update.
     * @param newAddress The new address to associate with the DID.
     */
    function updateDIDAddress(string memory did, address newAddress) public {
        require(didToAddress[did] == msg.sender, "Unauthorized DID update");
        require(newAddress != address(0), "Invalid new address");

        address oldAddress = msg.sender;
        didToAddress[did] = newAddress;
        addressToDID[newAddress] = did;
        addressToDID[oldAddress] = "";

        emit DIDUpdated(did, oldAddress, newAddress);
    }

    /**
     * @dev Initializes a patient health record.
     * @param ownerDID The DID of the patient.
     * @param ipfsHash The IPFS hash of the health record.
     */
    function initializePatientRecord(string memory ownerDID, string memory ipfsHash) public {

        console.log("ownerDID: %s", ownerDID);
        console.log("msg.sender: %s", msg.sender);
        
        require(updates[ownerDID].length == 0, "Owner already has a record");
        require(!usedIpfsHashes[ipfsHash], "IPFS hash already used");


        access[ownerDID][ownerDID] = true;
        ipfsHashes[ownerDID] = ipfsHash;
        usedIpfsHashes[ipfsHash] = true;

        updates[ownerDID].push(Update({
            updaterDID: ownerDID,
            timestamp: block.timestamp,
            description: "Initialized health record"
        }));
    }

    /**
     * @dev Updates the ipfs hash of the owner.
     * @param ownerDID The address of the patient.
     * @param newIpfsHash The new IPFS hash of the health record.
     * @param description The description of the change.
     */
    function updatePatientRecord(string memory ownerDID, string memory newIpfsHash, string memory description) onlyAccess(ownerDID) public {
        require(!usedIpfsHashes[newIpfsHash], "IPFS hash already used");
        usedIpfsHashes[ipfsHashes[ownerDID]] = false;
        ipfsHashes[ownerDID] = newIpfsHash;
        usedIpfsHashes[newIpfsHash] = true;

       updates[ownerDID].push(Update({
            updaterDID: addressToDID[msg.sender],
            timestamp: block.timestamp,
            description: description
        }));

        emit HealthRecordUpdated(ownerDID, addressToDID[msg.sender]);
    }

    /**
     * @dev Grants access to the sender's health record to a specified address.
     * @param requesterDID The address to grant access to.
     */
    function grantAccess(string memory requesterDID) public {
        string memory ownerDID = addressToDID[msg.sender];
        require(didToAddress[requesterDID] != address(0), "Invalid requester DID");
        require(!access[ownerDID][requesterDID], "Access already granted");
        require(requestedAccess[ownerDID][requesterDID], "No access request found");

        access[ownerDID][requesterDID] = true;
        accessList[ownerDID].push(requesterDID);

       
        uint256 length = accessRequests[ownerDID].length;
        for (uint256 i = 0; i < length; i++) {
            if (keccak256(bytes(accessRequests[ownerDID][i].requesterDID)) == keccak256(bytes(requesterDID))) {
                accessRequests[ownerDID][i] = accessRequests[ownerDID][length - 1];
                accessRequests[ownerDID].pop();
                break;
            }
        }

        requestedAccess[ownerDID][requesterDID] = false;
        emit AccessRequestAccepted(ownerDID, requesterDID);
    }

    /**
     * @dev Denies an access request.
     * @param requesterDID The address of the user requesting access.
     */
   function denyAccessRequest(string memory requesterDID) public {
        string memory ownerDID = addressToDID[msg.sender];
        require(!access[ownerDID][requesterDID], "Access already granted");
        require(requestedAccess[ownerDID][requesterDID], "No access request found");

        uint256 length = accessRequests[ownerDID].length;
        for (uint256 i = 0; i < length; i++) {
            if (keccak256(bytes(accessRequests[ownerDID][i].requesterDID)) == keccak256(bytes(requesterDID))) {
                accessRequests[ownerDID][i] = accessRequests[ownerDID][length - 1];
                accessRequests[ownerDID].pop();
                break;
            }
        }
        requestedAccess[ownerDID][requesterDID] = false;
        emit AccessRequestRejected(ownerDID, requesterDID);
    }

    /**
     * @dev Requests access to a patient's health record.
     * @param ownerDID The DID of the patient.
     * @param note Optional note with the request.
     */
    function requestAccess(string memory ownerDID, string memory note) public {
        string memory requesterDID = addressToDID[msg.sender];
        require(didToAddress[ownerDID] != didToAddress[requesterDID], "Cannot request access to your own record");
        require(!access[ownerDID][requesterDID], "Access already granted");
        require(!requestedAccess[ownerDID][requesterDID], "Access already requested");

        accessRequests[ownerDID].push(AccessRequest(requesterDID, note));
        requestedAccess[ownerDID][requesterDID] = true;

        emit AccessRequested(ownerDID, requesterDID);
    }

  /**
     * @dev Revokes access to the sender's health record from a specified DID.
     * @param userDID The DID to revoke access from.
     */
    function revokeAccess(string memory userDID) public {
        string memory ownerDID = addressToDID[msg.sender];
        require(access[ownerDID][userDID], "User does not have access");

        access[ownerDID][userDID] = false;

        uint256 length = accessList[ownerDID].length;
        for (uint256 i = 0; i < length; i++) {
            if (keccak256(bytes(accessList[ownerDID][i])) == keccak256(bytes(userDID))) {
                accessList[ownerDID][i] = accessList[ownerDID][length - 1];
                accessList[ownerDID].pop();
                break;
            }
        }

        emit AccessRevoked(ownerDID, userDID);
    }


  function hasRequestedAccess(string memory ownerDID, string memory requesterDID) public view returns (bool) {
        return requestedAccess[ownerDID][requesterDID];
    }

    function hasAccess(string memory ownerDID, string memory requesterDID) public view returns (bool) {
        return access[ownerDID][requesterDID];
    }

    function getHealthRecord(string memory ownerDID) onlyAccess(ownerDID) public view returns (string memory) {
        return ipfsHashes[ownerDID];
    }

    function getOwnHealthRecord(string memory requesterDID) public view returns (string memory) {
        return ipfsHashes[requesterDID];
    }

    function getAccessList(string memory ownerDID) public view returns (string[] memory) {
        return accessList[ownerDID];
    }
   
   /**
     * @dev Retrieves the updates for the caller's health record.
     * @return (string[] memory, uint256[] memory, string[] memory) - The updater DIDs, timestamps, and descriptions.
     */
    function getUpdates(string memory ownerDID) public view returns (string[] memory, uint256[] memory, string[] memory) {
        uint256 length = updates[ownerDID].length;
        string[] memory updaters = new string[](length);
        uint256[] memory timestamps = new uint256[](length);
        string[] memory descriptions = new string[](length);

        for (uint256 i = 0; i < length; i++) {
            updaters[i] = updates[ownerDID][i].updaterDID;
            timestamps[i] = updates[ownerDID][i].timestamp;
            descriptions[i] = updates[ownerDID][i].description;
        }

        return (updaters, timestamps, descriptions);
    }

    function getAccessRequests(string memory ownerDID) public view returns (string[] memory, string[] memory) {
        uint256 length = accessRequests[ownerDID].length;
        string[] memory requesters = new string[](length);
        string[] memory notes = new string[](length);

        for (uint256 i = 0; i < length; i++) {
            requesters[i] = accessRequests[ownerDID][i].requesterDID;
            notes[i] = accessRequests[ownerDID][i].note;
        }

        return (requesters, notes);
    }
}