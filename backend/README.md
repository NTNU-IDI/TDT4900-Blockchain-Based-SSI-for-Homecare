# Backend

## Basics
### To run
```shell
npx hardhat node
```
Check accounts list in .env matches the accounts that shows up

```shell
npx hardhat run scripts/deploy.ts --network localhost
```
Update .env in all modules with the contract address

To set up normally:

```shell
npx hardhat run scripts/setUp.ts --network localhost
```

To reset ipfs files:

```shell
npx hardhat run scripts/deployAndResetIPFS.ts --network localhost
```

For several users:

Log into correct MetaMask account and network, one person runs
```shell
npx hardhat node --hostname 10.22.X.X
npx hardhat run scripts/deployAndResetIPFS.ts --network remote

```

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
