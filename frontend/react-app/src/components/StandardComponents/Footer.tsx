import {
  faFacebookF,
  faGoogle,
  faInstagram,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Footer = () => {
  return (
    <>
      <div className="container-fluid">
        <footer
          className="text-center text-lg-start text-white"
          style={{ backgroundColor: "#45526e" }}
        >
          <div className="container p-4 pb-0">
            <section className="">
              <div className="row">
                <div className="col-md-3 col-lg-3 col-xl-3 mx-auto mt-3">
                  <h6 className="text-uppercase mb-4 font-weight-bold">
                    Penguin Inspections
                  </h6>
                  <p>
                    The all-in-one solution for PPE tracking and inspection
                    management. Enabling you to quickly and easily view your
                    equipment and track any issues with it.
                  </p>
                </div>

                <hr className="w-100 clearfix d-md-none" />

                <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mt-3">
                  <h6 className="text-uppercase mb-4 font-weight-bold">
                    Software
                  </h6>
                  <p>
                    <a className="text-white" href="/products">
                      Equipment Tracker
                    </a>
                  </p>
                  <p>
                    <a className="text-white" href="/home">
                      Rental Tracker
                    </a>
                  </p>
                  <p>
                    <a className="text-white" href="/products">
                      Pricing
                    </a>
                  </p>
                </div>

                <hr className="w-100 clearfix d-md-none" />

                <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mt-3">
                  <h6 className="text-uppercase mb-4 font-weight-bold">
                    Useful links
                  </h6>
                  <p>
                    <a className="text-white" href="/dashboard">
                      Your Account
                    </a>
                  </p>
                  <p>
                    <a className="text-white" href="/terms_of_service">
                      Terms of Service
                    </a>
                  </p>
                  <p>
                    <a className="text-white" href="/privacy_policy">
                      Privacy Policy
                    </a>
                  </p>
                  <p>
                    <a className="text-white" href="/faqs">
                      Help
                    </a>
                  </p>
                </div>

                <hr className="w-100 clearfix d-md-none" />

                <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mt-3">
                  <h6 className="text-uppercase mb-4 font-weight-bold">
                    Contact
                  </h6>
                  <p>
                    <i className="fas fa-home mr-3"></i> Nottingham, UK
                  </p>
                  <p>
                    <i className="fas fa-envelope mr-3"></i>{" "}
                    babeycomputing@gmail.com
                  </p>
                </div>
              </div>
            </section>

            <hr className="my-3" />

            <section className="p-3 pt-0">
              <div className="row d-flex align-items-center">
                <div className="col-md-7 col-lg-8 text-center text-md-start">
                  <div className="p-3">
                    © 2025 Copyright:{" "}
                    <a
                      className="text-white"
                      href="https://babeyjack.github.io/"
                    >
                      Babey Computing
                    </a>
                  </div>
                </div>
                <div className="col-md-5 col-lg-4 ml-lg-0 text-center text-md-end">
                  <a
                    className="btn btn-outline-light btn-floating m-1 text-white"
                    role="button"
                  >
                    <FontAwesomeIcon icon={faFacebookF} />
                  </a>

                  <a
                    className="btn btn-outline-light btn-floating m-1 text-white"
                    role="button"
                  >
                    <FontAwesomeIcon icon={faTwitter} />
                  </a>

                  <a
                    className="btn btn-outline-light btn-floating m-1 text-white"
                    role="button"
                  >
                    <FontAwesomeIcon icon={faGoogle} />
                  </a>

                  <a
                    className="btn btn-outline-light btn-floating m-1 text-white"
                    role="button"
                  >
                    <FontAwesomeIcon icon={faInstagram} />
                  </a>
                </div>
              </div>
            </section>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Footer;
