import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import ProfileData from "../../components/ProfileData";
import { useSession } from "next-auth/client";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Layout from "../../components/Layout/Layout";

// Services
import * as professionalService from "../../services/professionalService";

const Profile = () => {
  const [session] = useSession();
  const { t, lang } = useTranslation("common");
  const [error, setError] = useState("");

  const saveProfessional = async (data, token) => {
    try {
      const professionalToken = await professionalService.become(data, token);

      return professionalToken;
    } catch (error) {
      console.error(error);
      setError(`${t("EmailIsAlreadyExistPleaseWriteAnotherOne")}`);
      return null;
    }
  };

  const savePreviewImage = async (token, previewImage) => {
    try {
      await professionalService.addPreviewImage(previewImage, token);
    } catch (error) {
      console.error(error);
    }
  };

  const saveImages = async (images, token) => {
    try {
      await professionalService.addImages(images, token);
    } catch (error) {
      console.error(error);
    }
  };

  const saveBackgroundImage = async (token, backgroundImage) => {
    try {
      await professionalService.addBackgroundImage(backgroundImage, token);
    } catch (error) {
      console.error(error);
    }
  };

  const onBecomeProfessional = async (data) => {
    const previewImage = data.previewImage;
    const backgroundImage = data.backgroundImage;
    const images = data.images;
    delete data.previewImage;
    delete data.backgroundImage;
    delete data.images;

    const token = await saveProfessional(data, session?.accessToken);

    if (token != null) {
      if (previewImage) {
        await savePreviewImage(token, previewImage);
      }
      if (backgroundImage) {
        await saveBackgroundImage(token, backgroundImage);
      }
      if (images.length > 0) {
        await saveImages(images, token);
      }
    }

    return token;
  };

  return (
    <Layout title={`${t("Profile")}`}>
      <ProfileData
        onBecomeProfessional={onBecomeProfessional}
        error={error}
        setError={setError}
      />
    </Layout>
  );
};

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

export default Profile;
