# Ethereum Smart Contract Backend
This repository contains the Ethereum smart contract backend for managing health information using IPFS and Hardhat.

## Getting Started
## Install Dependencies
```shell
npm install
```
# Run Locally

## 1. Start a Local Hardhat Blockchain
```shell
npx hardhat node
```

### Remote Access
If multiple users wants to connect to the local blockchain, start the hardhat node with a public hostname, for instance:
```shell
npx hardhat node --hostname 10.22.X.X
```
Deploy the contract with the --network flag remote, for instance:
```shell
npx hardhat run scripts/deployAndSetUp.ts --network remote
```

## 2. Deploy the Smart Contract
Option 1: Deploy contract using existing IPFS files
```shell
npx hardhat run scripts/deployAndSetUp.ts --network localhost
```

Option 2: Deploy contract and reset IPFS files
```shell
npx hardhat run scripts/deployAndResetIPFS.ts --network localhost
```

# Deploy to Sepolia Testnet
## 1. Deploy Using Hardhat Ignition
```shell
npx hardhat ignition deploy ./ignition/modules/HealthInfo.ts --network sepolia
```

## 2. Set up the contract with owners of the ipfs files
```shell
npx hardhat run scripts/setUp.ts --network sepolia
```