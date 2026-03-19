import { useState } from "react";
import GetFetchComamnd from "../middleware/GetFetchCommand";

const dataDefault = {
  id: "-1",
  recievedID: false,
  desc: "Default",
  count: 28,
  value: 18.03,
  equipment: [
    {
      external_id: "",
      id: "-1",
      name: "Null",
      manufacturer: "Null",
      serial: "Null",
    },
  ],
  sets: [
    {
      id: "-1",
      desc: "Default",
      count: 28,
      value: 18.03,
    },
  ],
};

interface Props {
  setId: { id: string };
  changeSelected: React.Dispatch<
    React.SetStateAction<{
      id: string;
      type: number;
    }>
  >;
}

const ViewSetModal = ({ setId, changeSelected }: Props) => {
  const [data, setData] = useState(dataDefault);

  const FetchData = (id: string) => {
    console.log("Fetch Set Data : " + id);

    const fetchCommand = GetFetchComamnd(
      "/equipment/set/" + id,
      "/equipment/set/" + id + "/${domain}"
    );

    fetch(fetchCommand, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.status == 200) {
          console.log(data.equipment);
          if (data.setValue != null) {
            setData({
              ...data.setValue,
              ["equipment"]: data.equipment,
              ["sets"]: data.sets,
              ["recievedID"]: true,
            });
          }
        } else {
          setData({ ...dataDefault, ["recievedID"]: true });
        }
      })
      .catch((e) => {
        console.error("/equipment/allUser : " + e);
        setData({ ...dataDefault, ["recievedID"]: true });
      });
  };

  const HandleChange = () => {
    changeSelected({ id: "1", type: 1 });
    throw new Error("Change Not Authorised");
  };

  if (data.id != setId.id) FetchData(setId.id);
  if (!data.recievedID) FetchData(setId.id);

  return (
    <>
      <div
        className="modal fade"
        id="viewSetModal"
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
              {/*Top Row*/}
              <div className="mb-3 row">
                {/*ID*/}
                <div className="col">
                  <label htmlFor="id" className="form-label">
                    ID
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="id"
                    name="id"
                    value={data.id}
                    onChange={HandleChange}
                    placeholder="ID"
                    required
                    disabled
                    readOnly
                  />
                </div>
                {/*Description*/}
                <div className="col">
                  <label htmlFor="desc" className="form-label">
                    Set Description
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="desc"
                    name="desc"
                    value={data.desc}
                    onChange={HandleChange}
                    placeholder="Desc"
                    required
                    disabled
                    readOnly
                  />
                </div>
              </div>

              {/*Second Row*/}
              <div className="mb-3 row">
                {/*Equipment Count*/}
                <div className="col">
                  <label htmlFor="count" className="form-label">
                    Equipment Count
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="count"
                    name="manufacturer"
                    value={data.count}
                    onChange={HandleChange}
                    placeholder="28"
                    required
                    disabled
                    readOnly
                  />
                </div>
                {/*Equipment Value*/}
                <div className="col">
                  <label htmlFor="value" className="form-label">
                    Equipment Value
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">£</span>
                    <input
                      type="number"
                      className="form-control"
                      id="value"
                      name="value"
                      value={data.value}
                      onChange={HandleChange}
                      placeholder="18.03"
                      required
                      disabled
                      readOnly
                    />
                  </div>
                </div>
              </div>

              {/*Third Row*/}
              <div className="mb-3 row">
                {/*Equipment*/}
                <div className="col">
                  <label htmlFor="equipment" className="form-label">
                    Equipment
                  </label>
                  <table id="equipment" className="table table-striped">
                    <thead>
                      <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Name</th>
                        <th scope="col">Brand</th>
                        <th scope="col">Serial</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.equipment.map((item) => (
                        <>
                          <tr>
                            <th scope="row">{item.id}</th>
                            <td>{item.name}</td>
                            <td>{item.manufacturer}</td>
                            <td>{item.serial}</td>
                          </tr>
                        </>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/*Fourth Row*/}
              <div className="mb-3 row">
                {/*Colour Input*/}
                <div className="col">
                  <label htmlFor="sets" className="form-label">
                    Sets
                  </label>
                  <table id="sets" className="table table-striped">
                    <thead>
                      <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Desc</th>
                        <th scope="col">Count</th>
                        <th scope="col">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.sets.map((item) => (
                        <>
                          <tr>
                            <th scope="row">{item.id}</th>
                            <th scope="row">{item.desc}</th>
                            <th scope="row">{item.count}</th>
                            <th scope="row">£{item.value}</th>
                          </tr>
                        </>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <div className="d-flex justify-content-between flex-row-reverse w-100">
                <div className="d-flex gap-1">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Close
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

export default ViewSetModal;
