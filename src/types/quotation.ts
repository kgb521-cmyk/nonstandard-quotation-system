export type EquipmentCategory = "temperature" | "flow" | "pressure" | "fluid" | "aging";

export interface QuotationInputPayload {
  minTemperature?: number;
  maxTemperature?: number;
  pressureRangeMax?: number;
  pressureRange?: { min: number; max: number };
  flowRange?: { min: number; max: number };
  mediumType?: string;
  workstationCount?: number;
  controlMode?: string;
  installationEnvironment?: string;
  accuracyLevel?: "standard" | "high";
}

export interface ModuleLine {
  moduleCode: string;
  moduleName: string;
  moduleCategory?: string;
  specSummary?: string;
  quantity: number;
  unit?: string;
  unitPrice: number;
  lineTotal?: number;
  sourceRuleCode?: string;
  calculationNote?: string;
  selectionMode?: "auto" | "manual";
  isOverridden?: boolean;
}
