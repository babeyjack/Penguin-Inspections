import type { EquipmentType } from "../Dashboard/Types/equipmentType";
import GetFetchComamnd from "./GetFetchCommand";

const FetchTypes = (form: {
    id: string;
    recievedID: boolean;
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
}, setForm : React.Dispatch<React.SetStateAction<{
    id: string;
    recievedID: boolean;
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
}>>
) => {

    const fetchCommand = GetFetchComamnd("/equipment/userTypes", "/equipment/companyTypes/${domain}");

    fetch(fetchCommand, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status == 200) {
          //console.log("Value Recieved : " + data.value);
          setForm({ ...form, ["types"]: data.value, ["recievedTypes"]: true });
        }
      });
};

export default FetchTypes;