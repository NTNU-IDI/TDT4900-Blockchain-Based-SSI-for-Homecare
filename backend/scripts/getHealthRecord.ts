import { ethers } from "hardhat";

async function main() {
    // Replace with your deployed contract address
    const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

    // Replace with the target address
    const TARGET_ADDRESS = "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266";

    // Get the contract instance
    const HealthInfo = await ethers.getContractFactory("HealthInfo");
    const contract = HealthInfo.attach(CONTRACT_ADDRESS);

    // Retrieve the health record IPFS hash
    const ipfsHash = await contract.getHealthRecord(TARGET_ADDRESS);
    console.log("Retrieved IPFS hash:", ipfsHash);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
