import React, {useState} from "react";
import { useRouter } from "next/router";
import{  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem} from 'reactstrap';
import Authentication from './Authentication';

export default function Header() {
  const[dropdown, setDropdown] =useState(false);

  const toggle = () => setDropdown(dropdown => !dropdown);
 
 
  return (
    <div>
    <Navbar color="light" light expand="md">
      <NavbarBrand nav>
        <NavLink href="/">
          Home
        </NavLink>
      </NavbarBrand>
      <NavbarToggler onClick={toggle} />
      <Collapse isOpen={dropdown} navbar>
        <Nav navbar>
          <UncontrolledDropdown nav inNavbar>
            <DropdownToggle nav caret>
              Professional
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem>
                <NavLink href="/professional">
                  Professional
                </NavLink>
              </DropdownItem>
              <DropdownItem>
                Option 2
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem>
                Reset
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
          <UncontrolledDropdown nav inNavbar>
            <DropdownToggle nav caret>
              Project
            </DropdownToggle>
            <DropdownMenu >
              <DropdownItem>
                <NavLink href="/project">
                  Project
                </NavLink>
              </DropdownItem>
              <DropdownItem>
                Option 2
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem>
                Reset
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
          <UncontrolledDropdown nav inNavbar>
            <DropdownToggle nav caret>
              Magazine
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem>
                <NavLink href="/magazine">
                  Magazine
                </NavLink>
              </DropdownItem>
              <DropdownItem>
                Option 2
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem>
                Reset
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
          <NavItem>
            <NavLink href="/about">
              About
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/contact">
              Contact
            </NavLink>
          </NavItem>
        </Nav>
      </Collapse>
      <Authentication/>
    </Navbar>
  </div>
  );
}

