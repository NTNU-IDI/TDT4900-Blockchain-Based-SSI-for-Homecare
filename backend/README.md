# Ethereum Smart Contract Backend
This repository contains the Ethereum smart contract backend for managing health information using IPFS and Hardhat.

## Deploy and Set Up the Contract
### Prerequisites
- **Configure Client Data:**
Create client data files in the `data` folder which will be uploaded to IPFS. Follow the format of the `FirstnameLastname.json` file.

- **Set Up Environment Variables:**
Create a `.env` file containing the variables specified in `.env.example` (not CONTRACT_ADDRESS).

- **Sepolia Test Tokens:**
Ensure you have a sufficient balance of Sepolia Test Tokens for deployment.

### Deployment Steps
1. **Deploy Contract to Sepolia Testnet using Hardhat Ignition**
```shell
npm install
npx hardhat ignition deploy ./ignition/modules/HealthRecords.ts --network sepolia
```
2. **Add Contract Address to .env**
```shell
CONTRACT_ADDRESS=your_deployed_contract_address
```
3. **Upload IPFS Files and Set Up Owners**
```shell
npx hardhat run scripts/setUpIPFS.ts --network sepolia
```