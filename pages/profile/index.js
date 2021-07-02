import React, { useState } from "react";
import useTranslation from "next-translate/useTranslation";
import ProfileData from "../../components/ProfileData/ProfileData";
import { getSession, useSession } from "next-auth/client";
import Layout from "../../components/Layout/Layout";

// Services
import * as professionalService from "../../services/professionalService";
import * as companyService from "../../services/companyService";
import { getLikePhotos } from "../../services/imageService";

// Components
import SeeImagesLiked from "../../components/SeeImagesLiked/SeeImagesLiked";

const Profile = ({ data, imagesLiked }) => {
  const [session] = useSession();
  const { t } = useTranslation("common");
  const [error, setError] = useState("");

  const saveProfessional = async (data, token) => {
    try {
      const professionalToken = await professionalService.become(data, token);

      return professionalToken;
    } catch (error) {
      console.error(error);
      setError(`${t("email-is-already-exist-please-write-another-one")}`);
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

  const onBuyPlan = async (plan) => {
    await professionalService.buyPlan(plan, session.accessToken);
  };

  return (
    <Layout title={`${t("header.profile")}`}>
      <ProfileData
        onBecomeProfessional={onBecomeProfessional}
        error={error}
        setError={setError}
        data={data}
        onBuyPlan={onBuyPlan}
      />
      <SeeImagesLiked imagesLiked={imagesLiked} />
    </Layout>
  );
};
export async function getServerSideProps({ params, req, res, locale }) {
  // Get the user's session based on the request
  const session = await getSession({ req });

  let token;
  let companies = [];
  let imagesLiked = [];
  let { page, size } = req.__NEXT_INIT_QUERY;

  if (!page || page <= 0) {
    page = 0;
  }
  if (!size || size <= 0) {
    size = process.env.NEXT_PUBLIC_SIZE_PER_PAGE;
  }

  if (session) {
    token = session.accessToken;
    companies = await companyService.findAll(page, size, token);
    imagesLiked = await getLikePhotos(page, size, token);
  }

  return {
    props: {
      data: companies,
      imagesLiked,
    },
  };
}

export default Profile;
