import { useState } from "react";
import GoogleButton from "react-google-button";
import Alert from "../StandardComponents/Alert";

const RegisterForm = () => {
  // Form Information
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    passwordConf: "",
    tos: 0,
  });
  const [errors, setErrors] = useState({ password: "", passwordConf: "" });

  // Handlers
  const HandlePasswordCheck = () => {
    let isValid = true;

    if (form.password.length < 8) {
      isValid = false;
      setErrors({
        ...errors,
        password: "Passwords need to be longer than 8 characters",
      });
    }
    return isValid;
  };

  const HandleRegisterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Register Form Submitted : ", form);

    if (HandlePasswordCheck()) {
      fetch("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status == 200) {
            location.href = "/login/0/" + data.message;
          } else {
            location.href = "/register/1/" + data.message;
          }
        });
    }
  };

  const HandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // React Return Function
  return (
    <>
      <form onSubmit={HandleRegisterSubmit} id="login-form">
        {/*Name Inputs*/}
        <div className="mb-3 row">
          {/*First Name Input*/}
          <div className="col">
            <label htmlFor="inputFirstname" className="form-label">
              First Name
            </label>
            <input
              type="text"
              className="form-control"
              id="inputFirstname"
              name="firstName"
              value={form.firstName}
              onChange={HandleChange}
              placeholder="First Name"
              required
            />
          </div>
          {/*Last Name Input*/}
          <div className="col">
            <label htmlFor="inputLastname" className="form-label">
              Last Name
            </label>
            <input
              type="text"
              className="form-control"
              id="inputLastname"
              name="lastName"
              value={form.lastName}
              onChange={HandleChange}
              placeholder="Last Name"
              required
            />
          </div>
        </div>
        <div className="row mb-3">
          {/*Username Input*/}
          <label htmlFor="inputUsername" className="col-sm-3 col-form-label">
            Username
          </label>
          <div className="col-sm-9 mb-3">
            <input
              type="text"
              className="form-control"
              id="inputUsername"
              name="username"
              value={form.username}
              onChange={HandleChange}
              placeholder="Username"
              required
            />
          </div>
          {/*Email Input*/}
          <label htmlFor="inputEmail" className="col-sm-3 col-form-label">
            Email
          </label>
          <div className="col-sm-9 mb-3">
            <input
              type="email"
              className="form-control"
              id="inputEmail"
              name="email"
              value={form.email}
              onChange={HandleChange}
              placeholder="Email"
              required
            />
          </div>
          {/*Password Input*/}
          <label htmlFor="inputPassword" className="col-sm-3 col-form-label">
            Password
          </label>
          <div className="col-sm-9">
            <input
              type="password"
              className="form-control"
              id="inputPassword"
              name="password"
              value={form.password}
              onChange={HandleChange}
              placeholder="Password"
              required
              aria-describedby="passwordHelpBlock"
            />
          </div>
          <div id="passwordHelpBlock" className="form-text mb-3">
            Your password must be 8-128 characters long, contain letters,
            numbers, at least one special character, and must not contain
            spaces, or emoji.
          </div>
          {errors.password && <Alert colour="danger">{errors.password}</Alert>}
          {/*Password Confirmation Input*/}
          <label
            htmlFor="inputPasswordConf"
            className="col-sm-3 col-form-label"
          >
            Confirm Password
          </label>
          <div className="col-sm-9 mb-3">
            <input
              type="password"
              className="form-control"
              id="inputPasswordConf"
              name="passwordConf"
              value={form.passwordConf}
              onChange={HandleChange}
              placeholder="Password Confirmation"
              required
            />
          </div>
          {errors.passwordConf && (
            <Alert colour="danger">{errors.passwordConf}</Alert>
          )}
        </div>
        {/*TOS and PP Input*/}
        <div className="mb-3 row">
          <div className="col-sm-12">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="tos"
                name="tos"
                value={form.tos}
                onChange={HandleChange}
                required
              />
              <label className="form-check-label" htmlFor="tos">
                By ticking this box you agree to the{" "}
                <a href="/terms_of_service">Terms of Service</a> and the{" "}
                <a href="/privacy_policy">Privacy Policy</a>
              </label>
            </div>
          </div>
        </div>
        {/*Submit Button*/}
        <button type="submit" className="btn btn-primary">
          Register
        </button>
      </form>
      {/*Google Button*/}
      <div className="p-3 h-100 d-flex align-items-center justify-content-center">
        <GoogleButton
          label="Register with Google"
          onClick={() => {
            location.href = "/auth/google";
            console.log("Google register button clicked");
          }}
        />
      </div>
    </>
  );
};

export default RegisterForm;
