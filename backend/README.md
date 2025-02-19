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
## 2. Deploy the Smart Contract
To deploy contract and set up owners for existing IPFS files, run:
```shell
npx hardhat run scripts/deployAndSetUp.ts --network localhost
```

To deploy contract, upload new IPFS files and set owners, run:
```shell
npx hardhat run scripts/deployAndResetIPFS.ts --network localhost
```

### Remote Access
If multiple users wants to connect to the local blockchain, start the hardhat node with a public hostname, for instance:
```shell
npx hardhat node --hostname 10.22.X.X
```
Deploy the contract in the same ways as above with the --network flag remote, for instance:
```shell
npx hardhat run scripts/deployAndSetUp.ts --network remote
```

# Deploy to Sepolia Testnet
## 1. Deploy Using Hardhat Ignition
```shell
npx hardhat ignition deploy ./ignition/modules/HealthInfo.ts --network sepolia
```

## 2. Set up the contract with owners 
To set up owners of existing ipfs files, run:
```shell
npx hardhat run scripts/setUp.ts --network sepolia
```
To upload new ipfs files and set up owners, run:
```shell
npx hardhat run scripts/resetIPFS.ts --network sepolia
```