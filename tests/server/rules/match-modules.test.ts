import { describe, expect, it } from "vitest";
import { matchModules } from "../../../src/server/rules/match-modules";

describe("matchModules", () => {
  it("adds low-temperature refrigeration and scales aging control cabinets", async () => {
    const temperatureResult = await matchModules("temperature", {
      minTemperature: -40,
      maxTemperature: 120,
      controlMode: "PLC"
    });

    expect(
      temperatureResult.modules.some((module) => module.moduleCode === "TEMP-REFRIG-LOW")
    ).toBe(true);

    const agingResult = await matchModules("aging", {
      workstationCount: 18
    });

    const cabinet = agingResult.modules.find((module) => module.moduleCode === "AGING-CABINET");
    expect(cabinet?.quantity).toBe(3);
  });
});
