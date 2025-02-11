# Backend

## Basics
### To run
```shell
npx hardhat node
```
#### Without resetting ipfs files:
```shell
npx hardhat run scripts/deployAndSetUp.ts --network localhost
```
Add contract address to frontends

#### To reset ipfs files:

```shell
npx hardhat run scripts/deployAndResetIPFS.ts --network localhost
```

#### For several users:
Log into correct MetaMask account (one of the hardhat accounts) and network (10.22.X.X), one person runs
```shell
npx hardhat node --hostname 10.22.X.X
npx hardhat run scripts/deployAndResetIPFS.ts --network remote
```

#### To deploy to Sepolia for testing 
Log into correct sepolia testnet account in metamask and (be patient!):
```shell
npx hardhat ignition deploy ./ignition/modules/HealthInfo.ts --network sepolia
npx hardhat run scripts/setUp.ts --network sepolia
```
Add contract address to frontends. After starting the app, switch metamask to sepolia testnet and then load.

## Sample Hardhat Project
This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.ts
```
