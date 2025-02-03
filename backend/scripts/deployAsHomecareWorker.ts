import { ethers } from "hardhat";

async function main() {
  const accounts = await ethers.getSigners();
  const selectedAccount = accounts[15];

  console.log(`Using Account: ${await selectedAccount.getAddress()}`);


  const MyContract = await ethers.getContractFactory("HealthInfo");
  const contract = await MyContract.connect(selectedAccount).deploy();
  console.log("Deploying contract...");

  await contract.waitForDeployment();

  console.log("Contract deployed at:", await contract.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
