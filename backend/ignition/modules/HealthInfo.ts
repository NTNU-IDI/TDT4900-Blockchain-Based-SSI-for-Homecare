import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const HealthInfoModule = buildModule("HealthInfoModule", (m) => {
  const healthInfo = m.contract("HealthInfo");

  return { healthInfo };
});

export default HealthInfoModule;
