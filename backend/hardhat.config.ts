import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

import { HardhatUserConfig } from "hardhat/config";

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
          "test test test test test test test test test test test junk", // Default Hardhat mnemonic
      },
    },
  },
};

export default config;
