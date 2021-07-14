import React, { useState } from "react";
import {
  Nav,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

import useTranslation from "next-translate/useTranslation";
import { useSession } from "next-auth/client";
import Link from "next/link";

import HeaderStyle from "./Header.module.css";

export default function Header() {
  const [session, loading] = useSession();
  const { t } = useTranslation("common");

  const isRole = (role) => {
    if (session) {
      return session.authorities.includes(role);
    }
  };

  return (
    <>
      <Nav
        className={`w-100 justify-content-start  justify-content-md-center`}
        navbar
      >
        <UncontrolledDropdown nav inNavbar>
          <DropdownToggle nav caret>
            {t("professional")}
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem>
              <Link href="/professional">
                <NavLink>{t("professional")}</NavLink>
              </Link>
            </DropdownItem>

            <DropdownItem>
              <Link href="/companies">
                <NavLink>{t("company")}</NavLink>
              </Link>
            </DropdownItem>

            <DropdownItem divider />
            <DropdownItem>Reset</DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>

        <UncontrolledDropdown nav inNavbar>
          <DropdownToggle nav caret>
            {t("project")}
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem>
              <Link href="/project">
                <NavLink>{t("project")}</NavLink>
              </Link>
            </DropdownItem>
            <DropdownItem>Option 2</DropdownItem>
            <DropdownItem divider />
            <DropdownItem>Reset</DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
        <UncontrolledDropdown nav inNavbar>
          <DropdownToggle nav caret>
            {t("magazine")}
          </DropdownToggle>
          <DropdownMenu right>
            <DropdownItem>
              <Link href="/magazine">
                <NavLink>{t("magazine")}</NavLink>
              </Link>
            </DropdownItem>
            <DropdownItem>Option 2</DropdownItem>
            <DropdownItem divider />
            <DropdownItem>Reset</DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
        <Link href="/about">
          <NavLink className={`${HeaderStyle.pointer}`}>
            {t("about-us")}
          </NavLink>
        </Link>
        <Link href="/contact">
          <NavLink className={`${HeaderStyle.pointer}`}>{t("contact")}</NavLink>
        </Link>
        {isRole("ROLE_ADMINISTRATOR") && (
          <UncontrolledDropdown nav inNavbar>
            <DropdownToggle nav caret>
              {t("administrator")}
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem>
                <Link href="/admin/company">
                  <NavLink>{t("company")}</NavLink>
                </Link>
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem>
                <Link href="/admin/professional">
                  <NavLink>{t("professional")}</NavLink>
                </Link>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        )}
      </Nav>
    </>
  );
}
