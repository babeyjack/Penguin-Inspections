// import type { EquipmentItem } from "./equipmentItem";

export interface ClientsItemInterface {
  user_id: string;
  internal_id: string;
  first_name: string;
  last_name: string;
  email: string;
  rent_count: number;
  competency_level: number;
  competency_check_by: string;
}

export type { ClientsItemInterface as ClientsItem };
