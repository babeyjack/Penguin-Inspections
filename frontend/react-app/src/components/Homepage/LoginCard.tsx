import Card from "../StandardComponents/Card";
import LogoImage from "../StandardComponents/LogoImage";
import Alert from "../StandardComponents/Alert";
import LoginForm from "./LoginForm";

interface Props {
  alertParam?: string;
  alertMessageCode?: string;
}

const FetchAlertDataStatus = (alertParam: string) => {
  switch (alertParam) {
    case "0": {
      // Success
      return "success";
    }
    case "1": {
      // Error
      return "danger";
    }
    default: {
      return "";
    }
  }
};

const FetchAlertDataMessage = (alertMessageCode: string) => {
  switch (alertMessageCode) {
    case "registerSuccess": {
      return "Account Created Successfully";
    }
    case "serverFail": {
      return "A server failure occurred";
    }
    case "usernameEmail": {
      return "Enter your username, not your Email Address";
    }
    case "googleFail": {
      return "Google Login Attempt Failed";
    }
    case "authError": {
      return "Authorisation Error";
    }
    case "logoutSuccess": {
      return "Logged out successfully";
    }
    default: {
      return "";
    }
  }
};

const LoginCard = ({
  alertParam = "",
  alertMessageCode = "serverFail",
}: Props) => {
  return (
    <div className="container d-flex justify-content-center vh-100 align-items-center">
      <Card classes=".mx-auto text-center w-50" header={<LogoImage />}>
        <>
          {FetchAlertDataStatus(alertParam) != "" && (
            <div className="d-block">
              <Alert
                colour={
                  FetchAlertDataStatus(alertParam) == "success"
                    ? "success"
                    : "danger"
                }
              >
                {FetchAlertDataMessage(alertMessageCode)}
              </Alert>
            </div>
          )}
          <LoginForm />
        </>
      </Card>
    </div>
  );
};

export default LoginCard;
