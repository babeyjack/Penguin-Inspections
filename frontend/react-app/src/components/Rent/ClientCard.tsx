import Button from "../StandardComponents/Button";
import Card from "../StandardComponents/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faUser,
  faLayerGroup,
  faHashtag,
  faPencil,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import type { ClientsItem } from "./Types/clientsItem";

interface Props {
  client: ClientsItem;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onInspect: (id: string) => void;
}

const getLevelName = (level: number): string => {
  switch (level) {
    case 5:
      return "Multi-pitch";
    case 4:
      return "Trad Lead";
    case 3:
      return "Sport Lead";
    case 2:
      return "Lead Belay";
    case 1:
      return "Top Rope"
    default:
      return "Boulder";
  }
}

const ClientCard = ({
  client,
  onEdit,
  onDelete,
  onInspect: onView,
}: Props) => {
  console.log("ClientCard client:", client);
  const GetStatusColours = () => {
    //return["#0088ff", "#004077ff"]

    switch (client.competency_level) {
      case 5: {
        return ["#22c55e", "#0a5e29"]; // Multi-pitch
      }
      case 4: {
        return ["#eab308", "#705c04"]; // Trad Lead
      }
      case 3: {
        return ["#f97316", "#7c3a0b"]; // Sport Lead 
      }
      case 2: {
        return ["#f97316", "#7c3a0b"]; // Lead Belay
      }
      default: {
        return ["#ef4444", "#591919"]; // Boulder / Top Rope
      }
    }
  };

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
            <Button
              colour="outline-secondary"
              onClick={() => onView(client.user_id)}
            >
              View
            </Button>
            <div className="d-flex gap-2">
              <Button
                colour="outline-secondary"
                onClick={() => onEdit(client.user_id)}
              >
                <FontAwesomeIcon icon={faPencil} />
              </Button>
              <Button
                colour="outline-secondary"
                onClick={() => onDelete(client.user_id)}
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
            {client.internal_id + ": " + client.first_name + " " + client.last_name}
          </h4>
        </div>
        {/*Body*/}
        <div className="pb-2">
          {/*Email*/}
          <div
            className="d-flex justify-content-start"
            style={{ alignItems: "center" }}
          >
            <FontAwesomeIcon icon={faEnvelope} />
            <p className="ms-1 mb-0">Email: {client.email}</p>
          </div>
          {/*Count*/}
          <div
            className="d-flex justify-content-start"
            style={{ alignItems: "center" }}
          >
            <FontAwesomeIcon icon={faHashtag} />
            <p className="ms-1 mb-0">Count: {client.rent_count}</p>
          </div>
          {/*Level*/}
          <div
            className="d-flex justify-content-start"
            style={{ alignItems: "center" }}
          >
            <FontAwesomeIcon icon={faLayerGroup} />
            <p className="ms-1 mb-0">Level: {getLevelName(client.competency_level)}</p>
          </div>
          {/*Signed off by*/}
          <div
            className="d-flex justify-content-start"
            style={{ alignItems: "center" }}
          >
            <FontAwesomeIcon icon={faUser} />
            <p className="ms-1 mb-0">Signed off by: {client.competency_check_by}</p>
          </div>
        </div>
      </>
    </Card>
  );
};

export default ClientCard;
