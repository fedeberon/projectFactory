import React, { useState } from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import Authentication from "./Authentication";
import { useRouter } from "next/dist/client/router";

const Link = ({ children, href }) => {
  const router = useRouter();
  return (
    <NavLink
      href="#"
      onClick={(e) => {
        e.preventDefault();
        // typically you want to use `next/link` for this usecase
        // but this example shows how you can also access the router
        // and use it manually
        router.push(href);
      }}
    >
      {children}
    </NavLink>
  );
};

export default function Header() {
  const [dropdown, setDropdown] = useState(false);

  const toggle = () => setDropdown((dropdown) => !dropdown);

  return (
    <Navbar color="light" light expand="md">
      <Link href="/"> Home</Link>
      <NavbarToggler onClick={toggle} />
      <Collapse isOpen={dropdown} navbar>
        <Nav navbar>
          <UncontrolledDropdown nav inNavbar>
            <DropdownToggle nav caret>
              Professional
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem>
                <Link href="/professional">Professional</Link>
              </DropdownItem>
              <DropdownItem>Option 2</DropdownItem>
              <DropdownItem divider />
              <DropdownItem>Reset</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
          <UncontrolledDropdown nav inNavbar>
            <DropdownToggle nav caret>
              Project
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem>
                {/* <Link href="/project" passHref> */}
                <Link href="/project">Project</Link>
                {/* project */}
                {/* </Link> */}
              </DropdownItem>
              <DropdownItem>Option 2</DropdownItem>
              <DropdownItem divider />
              <DropdownItem>Reset</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
          <UncontrolledDropdown nav inNavbar>
            <DropdownToggle nav caret>
              Magazine
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem>
                <Link href="/magazine">Magazine</Link>
              </DropdownItem>
              <DropdownItem>Option 2</DropdownItem>
              <DropdownItem divider />
              <DropdownItem>Reset</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
          <NavItem>
            <Link href="/about">About</Link>
          </NavItem>
          <NavItem>
            <Link href="/contact">Contact</Link>
          </NavItem>
        </Nav>
      </Collapse>
      <Authentication />
    </Navbar>
  );
}
