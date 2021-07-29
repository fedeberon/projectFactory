import React, { useState, useEffect } from "react";
import useTranslation from "next-translate/useTranslation";
import ProfileData from "../../components/ProfileData/ProfileData";
import { getSession, useSession } from "next-auth/client";
import Layout from "../../components/Layout/Layout";

// Services
import * as professionalService from "../../services/professionalService";
import * as companyService from "../../services/companyService";
import * as imageService from "../../services/imageService";

// Components
import SeeImagesLiked from "../../components/SeeImagesLiked/SeeImagesLiked";

const Profile = ({ data, imagesLiked, status }) => {
  const [session] = useSession();
  const { t } = useTranslation("common");
  const [error, setError] = useState("");

  const saveProfessional = async (data) => {
    try {
      const professionalToken = await professionalService.become(
        data,
        session.accessToken
      );

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

  const saveBackgroundImage = async (token, backgroundImage) => {
    try {
      await professionalService.addBackgroundImage(backgroundImage, token);
    } catch (error) {
      console.error(error);
    }
  };

  const onBecomeProfessional = async (data) => {
    const company = { id: data.company.id };
    const category = { id: data.category.id };
    data.company = company;
    data.category = category;
    const previewImage = data.previewImage;
    const backgroundImage = data.backgroundImage;
    delete data.previewImage;
    delete data.backgroundImage;
    delete data.images;
    const token = await saveProfessional(data);

    if (token != null) {
      if (previewImage) {
        await savePreviewImage(token, previewImage);
      }
      if (backgroundImage) {
        await saveBackgroundImage(token, backgroundImage);
      }
    }
    await professionalService.updateToken(token, session.user.id);
    return token;
  };

  const onBuyPlan = async (plan) => {
    const mp = new MercadoPago(process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY, {
      locale: "es-AR",
    });

    const preference = await professionalService.generatePreferenceForToken(
      plan,
      session.accessToken
    );
    mp.checkout({
      preference: preference.id,
    });

    const link = document.createElement("a");
    document.body.appendChild(link);
    link.href = preference.initPoint;
    link.setAttribute("type", "hidden");
    link.click();
  };

  return (
    <Layout title={`${t("header.profile")}`}>
      <section className="container py-2">
        <ProfileData
          onBecomeProfessional={onBecomeProfessional}
          error={error}
          setError={setError}
          data={data}
          onBuyPlan={onBuyPlan}
          status={status}
        />
        <SeeImagesLiked imagesLiked={imagesLiked} />
      </section>
    </Layout>
  );
};
export async function getServerSideProps({ params, req, query, res, locale }) {
  // Get the user's session based on the request
  const session = await getSession({ req });

  if (
    !session ||
    !session.authorities.includes(process.env.NEXT_PUBLIC_ROLE_USER)
  ) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  if (session.authorities.includes(process.env.NEXT_PUBLIC_ROLE_COMPANY)) {
    return {
      redirect: {
        destination: `/companies/${session.user.name
          .replace(/\s+/g, "-")
          .toLowerCase()}-${session.user.id}`,
        permanent: false,
      },
    };
  }

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
  try {
    if (session) {
      token = session.accessToken;
      companies = await companyService.findAll("APPROVED", page, size, token);
      imagesLiked = await imageService.getLikePhotos(page, size, token);
    }
  } catch (e) {
    return {
      redirect: {
        destination: "/logIn?expired",
        permanent: false,
      },
    };
  }

  return {
    props: {
      data: companies,
      imagesLiked,
      status: query.status ? query.status : "",
    },
  };
}

export default Profile;
