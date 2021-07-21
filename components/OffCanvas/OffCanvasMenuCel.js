import React, { useState } from "react";
import Link from "next/link";
import { Offcanvas, Button, Navbar } from "react-bootstrap";
import { List } from "react-bootstrap-icons";
import NavSearchCel from "../NavSearchCel/NavSearchCel";

const OffCanvasMenuCel = () => {
  const [show, setShow] = useState(false);

  const handleToggle = () => setShow((show) => !show);

  return (
    <>
      <Button variant="transparent" onClick={handleToggle}>
        <List size={25} />
      </Button>

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
          <NavSearchCel />
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default OffCanvasMenuCel;
