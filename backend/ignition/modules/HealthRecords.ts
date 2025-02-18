import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const HealthRecordsModule = buildModule("HealthRecordsModule", (m) => {
  const healthRecords = m.contract("HealthRecords");

  return { healthRecords };
});

export default HealthRecordsModule;
