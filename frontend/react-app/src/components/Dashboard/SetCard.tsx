import Button from "../StandardComponents/Button";
import Card from "../StandardComponents/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCoins,
  faHashtag,
  faPencil,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import type { SetsItem } from "./Types/setsItem";

interface Props {
  set: SetsItem;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onInspect: (id: string) => void;
}

const SetCard = ({
  set,
  onEdit,
  onDelete,
  onInspect: onView,
}: Props) => {
  const GetStatusColours = () => {
    return ["#0088ff", "#004077ff"]
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
              onClick={() => onView(set.id)}
            >
              View
            </Button>
            <div className="d-flex gap-2">
              <Button
                colour="outline-secondary"
                onClick={() => onEdit(set.id)}
              >
                <FontAwesomeIcon icon={faPencil} />
              </Button>
              <Button
                colour="outline-secondary"
                onClick={() => onDelete(set.id)}
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
            {set.internal_id + ": " + set.desc}
          </h4>
        </div>
        {/*Body*/}
        <div className="pb-2">
          {/*Value*/}
          <div
            className="d-flex justify-content-start"
            style={{ alignItems: "center" }}
          >
            <FontAwesomeIcon icon={faCoins} />
            <p className="ms-1 mb-0">Value: £{set.equipment_value}</p>
          </div>
          {/*Count*/}
          <div
            className="d-flex justify-content-start"
            style={{ alignItems: "center" }}
          >
            <FontAwesomeIcon icon={faHashtag} />
            <p className="ms-1 mb-0">Count: {set.equipment_count}</p>
          </div>
        </div>
      </>
    </Card>
  );
};

export default SetCard;
