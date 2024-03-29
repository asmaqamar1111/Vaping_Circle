import React from "react";
import { Container, Row, Col, Modal } from "react-bootstrap";
import { RiDeleteBin5Line } from "react-icons/ri";
import { FaCircle } from "react-icons/fa";
import { FaRegCircle } from "react-icons/fa";
import { HiOutlinePencilAlt } from "react-icons/hi";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Footer from "./Footer";
import Fixed_Component from "./Fixed_Component";
import { values } from "idb-keyval";
import { useAuth } from "../../utils/auth";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../../data/env";
import { cityArray } from "../../utils/data";

function Checkout({ categories, filters }) {
  const [cartArr, setCartArr] = React.useState([]);
  const [checkState, setCheckState] = React.useState(true);
  const nav = useNavigate();

  function getSavedCartProducts() {
    values()
      .then((res) => {
        // setCartArr(res.map((cId) => products.find((p) => p._id === cId)));
        setCartArr(res);
        console.log(res);
      })
      .catch((err) => console.error(err));
  }

  React.useEffect(() => {
    getSavedCartProducts();
  }, []);

  const auth = useAuth();

  const handleCheckout = () => {
    const id = toast.loading("Redirecting to Payment Link...");
    values()
      .then((res) => {
        const config = {
          headers: { Authorization: `Bearer ${auth.token}` },
        };

        axios
          .post(
            `${apiUrl}/api/v1/order`,
            { commodities: res, delivery: deliveryObj },
            config
          )
          .then((res) => {
            console.log(res.data);
            toast.success("Created Link Successfully", {
              id,
            });
            setTimeout(() => {
              window.location.replace(res.data.redirectUrl);
            }, 1000);
          })
          .catch((err) => {
            console.log(err);
            toast.error(
              err.response?.data?.message || "Could Not Generate Link",
              {
                id,
              }
            );
          });
      })
      .catch((err) => {
        toast.error("Error occured getting cart. Delete cart & order again");
        console.log(err);
      });
  };

  // Modal states
  const [show, setShow] = React.useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [phone, setPhone] = React.useState(auth.user.phone);
  const [city, setCity] = React.useState(auth.user.city);
  const [postcode, setPostcode] = React.useState(auth.user.postcode);
  const [address, setAddress] = React.useState(auth.user.address);

  const handleChangeDetails = () => {
    const payload = {
      phone,
      city,
      postcode,
      address,
      distanceFromOrigin,
    };
    console.log("payload: ", payload);

    const id = toast.loading("Updating Info...");

    const config = {
      headers: { Authorization: `Bearer ${auth.token}` },
    };

    axios
      .patch(`${apiUrl}/api/v1/customer/updateMe`, payload, config)
      .then((res) => {
        console.log(res.data);
        toast.success("Updated Info Successfully", {
          id,
        });

        auth.login(auth.token, res.data.user);

        setPostcode(res.data.user.postcode);
        setCity(res.data.user.city);
        setAddress(res.data.user.address);
        setPhone(res.data.user.phone);

        handleClose();
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response?.data?.message || "Could Not Update Info", {
          id,
        });
      });
  };

  // delivery
  const [deliveryOption, setDeliveryOption] =
    React.useState("standardDelivery");
  const [deliveryObj, setDeliveryObj] = React.useState({
    deliveryType: "Standard",
    deliveryTime: "Next Day",
    deliveryPrice: "5.00",
  });

  // postcodes
  const [focusedValue, setFocusedValue] = React.useState("");
  const [distanceFromOrigin, setDistanceFromOrigin] = React.useState("");

  const handleDeliveryOptionChange = (option) => {
    setDeliveryOption(option);
  };

  const kmsFromOrigin = +auth.user?.distanceFromOrigin?.split(" ")[0] || 0;
  let notEligibleForExpress = true;
  if (kmsFromOrigin !== 0 && kmsFromOrigin <= 8.05) {
    notEligibleForExpress = false;
  }

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
    <div>
      <Fixed_Component categories={categories} filters={filters} />
      <div class="bg-[#FFFFFF] md:bg-[#F1FCFF] mt-[7rem] md:mt-[11rem]">
        <h2 class="text-3xl  font-bold text-center py-5">Checkout</h2>
        <Container fluid>
          <Row>
            <Col sm={12} md={8}>
              <div class="bg-[#FFFFFF] rounded-lg md:mx-5 my-3">
                <div class="p-5">
                  <div class="mx-4 p-1">
                    <div class="flex items-center">
                      <div class="flex items-center text-[#59A0B8] relative">
                        <FaCircle />

                        <div class="absolute top-0  text-center mt-10 -ml-[10px] text-xs font-medium  text-gray-500">
                          Cart
                        </div>
                      </div>
                      <div class="flex-auto border-t-2 transition duration-500 ease-in-out border-[#59A0B8]"></div>
                      <div class="flex items-center  relative">
                        <FaRegCircle class="relative text-[#59A0B8] text-lg" />
                        <FaCircle class="z-5 absolute text-[#59A0B8] px-1" />

                        <div
                          class="absolute top-0  text-center mt-10 -ml-[20px] text-xs font-medium  text-gray-500 d-flex flex-column gap-2"
                          style={{ alignItems: "center" }}
                        >
                          <span>Information</span>
                        </div>
                      </div>
                      <div class="flex-auto border-t-2 transition duration-500 ease-in-out border-gray-300"></div>
                      <div class="flex items-center text-gray-500 relative">
                        <FaRegCircle />
                        <div class="absolute top-0 -ml-[12px] text-center mt-10 text-xs font-medium  text-gray-500">
                          Payment
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="mt-12 p-4">
                    <div>
                      <Form sm={12}>
                        <Row className="mb-3">
                          <Form.Group as={Col} controlId="">
                            <Form.Label class="text-[#59A0B8] font-semibold py-2">
                              First Name
                            </Form.Label>
                            <Form.Control
                              type="text"
                              disabled
                              defaultValue={auth.user.firstName}
                            />
                          </Form.Group>

                          <Form.Group as={Col} controlId="">
                            <Form.Label class="text-[#59A0B8] font-semibold py-2">
                              Last Name
                            </Form.Label>
                            <Form.Control
                              type="text"
                              disabled
                              defaultValue={auth.user.lastName}
                            />
                          </Form.Group>
                        </Row>
                        <Row className="mb-3">
                          <Form.Group as={Col} controlId="" sm={6}>
                            <Form.Label class="text-[#59A0B8] font-semibold py-2">
                              Email
                            </Form.Label>
                            <Form.Control
                              type="email"
                              disabled
                              defaultValue={auth.user.email}
                            />
                          </Form.Group>

                          <Form.Group as={Col} controlId="" sm={6}>
                            <Form.Label class="text-[#59A0B8] font-semibold py-2">
                              Phone
                            </Form.Label>
                            <Form.Control
                              type="text"
                              disabled
                              placeholder={phone || "N/A"}
                            />
                          </Form.Group>
                        </Row>
                        <Row className="mb-3">
                          <Form.Group as={Col} controlId="">
                            <Form.Label class="text-[#59A0B8] font-semibold py-2">
                              City
                            </Form.Label>
                            <Form.Control
                              type="text"
                              disabled
                              placeholder={city || "N/A"}
                            />
                          </Form.Group>

                          <Form.Group as={Col} controlId="">
                            <Form.Label class="text-[#59A0B8] font-semibold py-2">
                              Postcode
                            </Form.Label>
                            <Form.Control
                              type="text"
                              disabled
                              placeholder={postcode || "N/A"}
                            />
                          </Form.Group>
                        </Row>
                        <Form.Group
                          className="mb-3"
                          controlId="formGridAddress1"
                        >
                          <Form.Label class="text-[#59A0B8] font-semibold py-2">
                            Address
                          </Form.Label>
                          <Form.Control
                            type="text"
                            disabled
                            placeholder={address || "N/A"}
                          />
                        </Form.Group>

                        <Form.Group
                          className="mb-3 text-black"
                          class="text-[#707070]"
                          id="formGridCheckbox"
                        >
                          <Form.Check
                            type="checkbox"
                            checked={checkState}
                            onClick={(e) => setCheckState((c) => !c)}
                            label="By making a purchase with Vaping Circle, you confirm and agree to our terms & conditions. Please tick to confirm."
                          />
                        </Form.Group>
                        <span>
                          <button
                            class="bg-[#a8a8a8] md:ml-[35rem] text-white p-3  text-xs rounded d-flex"
                            onClick={(e) => {
                              e.preventDefault();
                              handleShow();
                            }}
                          >
                            <span className="w-max">Edit Info</span>
                            <span>
                              <HiOutlinePencilAlt className="relative text-white text-sm align-centre" />
                            </span>
                          </button>
                        </span>
                        <div class="flex flex-col justify-center items-center ">
                          <button
                            id="btn"
                            class="bg-[#59A0B8] text-white mt-5 px-5 lg:text-xl font-semibold  py-2 rounded-[50px] "
                            onClick={(e) => {
                              e.preventDefault();
                              if (
                                auth.user.phone &&
                                auth.user.address &&
                                auth.user.city &&
                                auth.user.postcode
                              )
                                handleCheckout();
                              else {
                                toast.error("Complete your information");
                                handleShow();
                              }
                            }}
                          >
                            Proceed to Payment
                          </button>
                        </div>
                      </Form>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
            <Col xs={12} md={4}>
              <div class="bg-[#FFFFFF] rounded-lg mx-5 my-3">
                {cartArr?.map((crt, i) => {
                  return (
                    <div key={i} class="flex px-4 py-5 justify-between">
                      <img src={crt.image} alt="" class="w-[70px] h-[70px]" />
                      <p class="text-[#707070]" style={{ fontSize: 12 }}>
                        {crt.nm}
                      </p>

                      {/* <div class="border flex  w-16 h-5 border-black "> */}
                      <p class="text-[#59A0B8] ml-2">
                        Qty.&nbsp;{crt.quantity}
                      </p>
                      {/* </div> */}
                    </div>
                  );
                })}

                <hr class="mx-4" />
                <Form.Group className="px-4 pt-3">
                  <Form.Label>
                    <span
                      className="font-semibold text-[#59A0B8]"
                      style={{ textDecoration: "underline" }}
                    >
                      Delivery Options:
                    </span>
                  </Form.Label>
                  <Col className="mx-5">
                    <Row>
                      <Form.Check
                        type="radio"
                        disabled={notEligibleForExpress}
                        label="Express (Same Day)"
                        name="deliveryOption"
                        id="expressDelivery"
                        checked={deliveryOption === "expressDelivery"}
                        onChange={() => {
                          handleDeliveryOptionChange("expressDelivery");
                          setDeliveryObj({
                            deliveryType: "Express",
                            deliveryTime: "Same Day",
                            deliveryPrice: "3.50",
                          });
                        }}
                        style={
                          deliveryOption === "expressDelivery"
                            ? { fontWeight: "Bold" }
                            : {}
                        }
                        className="p-0"
                      />
                    </Row>
                    <Row>
                      <Form.Check
                        type="radio"
                        label="Standard (Next Day)"
                        name="deliveryOption"
                        id="standardDelivery"
                        checked={deliveryOption === "standardDelivery"}
                        onChange={() => {
                          handleDeliveryOptionChange("standardDelivery");
                          setDeliveryObj({
                            deliveryType: "Standard",
                            deliveryTime: "Next Day",
                            deliveryPrice: "5.00",
                          });
                        }}
                        style={
                          deliveryOption === "standardDelivery"
                            ? { fontWeight: "Bold" }
                            : {}
                        }
                        className="p-0"
                      />
                    </Row>
                    <Row>
                      <Form.Check
                        type="radio"
                        label="Economy (3-4 Days)"
                        name="deliveryOption"
                        id="economyDelivery"
                        checked={deliveryOption === "economyDelivery"}
                        onChange={() => {
                          handleDeliveryOptionChange("economyDelivery");
                          setDeliveryObj({
                            deliveryType: "Economy",
                            deliveryTime: "3-4 Days",
                            deliveryPrice: "4.00",
                          });
                        }}
                        style={
                          deliveryOption === "economyDelivery"
                            ? { fontWeight: "Bold" }
                            : {}
                        }
                        className="p-0"
                      />
                    </Row>
                  </Col>
                </Form.Group>

                <hr class="mx-4" />
                <div class="px-4 pt-4 flex justify-between">
                  <p>Subtotal</p>
                  <p>
                    £
                    {cartArr
                      .map((c) => c.totalPrice)
                      .reduce((p, c) => p + c, 0)
                      .toFixed(2)}
                  </p>
                </div>
                <div class="px-4 pt-3 flex justify-between">
                  <p>Shipping</p>
                  <p>£{deliveryObj.deliveryPrice}</p>
                </div>
                <div class="px-4 pt-3 pb-2 flex justify-between">
                  <p>Tax</p>
                  <p>-</p>{" "}
                </div>
                <hr class="mx-4" />
                <div class="px-4 flex justify-between pt-3 pb-4">
                  <h2 class="text-xl font-bold">Estimated Total</h2>
                  <h2 class="text-xl font-bold text-[#59A0B8]">
                    £
                    {(
                      cartArr
                        .map((c) => c.totalPrice)
                        .reduce((p, c) => p + c, 0) +
                      Number(deliveryObj.deliveryPrice)
                    ).toFixed(2)}
                  </h2>
                </div>
              </div>
            </Col>
          </Row>
        </Container>

        <Footer categories={categories} />
      </div>
      <Modal show={show} onHide={handleClose} className="mt-5">
        <Modal.Body>
          <Form.Group className="mb-3 d-flex gap-2 justify-center items-center">
            <Form.Label class="font-semibold w-20">Phone:</Form.Label>
            <Form.Control
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-70"
            />
          </Form.Group>
          <Form.Group className="mb-3 d-flex gap-2 justify-center items-center">
            <Form.Label class="font-semibold w-20">Address:</Form.Label>
            <Form.Control
              placeholder="Address Line"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-70"
            />
          </Form.Group>
          <Form.Group className="mb-3 d-flex gap-2 justify-center items-center">
            <Form.Label class="font-semibold w-20">Postcode:</Form.Label>
            <Form.Control
              placeholder="Postcode"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value)}
              onFocus={(e) => setFocusedValue(e.target.value)}
              onBlur={(e) => {
                if (e.target.value !== focusedValue)
                  handleGetLocation(e.target.value);
              }}
              className="w-70"
            />
          </Form.Group>
          <Form.Group className="mb-3 d-flex gap-2 justify-center items-center">
            <Form.Label class="font-semibold w-20">City:</Form.Label>
            <Form.Select
              placeholder="City"
              defaultValue={auth.user.city || "Select City"}
              onChange={(e) => setCity(e.target.value)}
              value={city}
              className="w-70"
            >
              <option selected hidden>
                Select City
              </option>
              {cityArray?.map((city) => (
                <option key={city}>{city}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={(e) => {
              e.preventDefault();
              if (phone && city && postcode && address) handleChangeDetails();
              else toast.error("Fill all info!");
            }}
            variant="info"
            class="rounded-1 py-2 px-2 bg-[#1B94A0] text-white hover:bg-[#1B94A0] hover:text-white"
          >
            Save & Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Toaster />
    </div>
  );
}

export default Checkout;
