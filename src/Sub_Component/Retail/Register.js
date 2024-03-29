import React, { useState } from "react";
// import "./Choose.css";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";
import { FiMinus } from "react-icons/fi";
import { Container, Row, Col, Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { BiShow, BiHide } from "react-icons/bi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Footer from "./Footer";
import { useAuth } from "../../utils/auth";
import { cityArray } from "../../utils/data";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { apiUrl } from "../../data/env";

function Register() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = () => {
    setShowPassword((preve) => !preve);
  };

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [city, setCity] = useState("");
  const [postcode, setPostcode] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  const [focusedValue, setFocusedValue] = useState("");
  const [distanceFromOrigin, setDistanceFromOrigin] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();

  const redirectPath = location.state?.path || "/";

  const handleSignup = () => {
    const id = toast.loading("Signing Up...");

    const payload = {
      firstName,
      lastName,
      email,
      password,
      passwordConfirm: password,
    };
    if (postcode) payload.postcode = postcode;
    if (city) payload.city = city;
    if (address) payload.address = address;
    if (phone) payload.phone = phone;
    if (distanceFromOrigin) payload.distanceFromOrigin = distanceFromOrigin;

    console.log(payload);

    axios
      .post(`${apiUrl}/api/v1/customer/signup`, payload)
      .then((res) => {
        // console.log(res.data);
        toast.success("Registered Successfully", {
          id,
        });

        setTimeout(() => {
          auth.login(res.data.token, res.data.data);
          navigate(redirectPath, { replace: true });
        }, 500);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response?.data?.message || "Could Not Sign Up", {
          id,
        });
      });
  };

  const handleGetLocation = (pstcd) => {
    const id = toast.loading("Verifying Postcode...");
    axios
      .get(`https://api.postcodes.io/postcodes/${pstcd}`)
      .then((res) => {
        const destLat = res.data.result.latitude;
        const destLon = res.data.result.longitude;
        toast.success("Verified!", { id });

        axios
          .get(
            `https://api-v2.distancematrix.ai/maps/api/distancematrix/json?origins=52.921418,-1.4829216&destinations=${destLat},${destLon}&key=PQm5fiw255huOOBN3KDbSlnPitHkOQrHZS7JbfitnuNKR6wN4fm18rK6elfDJ7AP`
          )
          .then((res) => {
            setDistanceFromOrigin(res.data.rows[0].elements[0].distance.text);
          })
          .catch((err) => {
            console.log("error calculating distance between coords: ", err);
            setDistanceFromOrigin(
              `${calculateDistance(destLat, destLon).toFixed(3)} km`
            );
          });
      })
      .catch((err) => {
        console.log(err);
        toast.error(
          err.response?.data?.error || "Postcode could not be verified!",
          { id }
        );
      });
  };

  function calculateDistance(lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = ((lat2 - 52.921418) * Math.PI) / 180;
    const dLon = ((lon2 - -1.4829216) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((52.921418 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
  }

  return (
    <div class=" ">
      {/* About Start */}
      <div className="container-fluid ">
        <div className="row">
          <div className="col-lg-6 bg-[#1B94A080] p-4 h-screen hidden md:block">
            <Link to="/">
              <img
                src="https://ik.imagekit.io/2nuimwatr/WhatsApp_Image_2024-01-01_at_12.04.01_AM-removebg-preview.png?updatedAt=1704471063051"
                alt=""
                class="h-[75px] w-[75px]"
              />
            </Link>

            <h3 class="text-white text-2xl font-semibold text-wrap  hidden md:block w-50 ">
              Welcome to Vaping CIRCLE!
            </h3>
          </div>

          <div className="col-lg-6 rounded-[24px] lg:ml-[-90px] p-2 md:pt-5 md:pb-5 bg-white  z-0 relative">
            <img
              src="https://ik.imagekit.io/p2slevyg1/41098deb-a489-4df6-acd5-55e3bb05f5cb-removebg-preview.png?updatedAt=1705433981054"
              alt=""
              class="w-[350px] h-[450px] lg:ml-[300px] z-[1000] absolute  mt-44 bottom-5 right-[90%] hidden md:block"
              style={{ zIndex: 1000 }}
            />
            <h3 class=" text-3xl font-bold text-center pt-5 pl-2 md:pl-[5rem] pb-4">
              Create Your Account
            </h3>
            {/* <div class="flex justify-center items-center pl-2 md:pl-[5rem]">
              <p class="flex justify-center items-center border p-2 mx-2 rounded-md">
                <FcGoogle class="mx-2 text-xl" />
                Sign up with Google
              </p>
              <p class="flex justify-center items-center border p-2 mx-2 rounded-md">
                <FaFacebookF class="mx-2 text-xl text-blue-800" />
                Sign up with Facebook
              </p>
            </div>
            <p class="flex justify-center items-center pt-3 pb-3 pl-2 md:pl-[5rem]">
              <FiMinus />
              OR
              <FiMinus />
            </p> */}
            <div class="pl-2 md:pl-[13%] ">
              <Form class="p-2">
                <Row className="mb-3">
                  <Form.Group as={Col} controlId="">
                    <Form.Control
                      type="text"
                      placeholder="First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group as={Col} controlId="">
                    <Form.Control
                      type="text"
                      placeholder="Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </Form.Group>
                </Row>

                <Form.Group className="mb-3" controlId="">
                  <Form.Control
                    type="tel"
                    placeholder="Phone (optional)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="">
                  <Form.Control
                    type="text"
                    placeholder="Address (optional)"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </Form.Group>

                <Row className="mb-3">
                  <Form.Group as={Col} controlId="">
                    <Form.Select
                      defaultValue="Select City (optional)"
                      onChange={(e) => setCity(e.target.value)}
                    >
                      <option selected hidden>
                        Select City
                      </option>
                      {cityArray?.map((city) => (
                        <option key={city}>{city}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group as={Col} controlId="">
                    <Form.Control
                      type="text"
                      placeholder="Post Code (optional)"
                      value={postcode}
                      onChange={(e) => setPostcode(e.target.value)}
                      onFocus={(e) => setFocusedValue(e.target.value)}
                      onBlur={(e) => {
                        if (e.target.value !== focusedValue)
                          handleGetLocation(e.target.value);
                      }}
                    />
                  </Form.Group>
                </Row>

                <Form.Group className="mb-3" controlId="">
                  <Form.Control
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3 d-flex" controlId="">
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span
                    className="flex text-xl cursor-pointer"
                    onClick={handleShowPassword}
                    style={{
                      width: "5%",
                      marginTop: "9px",
                      marginLeft: "9px",
                    }}
                  >
                    {showPassword ? <BiShow /> : <BiHide />}
                  </span>
                </Form.Group>

                <div class="flex flex-col justify-center items-center mt-5">
                  <button
                    class="bg-[#59A0B8] text-white px-5  py-2 rounded-[24px]"
                    onClick={(e) => {
                      e.preventDefault();
                      if (firstName && lastName && password && email)
                        handleSignup();
                      else toast.error("Please enter the necessary info!");
                    }}
                  >
                    Create Account
                  </button>
                  <p class="text-[#000000]  p-2">
                    Already have an account
                    <Link to="/login">
                      <span class="text-[#8dc9cf] px-1 font-bold underline underline-offset-2">
                        Login
                      </span>
                    </Link>
                  </p>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
      {/* About End */}

      {/* <Footer categories={categories} /> */}
      <Toaster />
    </div>
  );
}

export default Register;
