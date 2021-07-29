import React, { useEffect, useState } from "react";
import { getSession, useSession } from "next-auth/client";
import { Person, Briefcase, Gear, Building } from "react-bootstrap-icons";
import RolProfileStyle from "./RolProfile.module.css";
import useTranslation from "next-translate/useTranslation";

const initialAuthoritiesKey = [
  { id: 0, name: `${process.env.NEXT_PUBLIC_ROLE_ADMINITRATOR}` },
  { id: 1, name: `${process.env.NEXT_PUBLIC_ROLE_COMPANY}` },
  { id: 2, name: `${process.env.NEXT_PUBLIC_ROLE_PROFESSIONAL}` },
  { id: 3, name: `${process.env.NEXT_PUBLIC_ROLE_USER}` },
];

const RolProfile = () => {
  const [authoritiesKey, setAuthoritiesKey] = useState(initialAuthoritiesKey);

  const [session] = useSession();
  const { t } = useTranslation("common");

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
              {` `}
              {camelizeFirstLetterAndTranslate(authoritiesKey[2].name.split("_")[1])}
            </>
          );
          break;
        case 1:
          icoProfile = (
            <>
              <Building size={25} />
              {` `}
              {camelizeFirstLetterAndTranslate(authoritiesKey[1].name.split("_")[1])}
            </>
          );
          break;
        case 0:
          icoProfile = (
            <>
              <Gear className={`${RolProfileStyle.rotate}`} size={25} />
              {` `}
              {camelizeFirstLetterAndTranslate(authoritiesKey[0].name.split("_")[1])}
            </>
          );
          break;
        default:
          icoProfile = (
            <>
              <Person size={25} />
              {` `}
              {camelizeFirstLetterAndTranslate(authoritiesKey[3].name.split("_")[1])}
            </>
          );
          break;
      }
      return icoProfile;
    }
  };

  const camelizeFirstLetterAndTranslate = (str) => {
    let word = str.toLowerCase();
    let wordTraslated = t(word);
    let result = wordTraslated.charAt(0).toUpperCase() + wordTraslated.slice(1);
    return result;
  };

  return <div>{getRole()}</div>;
};

export default RolProfile;
