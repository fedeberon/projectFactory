// Frameworks
import React, { useEffect, useState } from "react";
import { getSession, useSession } from "next-auth/client";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "react-i18next";
import { Button, Col, Row } from "reactstrap";

// Components
import FilterList from "../components/FilterList/FilterList";
import FilteredImages from "../components/FilteredImages/FilteredImages";
import FormProfessional from "../components/FormProfessional";
import ModalForm from "../components/ModalForm";
import Layout from "../components/Layout";
import CarouselBanner from "../components/CustomCarousel/CarouselBanner";

// Services
import * as professionalService from "../services/professionalService";
import * as tagService from "../services/tagService";
import * as imageService from "../services/imageService";

// Styles
import styles from "../styles/Home.module.css";
import CarouselImageCreator from "../components/CarouselImageCreator";

const Code = (p) => <code className={styles.inlineCode} {...p} />;

const items = [
  {
    path: 'https://i.pinimg.com/originals/82/22/cf/8222cfbd3f5c5b8cc8d6de8a83c275e1.jpg',
    name: 'Slide 1',
  },
  {
    path: 'https://images.adsttc.com/media/images/5128/abe0/b3fc/4b11/a700/4c79/newsletter/1285434474-house-in-menorca-dom-arquitectura----dom-arquitectura.jpg?1414370585',
    name: 'Slide 2',
  },
];

const Home = ({filters}) => {
  const [session] = useSession();
  const [modalOpen, setModalOpen] = useState(false);
  const [filteredImages, setFilteredImages] = useState([]);
  const [appliedFilters, setAppliedFilters] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState({ page: 0, size: 10 });

  const [error, setError] = useState("");

  const { t, i18n } = useTranslation("common");

  const toggleModal = () => setModalOpen(!modalOpen);

  useEffect(async () => {
    const images = await getProfessionalsByTags();
    if (images) {
      setFilteredImages(images);
    }
  }, [appliedFilters]);

  const getProfessionalsByTags = async () => {
    try {
      return await imageService.getProfessionalImagesByTags(
        appliedFilters,
        pageSize.page,
        pageSize.size,
        session?.accessToken
      );
    } catch (error) {
      console.error(error);
    }
  };

  const saveProfessional = async (data) => {
    try {
      const professional = await professionalService.addProfessional(
        data,
        session?.accessToken
      );
      return professional;
    } catch (error) {
      console.error(error);
      setError(`${t("EmailIsAlreadyExistPleaseWriteAnotherOne")}`);
      return null;
    }
  };

  const savePreviewImage = async (professional, previewImage) => {
    try {
      await professionalService.addPreviewImage(
        previewImage,
        professional.id,
        session.accessToken
      );
      professional.previewImage = URL.createObjectURL(previewImage);
    } catch (error) {
      console.error(error);
    }
  };

  const saveImages = async (images, professional) => {
    try {
      await professionalService.addImages(
        images,
        professional.id,
        session.accessToken
      );
    } catch (error) {
      console.error(error);
    }
  };

  const saveBackgroundImage = async (professional, backgroundImage) => {
    try {
      await professionalService.addBackgroundImage(
        backgroundImage,
        professional.id,
        session.accessToken
      );
      professional.backgroundImage = URL.createObjectURL(backgroundImage);
    } catch (error) {
      console.error(error);
    }
  };

  const onAddProfessional = async (data) => {
    setLoading(true);
    const previewImage = data.previewImage;
    const backgroundImage = data.backgroundImage;
    const images = data.images;

    const professional = await saveProfessional(data);

    if (professional != null) {
      if (previewImage) {
        await savePreviewImage(professional, previewImage);
      }
      if (backgroundImage) {
        await saveBackgroundImage(professional, backgroundImage);
      }
      if (images.length > 0) {
        await saveImages(images, professional);
      }
    }
    setLoading(false);
    return professional;
  };

  return (
    <Layout title={`${t("WelcomeTo")} ${process.env.NEXT_PUBLIC_PROJECT_NAME}`}>
      {session && (
        <Button
          className="position-fixed bottom-0 end-0 me-3 mb-3 rounded-circle zIndex"
          color="danger"
          onClick={toggleModal}
        >
          +
        </Button>
      )}
      <CarouselImageCreator/>
      <ModalForm
        modalTitle={t("FORM PROFESSIONAL")}
        className={"Button mt-50"}
        formBody={
          <FormProfessional
            onAddProfessional={onAddProfessional}
            toggle={toggleModal}
            error={error}
            setError={setError}
          />
        }
        modalOpen={{ open: modalOpen, function: setModalOpen }}
      />
      <CarouselBanner images={items}/>
      <Row>
        <Col xs={12} md={3} xl={2}>
          <aside>
            <FilterList
              filters={filters}
              appliedFilters={appliedFilters}
              setAppliedFilters={setAppliedFilters}
            />
          </aside>
        </Col>
        <Col xs={12} md={9} xl={10}>
          <FilteredImages isLoading={isLoading} images={filteredImages} />
        </Col>
      </Row>
    </Layout>
  );
};

export async function getServerSideProps({ params, req, res, locale }) {
  // Get the user's session based on the request
  const session = await getSession({ req });

  let token;
  let filters = [];
  let { page, size } = req.__NEXT_INIT_QUERY;

  if (!page || page <= 0) {
    page = 0;
  }
  if (!size || size <= 0) {
    size = process.env.NEXT_PUBLIC_SIZE_PER_PAGE;
  }

  if (session) {
    token = session.accessToken;
    filters = await tagService.findAll(token);
  }

  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      filters: filters,
    },
  };
}

export default Home;
