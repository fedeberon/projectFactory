import React, { useEffect, useState } from "react";
import { getSession, useSession } from "next-auth/client";
import { Person, Briefcase, Gear } from "react-bootstrap-icons";

const initialAuthoritiesKey = [
  { id: 0, name: `${process.env.NEXT_PUBLIC_ROLE_ADMINITRATOR}` },
  { id: 1, name: `${process.env.NEXT_PUBLIC_ROLE_COMPANY}` },
  { id: 2, name: `${process.env.NEXT_PUBLIC_ROLE_PROFESSIONAL}` },
  { id: 3, name: `${process.env.NEXT_PUBLIC_ROLE_USER}` },
];

const RolProfile = () => {
  const [authoritiesKey, setAuthoritiesKey] = useState(initialAuthoritiesKey);

  const [session] = useSession();

  const getKey = (role) => {
    let select = authoritiesKey[authoritiesKey.length - 1].id;
    let min = 0;
    authoritiesKey.map((authoritie) => {
      if (authoritie.name === role) {
        min = authoritie.id;
        if (select > min) {
          select = min;
        }
      }
    });
    return select;
  };

  const getRole = () => {
    if (session) {
      let roleChoised;
      let min = 3;
      session.authorities.map((role) => {
        roleChoised = getKey(role);
        if (roleChoised < min) {
          min = roleChoised;
        }
      });
      let icoProfile;
      switch (min) {
        case 2:
          icoProfile = (
            <>
              <Briefcase size={25} />
              {authoritiesKey[2].name}
            </>
          );
          break;
        case 0:
          icoProfile = (
            <>
              <Gear size={25} />
              {authoritiesKey[0].name}
            </>
          );
          break;
        default:
          icoProfile = (
            <>
              <Person size={25} />
              {authoritiesKey[3].name}
            </>
          );
          break;
      }
      return icoProfile;
    }
  };

  return <div>{getRole()}</div>;
};

export default RolProfile;
