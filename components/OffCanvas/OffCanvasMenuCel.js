import React, { useState } from "react";
import Link from "next/link";
import { Offcanvas, Button, Navbar } from "react-bootstrap";
import { List } from "react-bootstrap-icons";
import NavSearchCel from "../NavSearchCel/NavSearchCel";
import PrimaryButton from "../Buttons/PrimaryButton/PrimaryButton";

const OffCanvasMenuCel = ({filters}) => {
  const [show, setShow] = useState(false);

  const handleToggle = () => setShow((show) => !show);

  return (
    <>
      <PrimaryButton onClick={handleToggle}>
        <List size={25} />
      </PrimaryButton>

      <Offcanvas show={show} onHide={handleToggle}>
        <Offcanvas.Header className="p-0 pe-3" closeButton>
          <Offcanvas.Title>
            <Link href="/" passHref>
              <a className="p-0">
                <img width={220} height={92} alt="" src={"/logo.svg"} />
              </a>
            </Link>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <NavSearchCel filters={filters} />
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default OffCanvasMenuCel;
