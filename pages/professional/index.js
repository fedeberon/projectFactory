import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { professionalActions } from "../../store";
import { getSession, useSession } from "next-auth/client";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "react-i18next";
import {
  Col,
  Container,
  Row,
  Card,
  Button,
  CardImg,
  CardText,
  CardBody,
  CardDeck,
} from "reactstrap";

// Components
import FormProfessional from "../../components/FormProfessional";
import Header from "../../components/Header";
import ModalForm from "../../components/ModalForm";
import FilterList from "../../components/FilterList/FilterList";

// Services
import * as professionalService from "../../services/professionalService";
import * as tagService from "../../services/tagService";
import * as imageService from "../../services/imageService";

// Styles
import indexStyles from './index.module.css';
import FilteredImages from "../../components/FilteredImages/FilteredImages";

const Professional = ({ data, filters }) => {
  const [session] = useSession();
  const [filteredImages, setFilteredImages] = useState([]);
  const [appliedFilters, setAppliedFilters] = useState([]);
  const [showProfessionals, setShowProfessionals] = useState(false);
  
  const dispatch = useDispatch();
  const router = useRouter();
  const professionals = useSelector((state) =>
    Object.values(state.professionals.items)
  );

  const { t, lang } = useTranslation("common");

  

  useEffect(() => {
    dispatch(professionalActions.store(data));
  }, [data]);

  useEffect(async () => {
    if (appliedFilters.length > 0) {
      let page = 0;
      let size = 10;
      const images = await imageService.getProfessionalImagesByTags(appliedFilters, page, size, session?.accessToken);
      setFilteredImages(images);
    }
  }, [appliedFilters]);


  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <Container fluid>
      <Header lang={lang} />
      <h1>{t("Professional")}</h1>
      <aside className={indexStyles.aside}>
        <FilterList filters={filters} appliedFilters={appliedFilters} setAppliedFilters={setAppliedFilters}/>
      </aside>

      <FilteredImages images={filteredImages}/>
    </Container>
  );
};

export async function getServerSideProps({ params, req, res, locale }) {
  // Get the user's session based on the request
  const session = await getSession({ req });

  let token;
  let professionals = [];
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
    professionals = await professionalService.findAll(page, size, token);
    filters = await tagService.findAll(token);
  }

  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      data: professionals,
      filters : filters,
    },
  };
}

export default Professional;