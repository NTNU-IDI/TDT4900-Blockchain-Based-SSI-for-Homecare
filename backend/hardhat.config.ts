import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

import { HardhatUserConfig } from "hardhat/config";

const INFURA_API_KEY = process.env.INFURA_API_KEY || "";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";

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
      url: "http://10.22.97.206:8545",
      chainId: 31337,
      accounts: {
        mnemonic:
          "test test test test test test test test test test test junk", // Default Hardhat mnemonic
      },
    },
  },
};

export default config;
