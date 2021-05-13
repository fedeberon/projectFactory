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
      {/* <Link href="/">Home</Link>
      <Link href="/professional">Professional</Link>
      <Link href="/professional/12-details" as="/">Professional/12-details</Link>
      <Link href="/project">Project</Link>
      <Link href="/project/21" as="/project/sarasa">Project/21-sarasa</Link>
      <Link href="/magazine">Magazine</Link>
      <Link href="/magazine/31" as="/magazine/sarasa3">Magazine/31-sarasa</Link>
      <Link href="/about">About</Link>
      <Link href="/contact">Contact</Link>
    </div>
  );
}

const Link = ({ children, href }) => {
  const router = useRouter();
  return (
    <a
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
      <style jsx>{`
        a {
          margin-right: 10px;
        }
      `}</style>
    </a>
  );
}; */}
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

