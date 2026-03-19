export interface EquipmentItemInterface {
  id: string;
  name: string;
  brand: string;
  serial: string;
  price: number;
  colour: string;
  type_number: number;
  fabirc_length: number;
  fabric_width: number;
  date_first_used: string;
  retirement_date: string;
  next_inspection_date: string;
  status: number;
  inspection_notes: string;
}

export type { EquipmentItemInterface as EquipmentItem };
