import { Modal } from "bootstrap";
import { useState, useEffect } from "react";
import Button from "../StandardComponents/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import type { EquipmentType } from "./Types/equipmentType";
import GetFetchComamnd from "../middleware/GetFetchCommand";
import FetchHasLength from "../middleware/FetchHasLength";
import getDomain from "../middleware/GetDomain";
import GetDate from "../middleware/GetDate";

const defaultType: EquipmentType = {
  id: 0,
  name: "",
  display_name: "",
  has_length: 0,
};

const formDefault = {
  external_id: "",
  id: "",
  name: "",
  type: 1,
  recievedTypes: false,
  types: [defaultType],
  manufacturer: "",
  serial: "",
  price: 0.0,
  colour: "",
  firstUseDate: GetDate(),
  retirementDate: GetDate(),
  fabricLength: -1.0,
  fabricWidth: -1.0,
};

interface Props {
  externalEquip: {
    items: never[];
    recieved: boolean;
  };
  OnChangeEquipment: (
    value: React.SetStateAction<{
      items: never[];
      recieved: boolean;
    }>
  ) => void;
  itemData: { id: string; type: number };
}

const EditEquipmentModal = ({
  externalEquip,
  OnChangeEquipment,
  itemData,
}: Props) => {
  const [form, OnChangeForm] = useState(formDefault);

  const ResetForm = () => {
    OnChangeForm(formDefault);
  };

  const FetchEquipmentDetails = () => {
    if (itemData.id == "-1") {
      return;
    }

    const fetchCommand = GetFetchComamnd(
      "/equipment/item/" + itemData.id,
      "/equipment/item/" + itemData.id + "/${domain}"
    );

    fetch(fetchCommand, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status == 200) {
          OnChangeForm({
            ...form,
            external_id: data.value.equipment_id,
            id: itemData.id,
            name: data.value.name,
            type: data.value.type,
            manufacturer: data.value.brand,
            serial: data.value.serial,
            price: data.value.price,
            colour: data.value.colour,
            firstUseDate: data.value.date_first_used,
            retirementDate: data.value.retirement_date,
            fabricLength: data.value.fabric_length,
            fabricWidth: data.value.fabric_width,
          });
        } else if (data.status == 204) {
          console.log("/equipment/item/internal : " + data.message);
        } else {
          console.error("/equipment/item/internal : " + data.message);
        }
      })
      .catch((err) => {
        console.error("EquipmentDetailsError failed:", err);
      });
  };

  const FetchTypes = () => {
    let fetchCommand = "/equipment/userTypes";
    const domain = getDomain();
    if (domain != "") fetchCommand = "/equipment/companyTypes/" + domain;

    fetch(fetchCommand, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status == 200) {
          //console.log("Value Recieved : " + data.value);
          OnChangeForm({
            ...form,
            ["types"]: data.value,
            ["recievedTypes"]: true,
          });
        }
      });
  };

  const HandleFormSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault(); // Stops submit trying to redirect
    console.log("Form Submitted");

    let fetchCommand = "/equipment/userEdit";
    const domain = getDomain();
    if (domain != "") fetchCommand = "/equipment/companyEdit/" + domain;
    // const fetchCommand = GetFetchComamnd("/equipment/userEdit", "/equipment/companyEdit/${doamin}");

    fetch(fetchCommand, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        external_id: form.external_id,
        id: form.id,
        name: form.name,
        type: form.type,
        manufacturer: form.manufacturer,
        serial: form.serial,
        price: form.price,
        colour: form.colour,
        firstUseDate: form.firstUseDate,
        retirementDate: form.retirementDate,
        fabricLength: form.fabricLength,
        fabricWidth: form.fabricWidth,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status == 200) {
          OnChangeForm(formDefault);
          console.log("Item Edited Success");
          if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
          }
          const element = document.getElementById("editModal");
          if (element) {
            const modal = Modal.getOrCreateInstance(element);
            if (modal) {
              modal.hide();
            }
          }
          document.body.classList.remove("modal-open");
          document.body.style.overflow = "";
          document.querySelector(".modal-backdrop")?.remove();
          OnChangeEquipment({ ...externalEquip, recieved: false });
        } else {
          console.error("Edit Item : " + data.message);
        }
      });
  };

  const HandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(form.firstUseDate);
    OnChangeForm({ ...form, [name]: value });
  };

  const HandleChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    OnChangeForm({ ...form, [name]: value });
  };

  // Fetch equipment details when itemData changes
  useEffect(() => {
    if (form.id != itemData.id && itemData.id != "-1") {
      FetchEquipmentDetails();
    }
  }, [itemData.id]);

  // Fetch equipment types when component mounts
  useEffect(() => {
    if (!form.recievedTypes) {
      FetchTypes();
    }
  }, []);

  // Handle date format changes
  useEffect(() => {
    if (form.retirementDate?.includes("T")) {
      OnChangeForm({
        ...form,
        retirementDate: form.retirementDate.split("T")[0],
      });
    }
    if (form.firstUseDate?.includes("T")) {
      OnChangeForm({
        ...form,
        firstUseDate: form.firstUseDate.split("T")[0],
      });
    }
  }, [form.retirementDate, form.firstUseDate]);

  return (
    <>
      <div
        className="modal fade"
        id="editModal"
        tabIndex={-1}
        aria-hidden={"true"}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                Edit - {form.id + " - " + form.name}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form id="editEquipForm" onSubmit={HandleFormSubmit}>
                {/*Top Row*/}
                <div className="mb-3 row">
                  {/*ID Input*/}
                  <div className="col">
                    <label htmlFor="inputId" className="form-label">
                      ID
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="inputId"
                      name="id"
                      value={form.id}
                      onChange={HandleChange}
                      placeholder="ID"
                      required
                    />
                  </div>
                  {/*Name Input*/}
                  <div className="col">
                    <label htmlFor="inputName" className="form-label">
                      Equipment Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="inputName"
                      name="name"
                      value={form.name}
                      onChange={HandleChange}
                      placeholder="Name"
                      required
                    />
                  </div>
                </div>

                {/*Second Row*/}
                <div className="mb-3 row">
                  {/*Type Input*/}
                  <div className="col">
                    <label htmlFor="inputType" className="form-label">
                      Type
                    </label>
                    <select
                      className="form-control"
                      id="inputType"
                      name="type"
                      value={form.type}
                      onChange={HandleChangeSelect}
                      required
                    >
                      {form.types.map((item) => (
                        <option value={item.id}>{item.display_name}</option>
                      ))}
                    </select>
                  </div>
                  {/*Manufacturer Input*/}
                  <div className="col">
                    <label htmlFor="inputManufacturer" className="form-label">
                      Manufacturer Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="inputManufacturer"
                      name="manufacturer"
                      value={form.manufacturer}
                      onChange={HandleChange}
                      placeholder="Manufacturer"
                      required
                    />
                  </div>
                </div>

                {/*Third Row*/}
                <div className="mb-3 row">
                  {/*Serial Input*/}
                  <div className="col">
                    <label htmlFor="inputSerial" className="form-label">
                      Serial
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="inputSerial"
                      name="serial"
                      value={form.serial}
                      onChange={HandleChange}
                      placeholder="Serial"
                      required
                    />
                  </div>
                  {/*Price Input*/}
                  <div className="col">
                    <label htmlFor="inputPrice" className="form-label">
                      Price
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">£</span>
                      <input
                        type="number"
                        className="form-control"
                        id="inputPrice"
                        name="price"
                        value={form.price}
                        onChange={HandleChange}
                        placeholder="18.03"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/*Fourth Row*/}
                <div className="mb-3 row">
                  {/*Colour Input*/}
                  <div className="col">
                    <label htmlFor="inputColour" className="form-label">
                      Colour
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="inputColour"
                      name="colour"
                      value={form.colour}
                      onChange={HandleChange}
                      placeholder="Colour"
                      required
                    />
                  </div>
                  {/*Purchase Date Input*/}
                  <div className="col">
                    <label htmlFor="inputFirstUseDate" className="form-label">
                      First-use Date
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="inputFirstUseDate"
                      name="firstUseDate"
                      value={form.firstUseDate}
                      onChange={HandleChange}
                      required
                    />
                  </div>
                </div>

                {/*Fith Row*/}
                <div className="mb-3 row">
                  {" "}
                  {/*Retirement Date Input*/}
                  <div className="col">
                    <label htmlFor="inputRetirementDate" className="form-label">
                      Retirement Date
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="inputRetirementDate"
                      name="retirementDate"
                      value={form.retirementDate}
                      onChange={HandleChange}
                      required
                    />
                  </div>
                  {/*Fabric Length Date Input*/}
                  <div className="col">
                    {FetchHasLength(form) && (
                      <>
                        <label
                          htmlFor="inputFabricWidth"
                          className="form-label"
                        >
                          Fabric Width
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          id="inputFabricWidth"
                          name="fabricWidth"
                          value={form.fabricWidth}
                          onChange={HandleChange}
                          required
                        />
                      </>
                    )}
                  </div>
                </div>
                {/*Sixth Row*/}
                <div className="mb-3 row">
                  {/*Fabric Length Input*/}
                  <div className="col">
                    {FetchHasLength(form) && (
                      <>
                        <label
                          htmlFor="inputFabricLength"
                          className="form-label"
                        >
                          Fabric Length
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          id="inputFabricLength"
                          name="fabricLength"
                          value={form.fabricLength}
                          onChange={HandleChange}
                          required
                        />
                      </>
                    )}
                  </div>
                  {/*Empty Input*/}
                  <div className="col"></div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <div className="d-flex justify-content-between w-100">
                <Button onClick={() => ResetForm()} colour="outline-secondary">
                  <FontAwesomeIcon icon={faRefresh} />
                </Button>
                <div className="d-flex gap-1">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    form="editEquipForm"
                    className="btn btn-primary"
                  >
                    Save changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditEquipmentModal;
