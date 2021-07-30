import React, { useEffect, useState } from "react";
import useTranslation from "next-translate/useTranslation";
import styles from "./MercadopagoButton.module.css";
import { useSession } from "next-auth/client";

const MercadopagoButton = () => {
  const { t } = useTranslation("common");
  const [session] = useSession();
  const [linkToMercadopago, setLinkToMercadopago] = useState("");

  const getLinkToMercadopago = () => {
    return `https://auth.mercadopago.com.ar/authorization?client_id=${process.env.NEXT_PUBLIC_MERCADOPAGO_CLIENT_ID}&response_type=code&state=${getState()}&platform_id=mp&redirect_uri=${process.env.NEXT_PUBLIC_MERCADOPAGO_REDIRECT_URI}`;
  };

  const getState = () => {
    return `${uuidv4()}=${session.user.id}`;
  };

  const uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  useEffect(() => {
    if (session) {
      setLinkToMercadopago(getLinkToMercadopago());
    }
  }, [session]);

  return (
    
    <a className={styles.btnLinkAccount} href={linkToMercadopago}>
      {t("link-account-to-mercadopago")}
    </a>
  );
};

export default MercadopagoButton;
