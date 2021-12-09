import React, { useState } from "react";
import Link from "next/link";
import { Offcanvas, Button, Navbar } from "react-bootstrap";
import { List } from "react-bootstrap-icons";
import NavSearchCel from "../NavSearchCel/NavSearchCel";
import PrimaryButton from "../Buttons/PrimaryButton/PrimaryButton";

const OffCanvasMenuCel = () => {
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
                <svg xmlns="http://www.w3.org/2000/svg" width="220" height="92" viewBox="0 0 220 92">
                  <g transform="translate(277 -222)">
                    <rect width="89" height="92" transform="translate(-277 222)"></rect>
                    <text transform="translate(-162 264)" font-size="18" font-family="Overpass-ExtraBold, Overpass"
                          font-weight="800">
                      <tspan x="0" y="0">FABRICA DE</tspan>
                      <tspan x="0" y="22">PROYECTOS</tspan>
                    </text>
                    <g transform="translate(-332 221)">
                      <g transform="translate(85 28)">
                        <path
                            d="M1650.617,578.187h.14a5.61,5.61,0,0,1,0,11.219l-3.488-.007v7.374h3.488a12.687,12.687,0,0,0,9.206-3.8,12.345,12.345,0,0,0,3.844-9.167,13.045,13.045,0,0,0-13.051-13.011h-.14Z"
                            transform="translate(-1630.178 -570.797)" fill="#fff"></path>
                        <path
                            d="M1605.753,570.8h-17.7v33.911h0v4.083l2.892,3.766a1.355,1.355,0,0,0,1.67,0l2.892-3.766V602.4h0v-5.628h6.9V594.6h-9.073v7.8h0v4.576a1.553,1.553,0,0,1-3.106,0v-5.983h0V572.97h13.769v3.044h-10.663v15.538l9.072.01v-2.168l-6.9-.012v-11.2h10.248Z"
                            transform="translate(-1588.052 -570.797)" fill="#ffca05" fill-rule="evenodd"></path>
                      </g>
                    </g>
                  </g>
                </svg>
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
