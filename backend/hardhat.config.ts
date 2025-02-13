import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

import { HardhatUserConfig } from "hardhat/config";

// For local setup
/*
const URL = process.env.URL || "";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    remote: {
      url: URL,
      chainId: 31337,
      accounts: {
        mnemonic:
          "test test test test test test test test test test test junk",
      },
    },
  },
};
*/

// For infura setup
const INFURA_API_KEY = process.env.INFURA_API_KEY || "";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
      accounts: PRIVATE_KEY ? [`0x${PRIVATE_KEY}`] : []
    },
  },
  etherscan: {
    apiKey: {
      sepolia: "PE1WR8AWU1JFQUQ4JNX8GAIMYXFGSRQDFD"
    }
  }
};

export default config;