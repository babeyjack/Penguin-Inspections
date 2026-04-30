import Button from "../StandardComponents/Button";
import Card from "../StandardComponents/Card";
import type { EquipmentItem } from "../Dashboard/Types/equipmentItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCalendar,
    faClock,
    faCoins,
    faPalette,
    faTrash,
} from "@fortawesome/free-solid-svg-icons";
import type { EquipmentType } from "../Dashboard/Types/equipmentType";
import { useState } from "react";

interface Props {
    equipment: EquipmentItem;
    onDelete: (id: string) => void;
    types: {
        types: EquipmentType[];
        recieved: boolean;
    };
}

const RentableItemCard = ({
    equipment,
    onDelete,
    types,
}: Props) => {
    const GetStatusColours = () => {
        switch (equipment.status) {
            case 0: {
                return ["#22c55e", "#0a5e29"];
            }
            case 1: {
                return ["#eab308", "#705c04"];
            }
            case 2: {
                return ["#f97316", "#7c3a0b"];
            }
            default: {
                return ["#ef4444", "#591919"];
            }
        }
    };
    const [type, OnChangeType] = useState({
        equipment_id: "-1",
        type: "None",
        received: false,
    });

    const FetchTypeName = (type_id: number) => {
        // console.log("Fetch type name : " + type_id);
        const match = types.types.find(
            (item: EquipmentType) => item.id === type_id
        );

        if (match) {
            // console.log("Type Found:", match.display_name);
            OnChangeType({
                equipment_id: equipment.id,
                type: match.display_name,
                received: true,
            });
        } else {
            console.warn("No matching type found for ID:", type_id);
        }
    };

    if (!type.received || type.equipment_id != equipment.id) {
        FetchTypeName(equipment.type_number);
    }
    return (
        <Card
            classes={"container d-flex justify-content-start px-0 mb-4 mx-2"}
            style={{
                borderTopWidth: "4px",
                borderTopColor: GetStatusColours()[0],
                borderTopStyle: "solid",
                minWidth: "350px",
                flexBasis: "24%",
            }}
            footer={
                <>
                    {/*Footer Elements*/}
                    <div className="d-flex justify-content-between">
                        <div></div>
                        <div className="d-flex gap-2">
                            <Button
                                colour="outline-secondary"
                                onClick={() => onDelete(equipment.id)}
                            >
                                <FontAwesomeIcon icon={faTrash} />
                            </Button>
                        </div>
                    </div>
                </>
            }
        >
            {/*Body Elements*/}
            <>
                {/*Header*/}
                <div className="pb-2">
                    <h4>
                        {equipment.id + ": " + equipment.brand + " " + equipment.name}
                    </h4>
                    <div className="d-flex justify-content-between">
                        <p className="text-body-secondary">
                            <small>{equipment.serial}</small>
                        </p>
                        <span
                            className="alert px-2 py-1 rounded-full"
                            style={{
                                backgroundColor: GetStatusColours()[0],
                                color: GetStatusColours()[1],
                                borderColor: GetStatusColours()[1],
                            }}
                        >
                            <p
                                className="p-0 m-0"
                                style={{ fontSize: "small", color: GetStatusColours()[1] }}
                            >
                                {equipment.status === 0
                                    ? "Available"
                                    : equipment.status === 1
                                        ? "Rented Soon"
                                        : equipment.status === 2
                                            ? "Rented"
                                            : "Retired"}
                            </p>
                        </span>
                    </div>
                </div>
                {/*Body*/}
                <div className="pb-2">
                    {/*Type Display*/}
                    <div>
                        <p>
                            <b>Type: </b>
                            {type.type}
                        </p>
                    </div>

                    {/*Price*/}
                    <div
                        className="d-flex justify-content-start"
                        style={{ alignItems: "center" }}
                    >
                        <FontAwesomeIcon icon={faCoins} />
                        <p className="ms-1 mb-0">Price: £{equipment.price}</p>
                    </div>
                    {/*Colour*/}
                    <div
                        className="d-flex justify-content-start"
                        style={{ alignItems: "center" }}
                    >
                        <FontAwesomeIcon icon={faPalette} />
                        <p className="ms-1 mb-0">Colour: {equipment.colour}</p>
                    </div>
                    {/*Purchased*/}
                    <div
                        className="d-flex justify-content-start"
                        style={{ alignItems: "center" }}
                    >
                        <FontAwesomeIcon icon={faCalendar} />
                        <p className="ms-1 mb-0">Purchased: {equipment.date_first_used}</p>
                    </div>
                    {/*Retirement*/}
                    <div
                        className="d-flex justify-content-start"
                        style={{ alignItems: "center" }}
                    >
                        <FontAwesomeIcon icon={faCalendar} />
                        <p className="ms-1 mb-0">Retirement: {equipment.retirement_date}</p>
                    </div>
                    {/*Next Inspection*/}
                    <div
                        className="d-flex justify-content-start"
                        style={{ alignItems: "center" }}
                    >
                        <FontAwesomeIcon icon={faClock} />
                        <p className="ms-1 mb-0">
                            Next Inspection: {equipment.next_inspection_date}
                        </p>
                    </div>

                    {/*Next Inspection*/}
                    <div
                        className="d-flex justify-content-start mt-2"
                        style={{ alignItems: "center" }}
                    >
                        <p className="ms-1 mb-0 text-body-secondary">
                            <i>{equipment.inspection_notes}</i>
                        </p>
                    </div>
                </div>
            </>
        </Card>
    );
};

export default RentableItemCard;
