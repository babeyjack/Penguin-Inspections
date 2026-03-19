import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Body from "../StandardComponents/Body";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import SetCard from "./SetCard";
import type { SetsItem } from "./Types/setsItem";
import GetFetchComamnd from "../middleware/GetFetchCommand";
import { Modal } from "bootstrap";
import ViewSetModal from "./ViewSetModal";
import AddSetModal from "./AddSetModal";
//import { Modal } from "bootstrap";

const Sets = () => {
  const [searchFilter, OnChangeSearchFilter] = useState("");
  const [statusFilter, OnChangeStatusFilter] = useState("-1");
  const [sets, OnChangeSets] = useState({
    items: [],
    recieved: false,
  });
  const [selected, OnChangeSelected] = useState({
    id: "-1",
    type: 0, // 0 is nothing, 1 is inspect, 2 is edit, 3 is delete
  });

  const FilterSets = (): SetsItem[] => {
    const normalisedSearch = searchFilter.toLowerCase();

    if (normalisedSearch == "") return sets.items;

    return sets.items.filter((item: SetsItem) => {
      const matchesText =
        //item?.id?.toLowerCase().includes(normalisedSearch) ||
        item?.desc?.toLowerCase().includes(normalisedSearch);
      //   item?.serial?.toLowerCase().includes(normalisedSearch) ||
      //   item?.brand?.toLowerCase().includes(normalisedSearch) ||
      //   item?.colour?.toLowerCase().includes(normalisedSearch);

      // co =
      //   statusFilter.toLowerCase() == "-1" ||
      //   item?.status?.toString().toLowerCase() == statusFilter.toLowerCase();

      return matchesText;
    });
  };

  const FetchSets = () => {
    console.log("Fetch Sets");

    const fetchCommand = GetFetchComamnd(
      "/equipment/allSets",
      "/equipment/allCompanySets/${domain}"
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
            OnChangeSets({ ["items"]: data.value, recieved: true });
          }
        } else {
          OnChangeSets({ ["items"]: [], recieved: true });
        }
      })
      .catch((e) => {
        console.error("/equipment/allUser : " + e);
        OnChangeSets({ ["items"]: [], recieved: true });
      });
  };

  const OnDelete = (id: string) => {
    OnChangeSelected({ ["id"]: id, type: 3 });

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

  const OnView = (id: string) => {
    OnChangeSelected({ ["id"]: id, type: 1 });
    const modalElement = document.getElementById("viewSetModal");
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
    const modalElement = document.getElementById("addEquipModal");
    if (modalElement) {
      const modal = Modal.getOrCreateInstance(modalElement);
      modal.show();
    }
  };

  if (!sets.recieved) FetchSets();

  return (
    <>
      <AddSetModal externalSet={sets} OnChangeSet={OnChangeSets} />
      <ViewSetModal
        setId={selected}
        changeSelected={OnChangeSelected}
      ></ViewSetModal>
      <Body>
        <div className="d-flex justify-content-between flex-wrap">
          <div>
            <h2>Sets</h2>
            <h3 style={{ color: "darkgrey" }}>
              <small>Manage and track sets of equipment items</small>
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
                Add Set
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
              placeholder="Search Sets..."
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
          {sets.items.length == 0 ? <h3>No Items Found</h3> : <></>}
          {FilterSets().map((item) => (
            <SetCard
              set={item}
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

export default Sets;
