import type { EquipmentType } from "../Dashboard/Types/equipmentType";

  const FetchHasLength = (form: {
      id: string;
      externalID?: boolean;
      recievedID?: boolean;
      name: string;
      type: number;
      recievedTypes: boolean;
      types: EquipmentType[];
      manufacturer: string;
      serial: string;
      price: number;
      colour: string;
      firstUseDate: string;
      retirementDate: string;
      fabricLength: number;
      fabricWidth: number;
  }) => {
    //console.log("Check has length");
    let value = false;
    form.types.forEach((t) => {
      if (t.id == form.type) {
        if (t.has_length == 1) {
          value = true;
        }
      }
    });
    return value;
  };

export default FetchHasLength