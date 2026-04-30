import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Body from "../StandardComponents/Body";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import AddRentableItemModal from "./AddRentableItemModal";
import { useState } from "react";
import { Modal } from "bootstrap";
import GetFetchComamnd from "../middleware/GetFetchCommand";
import type { EquipmentItem } from "../Dashboard/Types/equipmentItem";
import type { EquipmentType } from "../Dashboard/Types/equipmentType";
import RentableItemCard from "./RentableItemCard";

const defaultType: EquipmentType = {
    id: 0,
    name: "",
    display_name: "",
    has_length: 0,
};

const RentableItems = () => {
    const [searchFilter, OnChangeSearchFilter] = useState("");
    const [types, OnChangeTypes] = useState({
        types: [defaultType],
        recieved: false,
    });
    const [typeFilter, OnChangeTypeFilter] = useState("-1");
    const [statusFilter, OnChangeStatusFilter] = useState("-1");
    const [equipment, OnChangeEquipment] = useState({
        items: [],
        recieved: false,
    });

    const FetchTypes = () => {
        fetch("/equipment/userTypes", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.status == 200) {
                    //console.log("Value Recieved : " + data.value);
                    OnChangeTypes({
                        ...types,
                        ["types"]: data.value,
                        ["recieved"]: true,
                    });
                }
            });
    };

    const FetchTypeName = (type_id: number) => {
        let value = "";
        const match = types.types.find(
            (item: EquipmentType) => item.id === type_id
        );

        if (match) {
            //console.log("Type Found:", match.display_name);
            value = match.display_name;
        } else {
            console.warn("No matching type found for ID:", type_id);
        }
        return value;
    };

    const FilterEquipment = (): EquipmentItem[] => {
        const normalisedSearch = searchFilter.toLowerCase();

        if (
            normalisedSearch == "" &&
            typeFilter.toLowerCase() != "-1" &&
            statusFilter.toLowerCase() != "-1"
        )
            return equipment.items;

        return equipment.items.filter((item: EquipmentItem) => {
            const matchesText =
                (item?.id &&
                    typeof item.id == "string" &&
                    item.id.toLowerCase().includes(normalisedSearch)) ||
                (item?.id &&
                    typeof item.id != "string" &&
                    String(item.id).toLowerCase().includes(normalisedSearch)) ||
                item?.name?.toLowerCase().includes(normalisedSearch) ||
                item?.serial?.toLowerCase().includes(normalisedSearch) ||
                FetchTypeName(item.type_number)
                    ?.toLowerCase()
                    .includes(normalisedSearch) ||
                item?.brand?.toLowerCase().includes(normalisedSearch) ||
                item?.colour?.toLowerCase().includes(normalisedSearch);

            const matchesType =
                typeFilter.toLowerCase() == "-1" ||
                item?.type_number?.toString().toLowerCase() == typeFilter.toLowerCase();

            const matchesStatus =
                statusFilter.toLowerCase() == "-1" ||
                item?.status?.toString().toLowerCase() == statusFilter.toLowerCase();

            return matchesText && matchesType && matchesStatus;
        });
    };

    const FetchEquipment = () => {
        console.log("Fetch All Equipment");

        const fetchCommand = GetFetchComamnd(
            "/equipment/allUser",
            "/rd/allCompanyEquipment/rentable/${domain}"
        );

        fetch(fetchCommand, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        })
            .then((r) => r.json())
            .then((data) => {
                if (data.status == 200) {
                    if (data.value != null) {
                        OnChangeEquipment({ ["items"]: data.value, recieved: true });
                    }
                } else {
                    OnChangeEquipment({ ["items"]: [], recieved: true });
                }
            })
            .catch((e) => {
                console.error("/equipment/allUser : " + e);
                OnChangeEquipment({ ["items"]: [], recieved: true });
            });
    };

    const OpenAddModal = () => {
        const modalElement = document.getElementById("addEquipModal");
        if (modalElement) {
            const modal = Modal.getOrCreateInstance(modalElement);
            modal.show();
        }
    };

    const OnDelete = (id: string) => {
        console.log("Delete Equipment ID : " + id);

        // const fetchCommand = GetFetchComamnd("/equipment/userDelete/" + id, "/equipment/companyDelete/" + id + "/${domain}");

        // fetch(fetchCommand, {
        //   method: "DELETE",
        //   headers: { "Content-Type": "application/json" },
        //   credentials: "include",
        // })
        //   .then((res) => res.json())
        //   .then((data) => {
        //     if (data.status == 200) {
        //       //console.log("Value Recieved : " + data.value);
        //       OnChangeEquipment({...equipment, ["recieved"]: false})
        //     }
        //   });
    };

    if (!equipment.recieved) FetchEquipment();
    if (!types.recieved) FetchTypes();

    return (
        <>
            <AddRentableItemModal
                externalEquip={equipment}
                OnChangeEquipment={OnChangeEquipment}
            />
            <Body>
                <div className="d-flex justify-content-between flex-wrap">
                    <div>
                        <h2>Rentable Equipment</h2>
                        <h3 style={{ color: "darkgrey" }}>
                            <small>Manage and track your rentable equipment</small>
                        </h3>
                    </div>
                    <div>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={OpenAddModal}
                        >
                            <>
                                <FontAwesomeIcon icon={faPlus} className="pe-1" />
                                Add Rentable Equipment
                            </>
                        </button>
                    </div>
                </div>
                <div className="container-fluid mt-2">
                    <form className="d-flex justify-content-start" role="search">
                        <input
                            className="form-control me-2 flex-fill flex-grow-1"
                            style={{ flexBasis: "60%" }}
                            type="search"
                            placeholder="Search Equipment..."
                            aria-label="Search"
                            value={searchFilter}
                            onChange={(event) => OnChangeSearchFilter(event.target.value)}
                        />
                        <select
                            className="form-control me-2"
                            style={{ flexBasis: "19%" }}
                            aria-label="Type Filter"
                            value={typeFilter}
                            onChange={(event) => OnChangeTypeFilter(event.target.value)}
                        >
                            <option value={-1}>All types</option>
                            {types.types.map((item) => (
                                <option value={item.id}>{item.display_name}</option>
                            ))}
                        </select>
                        <select
                            className="form-control me-2"
                            style={{ flexBasis: "19%" }}
                            aria-label="Status Filter"
                            value={statusFilter}
                            onChange={(event) => OnChangeStatusFilter(event.target.value)}
                        >
                            <option value={-1}>All Status</option>
                            <option value={0}>Good Condition</option>
                            <option value={1}>Inspect Soon</option>
                            <option value={2}>Inspection Due</option>
                            <option value={3}>Retired</option>
                        </select>
                    </form>
                </div>
            </Body>
            <Body className="d-inline-flex justify-content-start flex-wrap align-content-start my-auto">
                <>
                    {equipment.items.length == 0 ? <h3>No Items Found</h3> : <></>}
                    {FilterEquipment().map((item) => (
                        <RentableItemCard
                            equipment={item}
                            onDelete={(id) => {
                                console.log("OnDelete : " + id);
                                OnDelete(id);
                            }}
                            types={types}
                        />
                    ))}
                </>
            </Body>
        </>
    );
};

export default RentableItems;
