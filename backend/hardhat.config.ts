import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

import { HardhatUserConfig } from "hardhat/config";

const INFURA_API_KEY = process.env.INFURA_API_KEY || "";
const METAMASK_PRIVATE_KEY = process.env.METAMASK_PRIVATE_KEY || "";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    sepolia: { 
      url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
      accounts: METAMASK_PRIVATE_KEY ? [`0x${METAMASK_PRIVATE_KEY}`] : [],
    },
  },
  etherscan: {
    apiKey: {
      sepolia: ETHERSCAN_API_KEY
    },
  },
};

export default config;
