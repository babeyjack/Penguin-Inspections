import { Modal } from "bootstrap";
import { useState } from "react";
import Button from "../StandardComponents/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import getDomain from "../middleware/GetDomain";

const formDefault = {
  id: "",
  recievedID: false,
};

interface Props {
  externalSet: {
    items: never[];
    recieved: boolean;
  };
  OnChangeSet: (
    value: React.SetStateAction<{
      items: never[];
      recieved: boolean;
    }>
  ) => void;
}

const AddSetModal = ({
  externalSet: externalSet,
  OnChangeSet: OnChangeSet,
}: Props) => {
  const [form, setForm] = useState(formDefault);

  const ResetForm = () => {
    setForm(formDefault);
  };

  const FetchNextID = () => {
    let fetchCommand = "/equipment/nextUserID";
    const domain = getDomain();
    if (domain != "") fetchCommand = "/equipment/nextCompanyID/" + domain;
    fetch(fetchCommand, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status == 200) {
          //console.log("Value Recieved : " + data.value);
          setForm({ ...form, ["id"]: data.value, ["recievedID"]: true });
        }
      });
  };

  const HandleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Stops submit trying to redirect
    console.log("Form Submitted");

    let fetchCommand = "/equipment/userAdd";
    const domain = getDomain();
    if (domain != "") fetchCommand = "/equipment/companyAdd/" + domain;

    fetch(fetchCommand, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        id: form.id,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text(); // Get raw text first
      })
      .then((text) => {
        console.log("Raw response:", text); // Log the raw text
        return JSON.parse(text); // Now parse if it's valid JSON
      })
      .then((data) => {
        if (data.status == 200) {
          setForm(formDefault);
          console.log("Item added Success");
          if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
          }
          const element = document.getElementById("addEquipModal");
          if (element) {
            const modal = Modal.getOrCreateInstance(element);
            if (modal) {
              modal.hide();
            }
          }
          document.body.classList.remove("modal-open");
          document.body.style.overflow = "";
          document.querySelector(".modal-backdrop")?.remove();
          OnChangeSet({ ...externalSet, recieved: false });
        } else {
          console.error("Add Item : " + data.message);
        }
      });
  };

  const HandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  if (!form.recievedID) FetchNextID();

  return (
    <>
      <div
        className="modal fade"
        id="addEquipModal"
        tabIndex={-1}
        aria-hidden={"true"}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add New Equipment</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form id="addequipform" onSubmit={HandleFormSubmit}>
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
                  <div className="col"></div>
                </div>

                {/*Second Row*/}
                <div className="mb-3 row">
                  {/*Type Input*/}
                  <div className="col"></div>
                  {/*Manufacturer Input*/}
                  <div className="col"></div>
                </div>

                {/*Third Row*/}
                <div className="mb-3 row">
                  {/*Serial Input*/}
                  <div className="col"></div>
                  {/*Price Input*/}
                  <div className="col"></div>
                </div>

                {/*Fourth Row*/}
                <div className="mb-3 row">
                  {/*Colour Input*/}
                  <div className="col"></div>
                  {/*Purchase Date Input*/}
                  <div className="col"></div>
                </div>

                {/*Fith Row*/}
                <div className="mb-3 row">
                  {" "}
                  {/*Retirement Date Input*/}
                  <div className="col"></div>
                  {/*Fabric Length Date Input*/}
                  <div className="col"></div>
                </div>
                {/*Sixth Row*/}
                <div className="mb-3 row">
                  {/*Fabric Length Input*/}
                  <div className="col"></div>
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
                    form="addequipform"
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

export default AddSetModal;
