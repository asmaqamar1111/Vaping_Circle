import React from "react";
import "./categories.css";
// import { AiOutlineArrowRight } from "react-icons/ai";
import { FaArrowRight } from "react-icons/fa";
import { Row, Col, Card, Container } from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";
import { IoIosArrowRoundForward } from "react-icons/io";

function Categories({ categories, setCurrentCategory }) {
  return (
    <div>
      <h1 class="text-3xl font-bold mb-5  mt-5 text-center">Categories</h1>

      {/* large  */}
      <div class="hidden md:block  ">
        <Container>
          <Row>
            <Col md={5} style={{ position: "relative" }}>
              <Link
                to={`/productPage/${categories[1]?._id}/${categories[1]?.name}`}
              >
                <img
                  id="img"
                  class="min-w-full max-w-full  min-h-full max-h-full transition relative ease-in-out delay-75  hover:-translate-y-1 hover:scale-105 duration-150 float-right"
                  alt=""
                  src="https://ik.imagekit.io/p2slevyg1/eliwuid@2x.png?updatedAt=1704225541370"
                />
                <div class="absolute md:bottom-[4rem] lg:bottom-[6rem] xl:bottom-[7rem] md:left-[4rem] lg:left-[8rem] xl:left-[11rem] 2xl:left-[12rem]">
                  <button
                    class="px-5 py-3   z-5 fs-6   bg-white font-bold shadow-md  rounded-md text-[#59A0B8]"
                    onClick={() => setCurrentCategory(categories[1]?._id)}
                  >
                    {categories[1]?.name || "E-Liquids"}
                  </button>
                </div>
              </Link>
            </Col>
            <Col md={7}>
              <Row>
                <Col md={12} style={{ position: "relative" }}>
                  <Link
                    to={`/productPage/${categories[2]?._id}/${categories[2]?.name}`}
                  >
                    <img
                      id="img"
                      class=" transition ease-in-out delay-75  hover:-translate-y-1 hover:scale-105 duration-150"
                      alt=""
                      src="https://ik.imagekit.io/p2slevyg1/banner%20(1).png?updatedAt=1704225484839"
                    />
                    <div class="absolute md:bottom-[7rem] lg:bottom-[8rem] xl:bottom-[9rem] md:left-[7rem] lg:left-[13rem] xl:left-[17rem] 2xl:left-[17rem]">
                      <button
                        class="px-5 py-3 z-5 absolute bg-white font-bold shadow-md fs-6 rounded-md text-[#59A0B8]"
                        onClick={() => setCurrentCategory(categories[2]?._id)}
                      >
                        {categories[2]?.name || "Vape"}
                      </button>
                    </div>
                  </Link>
                </Col>
                <Col md={6} style={{ position: "relative" }}>
                  <Link
                    to={`/productPage/${categories[0]?._id}/${categories[0]?.name}`}
                  >
                    <img
                      id="img"
                      class=" transition ease-in-out delay-75  hover:-translate-y-1 hover:scale-105 duration-150"
                      alt=""
                      src="https://ik.imagekit.io/p2slevyg1/refill.png?updatedAt=1704225483845"
                    />
                    <div class="absolute md:bottom-[7rem] lg:bottom-[8rem] xl:bottom-[8rem] md:left-[3rem] lg:left-[3rem] xl:left-[6rem] 2xl:left-[6rem]">
                      <button
                        class="px-4 py-3 md:w-[7rem] lg:w-[11rem]  z-5 absolute bg-white font-bold shadow-md lg:text-lg md:text-sm rounded-md text-[#59A0B8]"
                        onClick={() => setCurrentCategory(categories[0]?._id)}
                      >
                        {categories[0]?.name || "Kits"}
                      </button>
                    </div>
                  </Link>
                </Col>
                <Col md={6} style={{ position: "relative" }}>
                  <Link
                    to={`/productPage/${categories[3]?._id}/${categories[3]?.name}`}
                  >
                    <img
                      class=" transition ease-in-out delay-75  hover:-translate-y-1 hover:scale-105 duration-150"
                      alt=""
                      src="https://ik.imagekit.io/ql8u22y4o/tr:ar-1-1/blueberry-dot-pro-refill-pods-p1685-5294_image.jpg?updatedAt=1710912127634"
                    />
                    <div class="absolute md:bottom-[6rem] lg:bottom-[8rem] xl:bottom-[8rem] md:left-[2rem] lg:left-[5rem] xl:left-[7rem] 2xl:left-[7rem]">
                      <button
                        class="px-5 py-3  z-5 absolute bg-white font-bold shadow-md fs-6 rounded-md text-[#59A0B8]"
                        onClick={() => setCurrentCategory(categories[3]?._id)}
                      >
                        {categories[3]?.name || "Mods"}
                      </button>
                    </div>
                  </Link>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>

      {/* small */}
      <div class="block md:hidden ">
        <Container>
          <Row>
            <Col style={{ position: "relative" }}>
              <Link
                to={`/productPage/${categories[1]?._id}/${categories[1]?.name}`}
              >
                <img
                  id="img"
                  class="transition relative ease-in-out min-w-full max-w-full min-h-full max-h-full object-cover delay-75  hover:-translate-y-1 hover:scale-105 duration-150 float-right"
                  alt=""
                  style={{
                    padding: "10px 0px 20px 10px",
                    // borderRadius: "20px 20px 20px 20px",
                  }}
                  src="https://ik.imagekit.io/2nuimwatr/eliwuid.png?updatedAt=1705420194962"
                />
                <div class="absolute bottom-[3rem] left-[4rem] ">
                  <button
                    class="  z-5 text-sm py-2 px-3 bg-white font-bold shadow-md  rounded-md text-[#59A0B8]"
                    onClick={() => setCurrentCategory(categories[1]?._id)}
                  >
                    {categories[1]?.name || "E-liquid"}
                  </button>
                </div>
              </Link>
            </Col>
            <Col>
              <Row style={{ position: "relative" }}>
                <Link
                  to={`/productPage/${categories[3]?._id}/${categories[3]?.name}`}
                >
                  <img
                    class=" transition ease-in-out delay-75  hover:-translate-y-1 hover:scale-105 duration-150"
                    alt=""
                    src="https://ik.imagekit.io/ql8u22y4o/tr:ar-1-1/blueberry-dot-pro-refill-pods-p1685-5294_image.jpg?updatedAt=1710912127634"
                  />{" "}
                  {/* <div class=""> */}
                  <button
                    onClick={() => setCurrentCategory(categories[3]?._id)}
                    class=" absolute bottom-[3rem] left-[2rem]  z-5 text-[12px] py-2 px-2 bg-white font-bold shadow-md  w-[118px] ml-[10px] rounded-md text-[#59A0B8]"
                  >
                    {categories[3]?.name || "Refill & PODS real"}
                  </button>
                  {/* </div> */}
                </Link>
              </Row>
              <Row style={{ position: "relative" }}>
                <Link
                  to={`/productPage/${categories[0]?._id}/${categories[0]?.name}`}
                >
                  <img
                    id="img"
                    class=" transition ease-in-out delay-75   hover:-translate-y-1 hover:scale-105 duration-150"
                    alt=""
                    src="https://ik.imagekit.io/p2slevyg1/refill.png?updatedAt=1704225483845"
                  />{" "}
                  <button
                    onClick={() => setCurrentCategory(categories[0]?._id)}
                    class=" absolute bottom-[3rem] left-[3rem] w-[100px] z-5  bg-white font-bold shadow-md text-sm py-2 px-3 rounded-md text-[#59A0B8]"
                  >
                    {categories[0]?.name || "Mods"}
                  </button>
                </Link>
              </Row>
            </Col>
          </Row>
          <Row style={{ position: "relative" }}>
            <Link
              to={`/productPage/${categories[2]?._id}/${categories[2]?.name}`}
            >
              <img
                id="img"
                class=" transition ease-in-out delay-75 p-0 hover:-translate-y-1 hover:scale-105 duration-150"
                alt=""
                src="https://ik.imagekit.io/p2slevyg1/banner%20(1).png?updatedAt=1704225484839"
              />{" "}
              <div class="absolute bottom-[3rem] left-[9rem] w-0">
                <button
                  onClick={() => setCurrentCategory(categories[2]?._id)}
                  class="text-sm py-2 px-3 z-5  bg-white font-bold shadow-md  rounded-md text-[#59A0B8]"
                >
                  {categories[2]?.name || "Disposables"}
                </button>
              </div>
            </Link>
          </Row>
        </Container>
      </div>

      <div>
        <Link to="/category_page">
          {" "}
          <button
            class="button-view mb-5 hover:bg-[#0B428B]"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "0px auto",
            }}
          >
            View All
            <IoIosArrowRoundForward class="ml-3 text-3xl" />
          </button>
        </Link>
      </div>

      <Outlet />
    </div>
  );
}

export default Categories;
