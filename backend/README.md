# Backend

## Basics
### To run
```shell
npx hardhat node
npx hardhat run scripts/deploy.ts --network localhost
```
Update .env with the contract address

```shell
npx hardhat run scripts/updateHealthRecord.ts --network localhost
npx hardhat run scripts/getHealthRecord.ts --network localhost
```

### To get a list of updates done to the health record:
```shell
npx hardhat run scripts/getHealthRecordUpdates.ts --network localhost
```

### Manage access rights:
```shell
npx hardhat run scripts/grantAccess.ts --network localhost
npx hardhat run scripts/revokeAccess.ts --network localhost
npx hardhat run scripts/getAccessors.ts --network localhost
```

## Obs
Health records have to be added directly to Pinata in their web interface. When update health record is called with the record's CID, the signer will become the owner.

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
