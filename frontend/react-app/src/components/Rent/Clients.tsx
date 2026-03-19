import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Body from "../StandardComponents/Body";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import ClientCard from "./ClientCard";
import type { ClientsItem } from "./Types/clientsItem";
import GetFetchComamnd from "../middleware/GetFetchCommand";
import { Modal } from "bootstrap";
import AddClientModal from "./AddClientModal";
//import { Modal } from "bootstrap";

const Clients = () => {
  const [searchFilter, OnChangeSearchFilter] = useState("");
  const [statusFilter, OnChangeStatusFilter] = useState("-1");
  const [clients, OnChangeClients] = useState({
    items: [],
    recieved: false,
  });
  const [selected, OnChangeSelected] = useState({
    id: "-1",
    type: 0, // 0 is nothing, 1 is inspect, 2 is edit, 3 is delete
  });

  const FilterClients = (): ClientsItem[] => {
    const normalisedSearch = searchFilter.toLowerCase();

    if (normalisedSearch == "" && statusFilter.toLowerCase() == "-1") return clients.items;

    return clients.items.filter((item: ClientsItem) => {
      const matchesText =
        //item?.id?.toLowerCase().includes(normalisedSearch) ||
        item?.first_name?.toLowerCase().includes(normalisedSearch) ||
        item?.last_name?.toLowerCase().includes(normalisedSearch) ||
        item?.email?.toLowerCase().includes(normalisedSearch);
      //   item?.brand?.toLowerCase().includes(normalisedSearch) ||
      //   item?.colour?.toLowerCase().includes(normalisedSearch);

      const dropdown =
        statusFilter.toLowerCase() == "-1" ||
        item?.competency_level?.toString().toLowerCase() == statusFilter.toLowerCase();

      return matchesText && dropdown;
    });
  };

  const FetchClients = () => {
    console.log("Fetch Clients");

    const fetchCommand = GetFetchComamnd(
      "/rd/allClients",
      "/rd/allCompanyClients/${domain}"
    );

    fetch(fetchCommand, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.status == 200) {
          console.log("Value Recieved : " + data.value);
          if (data.value != null) {
            OnChangeClients({ ["items"]: data.value, recieved: true });
          }
        } else {
          console.error("Error Fetching Clients : " + data.message);
          OnChangeClients({ ["items"]: [], recieved: true });
        }
      })
      .catch((e) => {
        console.error("/rent/allClients : " + e);
        OnChangeClients({ ["items"]: [], recieved: true });
      });
  };

  const OnDelete = (id: string) => {
    OnChangeSelected({ ["id"]: id, type: 3 });
    console.log("Delete Client ID : " + id);

    const fetchCommand = GetFetchComamnd("/rd/deleteClient/" + id, "/rd/deleteClient/" + id + "/${domain}");

    fetch(fetchCommand, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status == 200) {
          //console.log("Value Recieved : " + data.value);
          OnChangeClients({ ...clients, ["recieved"]: false })
        }
      });
  };

  const OnView = (id: string) => {
    OnChangeSelected({ ["id"]: id, type: 1 });
    const modalElement = document.getElementById("viewClientModal");
    if (modalElement) {
      const modal = Modal.getOrCreateInstance(modalElement);
      modal.show();
    }
  };

  const OnEdit = (id: string) => {
    OnChangeSelected({ ["id"]: id, type: 2 });
    // const modalElement = document.getElementById("editModal");
    // if (modalElement) {
    //   const modal = Modal.getOrCreateInstance(modalElement);
    //   modal.show();
    // }
    console.log(selected);
  };

  const OpenAddModal = () => {
    const modalElement = document.getElementById("addClientModal");
    if (modalElement) {
      const modal = Modal.getOrCreateInstance(modalElement);
      modal.show();
    }
  };

  if (!clients.recieved) FetchClients();

  return (
    <>
      <AddClientModal externalClients={clients} OnChangeClients={OnChangeClients} />
      <Body>
        <div className="d-flex justify-content-between flex-wrap">
          <div>
            <h2>Clients</h2>
            <h3 style={{ color: "darkgrey" }}>
              <small>Manage and track clients and their competency levels</small>
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
                Add Client
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
              placeholder="Search Clients..."
              aria-label="Search"
              value={searchFilter}
              onChange={(event) => OnChangeSearchFilter(event.target.value)}
            />
            <select
              className="form-control me-2"
              style={{ flexBasis: "19%" }}
              aria-label="Status Filter"
              value={statusFilter}
              onChange={(event) => OnChangeStatusFilter(event.target.value)}
            >
              <option value={-1}>All Levels</option>
              <option value={5}>Multi-pitch Leader</option>
              <option value={4}>Trad Leader</option>
              <option value={3}>Sport Leader</option>
              <option value={2}>Lead Belay</option>
              <option value={1}>Top Rope</option>
              <option value={0}>Boulder</option>
            </select>
          </form>
        </div>
      </Body>
      <Body className="d-inline-flex justify-content-start flex-wrap align-content-start my-auto">
        <>
          {clients.items.length == 0 ? <h3>No Items Found</h3> : <></>}
          {FilterClients().map((item) => (
            <ClientCard
              client={item}
              onDelete={(id) => {
                console.log("OnDelete : " + id);
                OnDelete(id);
              }}
              onEdit={(id) => {
                console.log("OnEdit : " + id);
                OnEdit(id);
              }}
              onInspect={(id) => {
                console.log("OnInspect : " + id);
                OnView(id);
              }}
            />
          ))}
        </>
      </Body>
    </>
  );
};

export default Clients;
