import { useState } from "react";
import { GoogleLoginButton } from "react-social-login-buttons";
import getDomain from "../middleware/GetDomain";

const LoginForm = () => {
  // Form Information
  const [form, setForm] = useState({ username: "", password: "", domain: getDomain() });


  console.log("Domain found: " + form.domain);
  

  // Handlers
  const handleLoginSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //console.log("Login Form Submitted : ", form);

    fetch("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.status);
        if (data.status == 200) {
          console.log("Login: Send to dashboard");
          location.href = "/dashboard";
        } else {
          location.href = "/login/1/" + data.message;
        }
      });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // React Return Function
  return (
    <>
      <form onSubmit={handleLoginSubmit} id="login-form">
        {/*Username Input*/}
        <div className="mb-3">
          <label htmlFor="inputUsername" className="form-label">
            Username
          </label>
          <input
            type="text"
            className="form-control"
            id="inputUsername"
            aria-describedby="usernameHelp"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Username"
            required
          />
          <div id="usernameHelp" className="form-text">
            This is NOT your email address
          </div>
        </div>
        {/*Password Input*/}
        <div className="mb-3">
          <label htmlFor="inputPassword" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="inputPassword"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            required
          />
        </div>
        {/*Submit Button*/}
        <button type="submit" className="btn btn-primary">
          Sign In
        </button>
      </form>
      {/*Google Button*/}
      <div className="p-3 h-100 d-flex align-items-center justify-content-center">
        <GoogleLoginButton
          text="Sign in with Google"
          onClick={() => {
            location.href = "/auth/google";
            console.log("Google login button clicked");
          }}
        />
      </div>
    </>
  );
};

export default LoginForm;
