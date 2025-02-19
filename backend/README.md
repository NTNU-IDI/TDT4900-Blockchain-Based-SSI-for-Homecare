# Ethereum Smart Contract Backend
This repository contains the Ethereum smart contract backend for managing health information using IPFS and Hardhat.

## Getting Started
## Install Dependencies
```shell
npm install
```
# Deploy to Sepolia Testnet
## 1. Deploy Using Hardhat Ignition
```shell
npx hardhat ignition deploy ./ignition/modules/HealthRecords.ts --network sepolia
```

## 2. Set up IPFS files with owners
To upload new ipfs files and set up owners, run:
```shell
npx hardhat run scripts/setUpIPFS.ts --network sepolia
```