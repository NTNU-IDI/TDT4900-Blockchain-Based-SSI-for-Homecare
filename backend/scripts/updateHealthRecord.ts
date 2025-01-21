import { ethers } from "hardhat";

async function main() {
    const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS; // Replace with deployed address
    const IPFS_HASH = "bafkreiae2cfgxj4omrqnibqwqhqf26mvfwipaiwy5filfhxtzmi67vr7ky"; // Replace with IPFS hash

    // Get signer
    const signer = (await ethers.getSigners())[0];
    console.log("Using account:", await signer.getAddress());

    // Attach to deployed contract
    const HealthInfo = await ethers.getContractFactory("HealthInfo");
    const contract = HealthInfo.attach(CONTRACT_ADDRESS);

    // Call the updateHealthRecord function
    const tx = await contract.connect(signer).addOrUpdateHealthRecord(IPFS_HASH);

    console.log("Waiting for transaction confirmation...");
    await tx.wait();

    console.log("Health record updated with IPFS hash:", IPFS_HASH);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
