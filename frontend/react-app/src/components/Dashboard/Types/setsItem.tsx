// import type { EquipmentItem } from "./equipmentItem";

export interface SetsItemInterface {
  id: string;
  internal_id: string;
  desc: string;
  equipment_count: number;
  equipment_value: number;
  // items: EquipmentItem;
  // sets: SetsItemInterface;
}

export type { SetsItemInterface as SetsItem };
