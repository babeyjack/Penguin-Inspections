import Card from "../StandardComponents/Card";
import LogoImage from "../StandardComponents/LogoImage";

const RentPopup = () => {
  return (
    <div className="container d-flex justify-content-center vh-100 align-items-center">
      <Card classes=".mx-auto text-center w-50" header={<LogoImage />}>
        <>
          <div className="container align-items-center">
            <p className="text-center fs-3 fw-bold">
              Rent screen opened in a separate tab
            </p>
            <p className="text-center">
              To re-open the rent screen, refresh this tab </p>
          </div>
        </>
      </Card>
    </div>
  );
};

export default RentPopup;
