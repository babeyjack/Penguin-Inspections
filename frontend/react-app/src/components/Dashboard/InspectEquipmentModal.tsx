import { Modal } from "bootstrap";
import { useState, useEffect } from "react";
import Button from "../StandardComponents/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faRefresh,
  faExclamation,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import getDomain from "../middleware/GetDomain";

const GetDate = () => {
  const date = new Date();
  return date.toISOString().split("T")[0];
};

const formDefault = {
  date: GetDate(),
  inspector: "Babey_Jack",
  criteria: [["Equipment State", 0]],
  notes: "",
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

const InspectEquipmentModal = ({
  externalEquip,
  OnChangeEquipment,
  itemData,
}: Props) => {
  const [form, OnChangeForm] = useState(formDefault);
  const [equipData, OnChangeEquipData] = useState({
    id: "",
    name: "",
    manufacturer: "",
    previous_notes: "",
    recieved: false,
  });

  const ResetForm = () => {
    console.log(itemData.id);
    OnChangeForm(formDefault);
  };

  const FetchEquipmentDetails = () => {
    let fetchCommand = "/equipment/item/" + itemData.id;
    const domain = getDomain();
    if (domain != "") fetchCommand = "/equipment/item/" + itemData.id + "/" + domain;


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
          //console.log("Type Found:", match.display_name);
          console.log("Type Found:", data.value);
          OnChangeEquipData({
            id: itemData.id,
            name: data.value.name,
            manufacturer: data.value.brand,
            previous_notes: data.value.details,
            recieved: true,
          });
        } else if (data.status == 204) {
          console.log("/equipment/item/internal : " + data.message);
        } else {
          console.error("/equipment/item/internal : " + data.message);
        }
      })
      .catch((err) => {
        console.error("FetchEquipmentDetails failed:", err);
      });
  };

  const HandleFormSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault(); // Stops submit trying to redirect
    console.log("Form Submitted");

    let fetchCommand = "/equipment/userInspection";
    const domain = getDomain();
    if (domain != "") fetchCommand = "/equipment/companyInspection/" + domain;


    fetch(fetchCommand, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ id: itemData.id, form: form }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status == 200) {
          OnChangeForm(formDefault);
          console.log("Item inspection Success");
          if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
          }
          const element = document.getElementById("inspectModal");
          if (element) {
            const modal = Modal.getOrCreateInstance(element);
            if (modal) {
              modal.hide();
            }
          }
          OnChangeEquipment({ ...externalEquip, recieved: false });
          OnChangeEquipData({
            id: "",
            name: "",
            manufacturer: "",
            previous_notes: "",
            recieved: false,
          });
        } else {
          console.error("Inspect Item : " + data.message);
        }
      });
  };

  const HandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    OnChangeForm({ ...form, [name]: value });
  };

  const HandleChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newCriteria = form.criteria;
    for (let i = 0; i < newCriteria.length; i++) {
      if (newCriteria[i][0] == name) {
        newCriteria[i][1] = value;
        break;
      }
    }
    OnChangeForm({ ...form, criteria: newCriteria });
  };

  // Fetch equipment details when itemData changes
  useEffect(() => {
    if (itemData.id != "-1" && (!equipData.recieved || equipData.id != itemData.id)) {
      FetchEquipmentDetails();
    }
  }, [itemData.id]);

  return (
    <>
      <div
        className="modal fade"
        id="inspectModal"
        tabIndex={-1}
        aria-hidden={"true"}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                Inspect Equipment -{" "}
                {itemData.id +
                  ": " +
                  equipData.manufacturer +
                  " " +
                  equipData.name}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form id="inspectEquipForm" onSubmit={HandleFormSubmit}>
                {/*Top Row*/}
                <div className="mb-3 row">
                  {/*ID Input*/}
                  <div className="col">
                    <label htmlFor="inputDate" className="form-label">
                      ID
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="inputDate"
                      name="date"
                      value={form.date}
                      onChange={HandleChange}
                      required
                    />
                  </div>
                  {/*Name Input*/}
                  <div className="col">
                    <label htmlFor="inputInspector" className="form-label">
                      Inspector
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="inputInspector"
                      name="inspector"
                      value={form.inspector}
                      onChange={HandleChange}
                      placeholder="Inspector's Name"
                      required
                    />
                  </div>
                </div>

                {/*Second Row*/}
                <div className="mb-3 row">
                  <div className="container-flex border-1">
                    {form.criteria.map((item, index) => (
                      <div className="d-flex justify-content-between mb-2">
                        <p className="m-auto" style={{ flexBasis: "69%" }}>
                          {item[0]}
                        </p>
                        <select
                          className="form-select ps-2"
                          style={{ flexBasis: "30%" }}
                          value={form.criteria[index][1]}
                          name={item[0].toString()}
                          onChange={HandleChangeSelect}
                        >
                          <option value={0}>
                            <>
                              <FontAwesomeIcon
                                icon={faCheck}
                                className="pe-1"
                              />{" "}
                              Pass
                            </>
                          </option>
                          <option value={1}>
                            <>
                              <FontAwesomeIcon
                                icon={faExclamation}
                                className="pe-1"
                              />{" "}
                              Under Watch
                            </>
                          </option>
                          <option value={2}>
                            <>
                              <FontAwesomeIcon
                                icon={faXmark}
                                className="pe-1"
                              />{" "}
                              Fail
                            </>
                          </option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
                <label htmlFor="inputNotes" className="form-label">
                  Notes
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="inputNotes"
                  name="notes"
                  value={form.notes}
                  onChange={HandleChange}
                  placeholder="Detailed notes about the inspection"
                />

                {/*Third Row*/}
                <div className="mb-3 row"></div>
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
                    form="inspectEquipForm"
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

export default InspectEquipmentModal;
