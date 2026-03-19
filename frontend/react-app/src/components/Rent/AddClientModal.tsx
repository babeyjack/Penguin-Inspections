import Alert from "../StandardComponents/Alert";
import { useState } from "react";
import Button from "../StandardComponents/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import GetFetchCommand from "../middleware/GetFetchCommand";
import { Modal } from "bootstrap";

const emailFormDefault = {
  email: "",
};

const clientFromDefault = {
  id: "", //users.id
  client_id: "", //company_clients.internal_id
  first_name: "",
  last_name: "",
  competency_level: 0,
}

const formStageDefault = {
  stage: 0,
}

interface Props {
  externalClients: {
    items: never[];
    recieved: boolean;
  };
  OnChangeClients: (
    value: React.SetStateAction<{
      items: never[];
      recieved: boolean;
    }>
  ) => void;
}

const AddClientModal = ({ externalClients, OnChangeClients }: Props) => {
  const [emailForm, setEmailForm] = useState(emailFormDefault);
  const [clientForm, setClientForm] = useState(clientFromDefault);
  const [formStage, setFormStage] = useState(formStageDefault);

  const ResetForm = () => {
    setEmailForm(emailFormDefault);
    setClientForm(clientFromDefault);
    setFormStage(formStageDefault);
  };

  const HandleEmailFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Stops submit trying to redirect
    console.log("Email Form Submitted");

    const fetchCommand = "/rd/userFromEmail/" + emailForm.email;
  
    fetch(fetchCommand, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
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
          if(data.value != 1){
            console.log("Email Not Found, Proceed to Add Client Details");
            setFormStage({stage: 1});
          } else {
            console.log("Email Found in System, Proceed to Add Client");
            setClientForm({
              ...clientForm,
              ["id"]: data.id,
              ["first_name"]: data.first_name,
              ["last_name"]: data.last_name,
            });
            setFormStage({stage: 2});
          }
        } else {
          console.error("Add Item : " + data.message);
        }
      });
  };

  const HandleClientFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Client Form Submitted");

    const fetchCommand = GetFetchCommand(
      "/rd/addClient",
      "/rd/addClient/${domain}"
    );

    const requestBody = {
      user_id: clientForm.id,
      internal_id: clientForm.client_id,
      competency_level: clientForm.competency_level,
    };

    console.log("Fetch Command:", fetchCommand);
    console.log("Request Body:", requestBody);

    fetch(fetchCommand, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(requestBody),
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
          console.log("Client Added Successfully");
          ResetForm();
          if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
          }
          const element = document.getElementById("addClientModal");
          if (element) {
            const modal = Modal.getOrCreateInstance(element);
            if (modal) {
              modal.hide();
            }
          }
          document.body.classList.remove("modal-open");
          document.body.style.overflow = "";
          document.querySelector(".modal-backdrop")?.remove();
          OnChangeClients({ ...externalClients, recieved: false });
        } else {
          console.error("Error Adding Client : " + data.message);
        }
      })
      .catch((e) => {
        console.error("/rd/addClient : " + e);
      });
  };

  const HandleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmailForm({ ...emailForm, [name]: value });
  };

  const HandleClientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setClientForm({ ...clientForm, [name]: value });
  };

  const HandleClientChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setClientForm({ ...clientForm, [name]: value });
  };

  

  return (
    <>
      <div
        className="modal fade"
        id="addClientModal"
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
              {formStage.stage != 2 && <form id="emailForm" onSubmit={HandleEmailFormSubmit}>
                {/*Top Row*/}
                <div className="mb-3 row">
                    <label htmlFor="inputEmail" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="inputEmail"
                      name="email"
                      value={emailForm.email}
                      onChange={HandleEmailChange}
                      placeholder="Email"
                      required
                    />
                </div>
              </form> }
              {formStage.stage == 1 && <Alert colour="danger">Email Not Found</Alert>}
              {formStage.stage == 2 && <form id="clientAddForm" onSubmit={HandleClientFormSubmit}>
                {/*Client Details Form Elements*/}
                <div className="mb-3 row">
                  <div className="col">
                    <label htmlFor="inputFirstName" className="form-label">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="inputFirstName"
                      name="first_name"
                      value={clientForm.first_name}
                      disabled
                      readOnly
                    />
                  </div>
                  <div className="col">
                    <label htmlFor="inputLastName" className="form-label">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="inputLastName"
                      name="last_name"
                      value={clientForm.last_name}
                      disabled
                      readOnly
                    />
                  </div>
                </div>
                <div className="mb-3 row">
                    <label htmlFor="inputClientID" className="form-label">
                      Client ID
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="inputClientID"
                      name="client_id"
                      value={clientForm.client_id}
                      onChange={HandleClientChange}
                      placeholder="Client ID"
                      required
                    />
                  </div>
                <div className="mb-3 row">
                    <label htmlFor="inputFirstName" className="form-label">
                      Competency Level
                    </label>
                    <select
                      className="form-control"
                      id="competencyLevelSelect"
                      name="competency_level"
                      value={clientForm.competency_level}
                      onChange={HandleClientChangeSelect}
                      required
                    >
                      <option value={0}>Level 1 - Boulder</option>
                      <option value={1}>Level 2 - Top Rope</option>
                      <option value={2}>Level 3 - Lead Belay</option>
                      <option value={3}>Level 4 - Sport Leader</option>
                      <option value={4}>Level 5 - Trad Leader</option>
                      <option value={5}>Level 6 - Multi-pitch Leader</option>
                    </select>
                </div>
              </form>}
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
                  {formStage.stage != 2 && <button
                    type="submit"
                    form="emailForm"
                    className="btn btn-primary"
                  >
                    Check Email
                  </button>}
                  {formStage.stage == 2 && <button
                    type="submit"
                    form="clientAddForm"
                    className="btn btn-primary"
                  >
                    Add Client
                  </button>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddClientModal;
