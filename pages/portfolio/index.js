import React, { useEffect, useState } from "react";
import { getSession, useSession } from "next-auth/client";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import {
  Card,
  Dropdown,
  DropdownButton,
  Col,
  Row,
  Button,
} from "react-bootstrap";
import {
  PlusSquareDotted,
  Images,
  ThreeDotsVertical,
  PencilSquare,
} from "react-bootstrap-icons";

//Components
import ModalForm from "../../components/ModalForm";
import FormObra from "../../components/FormObra/FormObra";
import Layout from "../../components/Layout/Layout";
import SpinnerCustom from "../../components/SpinnerCustom/SpinnerCustom";

// Services
import * as professionalService from "../../services/professionalService";
import * as buildingWorkService from "../../services/buildingWorkService";
import * as imageService from "../../services/imageService";

// Styles
import indexStyles from "./index.module.css";
import filteredImagesStyles from "../../components/FilteredImages/FilteredImages.module.css";
import image from "next/image";

const CustomButtonTogle = ({ id, editBuildingWork, imageSize }) => {
  const [dropdownOpen, setOpen] = useState(false);
  const toggle = () => setOpen((dropdownOpen) => !dropdownOpen);

  return (
    <>
      <Dropdown drop="left" align="end">
        <Dropdown.Toggle
          variant="light"
          id="dropdown-autoclose-true"
          className={indexStyles.afterLess}
        >
          <ThreeDotsVertical color={"dark"} size={25} />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Header>
            <Images
              className={`${filteredImagesStyles.heart}`}
              color={"white"}
              size={25}
            />
            {` ${imageSize} Photos`}
          </Dropdown.Header>
          <Dropdown.Divider />
          <Dropdown.Item
            onClick={() => {
              editBuildingWork(id);
            }}
          >
            <PencilSquare color={"red"} size={25} />
            {` Edit`}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};

const Portfolio = ({ professional, buildingWorks }) => {
  const [session] = useSession();
  const { t } = useTranslation("common");
  const [previewImage, setPreviewImage] = useState([]);
  const [images, setImages] = useState([]);
  const [localBuildingWorks, setLocalBuildingWorks] = useState([]);
  const [pageSize, setPageSize] = useState({ page: 0, size: 10 });
  const [buildingWorkId, setBuildingWorkId] = useState(null);

  const [buildingWorkData, setBuildingWorkData] = useState({
    defaultValues: {
      name: "",
      description: "",
    },
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [stateFormObra, setStateFormObra] = useState({
    post: false,
    put: false,
  });

  const toggleModal = () => setModalOpen(!modalOpen);

  const updateCardsBuildingWorks = async () => {
    let buildingWorks = [];
    setLoading(true);
    if (session) {
      let token = session.accessToken;
      let professionalId = session.user.id;
      let professional = await professionalService.getById(
        professionalId,
        token
      );
      if (professional) {
        buildingWorks = await buildingWorkService.getByProfessionalId(
          professional.id,
          pageSize.page,
          pageSize.size,
          token
        );
        setLocalBuildingWorks(buildingWorks);
        setLoading(false);
      }
    }
  };

  const onAddImagesToBuildingWork = async (folder, images) => {
    if (session) {
      const data = {
        images,
        id: folder.id,
      };

      try {
        let images = await imageService.addImagesToBuildingWork(
          data,
          session.accessToken
        );
        return images;
      } catch (error) {
        console.error(error);
      }
    }
  };

  // const onSetImagesToBuildingWork = async (folder, images) => {
  //   if (session) {
  //     const data = {
  //       images,
  //       id: folder.id,
  //     };
  //     try {
  //       let images = await imageService.setImagesToBuildingWork(
  //         data,
  //         session.accessToken
  //       );
  //       return images;
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }
  // };

  //subir imagen y cambiar los datos del nombre y la description
  const onSetbuildingWork = async (data, buildingWorkId) => {
    if (session) {
      try {
        const data2 = { name: data.name, description: data.description };
        await buildingWorkService.setFolder(
          buildingWorkId,
          data2,
          session.accessToken
        );
        data.id = buildingWorkId;
        await imageService.addPreviewImageToBuildingWork(
          data,
          session.accessToken
        );
        await buildingWorkService.removeAndAddImages(
          data.images,
          buildingWorkId,
          session.accessToken
        );
        return true;
      } catch (error) {
        console.error(error);
      }
    }
  };

  const onAddPreviewImageToBuildingWork = async (folder, previewImage) => {
    if (session) {
      const data = {
        previewImage,
        id: folder.id,
      };
      try {
        let image = await imageService.addPreviewImageToBuildingWork(
          data,
          session.accessToken
        );
        return image;
      } catch (error) {
        console.error(error);
      }
    }
  };

  const onAddbuildingWork = async (data) => {
    if (session) {
      try {
        let folder = await buildingWorkService.addFolder(
          { name: data.name, description: data.description, categories: data.categories },
          session.accessToken
        );
        if (folder) {
          let preview = await onAddPreviewImageToBuildingWork(
            folder,
            data.previewImage
          );
          if (data.images.length > 0) {
            let images = await onAddImagesToBuildingWork(folder, data.images);
          }
          updateCardsBuildingWorks();
          return true;
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const openModalBuilderWork = () => {
    setStateFormObra({
      post: true,
      put: false,
    });
    const defaultValues = {
      defaultValues: {
        name: "",
        description: "",
      },
    };
    setBuildingWorkData(defaultValues);
    setImages([]);
    setPreviewImage([]);
    toggleModal();
  };

  const editBuildingWork = async (id) => {
    setStateFormObra({
      post: false,
      put: true,
    });
    const [buildingWork] = localBuildingWorks.filter((d) => d.id == id);
    let copyBuildingWorkData = Object.assign({}, buildingWorkData);
    copyBuildingWorkData.defaultValues.name = buildingWork.name;
    copyBuildingWorkData.defaultValues.description = buildingWork.description;

    setBuildingWorkData(copyBuildingWorkData);

    let imagenes = await onEditGetBuildingWorks(id);

    imagenes.forEach(async (img, index) => {
      const imagen = await fetch(img.path, {
        headers: { Authorization: session.accessToken },
      });
      let blob = await imagen.blob();
      let file = new File([blob], `${img.path}`, {
        type: "image/jpg",
      });

      Object.assign(file, {
        preview: URL.createObjectURL(file),
      });
      img.preview = file.preview;
      img.added = true; //is already in the BD
      img.remove = false; //if I have to delete it or not as it comes from BD I don’t have to delete it
    });

    setImages(imagenes);

    const imagen = await fetch(buildingWork.previewImage);
    let blob = await imagen.blob();
    let file = new File([blob], `${buildingWork.previewImage}`, {
      type: "image/jpg",
    });

    Object.assign(file, {
      preview: URL.createObjectURL(file),
    });

    setPreviewImage([file]);
    setBuildingWorkId(id);
    toggleModal();
  };

  const onEditGetBuildingWorks = async (id) => {
    try {
      let dataImages = await imageService.getImagesByBuildingWorksId(
        id,
        pageSize.page,
        pageSize.size,
        session.accessToken
      );
      return dataImages;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(async () => {
    if (buildingWorks) {
      setLocalBuildingWorks(buildingWorks);
    }
  }, [buildingWorks]);

  const isState = (buildingWork) => {
    let statusColor;
    let ico;
    // if (product.status === "PENDING") {
    //   statusColor = `bg-warning text-dark`;
    //   ico = <ExclamationCircle className={`${statusColor}`} size={15} />;
    // }
    // if (product.status === "APPROVED") {
    //   statusColor = "bg-success";
    //   ico = <Check2Circle className={`${statusColor}`} size={15} />;
    // }
    // if (product.status === "REJECTED") {
    //   statusColor = `bg-danger`;
    //   ico = <XCircle className={`${statusColor}`} size={15} />;
    // }
    // return (
    //   <>
    //     <CardText className={`${indexStyles.itemStatus} ${statusColor} m-0`}>
    //       {ico}
    //       {t(product.status.toLowerCase())}
    //     </CardText>
    //   </>
    // );
  };

  const imagesCard = (
    <Row className="row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      {isLoading ? (
        <SpinnerCustom />
      ) : (
        localBuildingWorks.map((buildingWork, index) => (
          <Col key={index}>
            <Card className={`${filteredImagesStyles.colCard}`}>
              <Card.Body className="p-0">
                <Link
                  href={`/building/[id]`}
                  as={`/building/${buildingWork.name.replace(/\s+/g, "-")}-${
                    buildingWork.id
                  }`}
                >
                  <img
                    className={`${filteredImagesStyles.cardImage} cursor-pointer`}
                    src={buildingWork.previewImage}
                    alt="Professional preview"
                  />
                </Link>
                {isState(buildingWork)}
                <div className={`${filteredImagesStyles.cardText}`}>
                  <Col className="col-auto">
                    <img
                      className={`${indexStyles.imgProfile}`}
                      // src={buildingWork.entity.previewImage}
                    />
                  </Col>
                  <Col className={`col-auto`}>
                    <Card.Text
                      className={`${filteredImagesStyles.textShadowSm} fw-bold`}
                    >
                      {buildingWork.name}
                    </Card.Text>
                  </Col>
                  <Col
                    className={`col-auto ${filteredImagesStyles.containerHeart}`}
                  >
                    {session && (
                      <div>
                        <CustomButtonTogle
                          id={buildingWork.id}
                          editBuildingWork={editBuildingWork}
                          imageSize={buildingWork.countImages}
                        />
                      </div>
                    )}
                  </Col>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))
      )}
    </Row>
  );

  return (
    <Layout>
      <section className="container py-2">
        <Row className="row-cols-1">
          <Col>
            <img
              width={"100%"}
              height={"300px"}
              src={`${professional.backgroundImage}`}
              className={indexStyles.backgroundImg}
            />
            <div className={indexStyles.previewDiv}>
              <img
                src={professional.previewImage}
                className={indexStyles.previewImg}
              ></img>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="text-center">
              <h1>{professional.contact}</h1>
              <h1>{professional?.company?.name}</h1>
            </div>
          </Col>
        </Row>
        <Row className="row-cols-2 g-2">
          <Col className="col-auto">
            <Button variant="outline-primary" onClick={openModalBuilderWork}>
              <PlusSquareDotted size={100} />
            </Button>
          </Col>
          <Col className="col-12">{imagesCard}</Col>
        </Row>
        <ModalForm
          size={"xl"}
          fullscreen={"lg-down"}
          modalTitle={t("work-form")}
          className={"Button mt-50"}
          formBody={
            <FormObra
              onAddbuildingWork={onAddbuildingWork}
              onSetbuildingWork={onSetbuildingWork}
              toggle={toggleModal}
              buildingWorkData={buildingWorkData}
              previewImage={previewImage}
              setPreviewImage={setPreviewImage}
              images={images}
              setImages={setImages}
              changeState={{ stateFormObra, function: setStateFormObra }}
              buildingWorkId={buildingWorkId}
            />
          }
          modalOpen={{ open: modalOpen, function: setModalOpen }}
        />
      </section>
    </Layout>
  );
};

export async function getServerSideProps({ params, req, res, locale }) {
  // Get the user's session based on the request
  const session = await getSession({ req });

  if (
    !session ||
    !session.authorities.includes(process.env.NEXT_PUBLIC_ROLE_PROFESSIONAL)
  ) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  let token;
  let professionalId;
  let professional = [];
  let buildingWorks = [];
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
      professionalId = session.user.id;
      professional = await professionalService.getById(professionalId, token);
      if (professional) {
        buildingWorks = await buildingWorkService.getByProfessionalId(
          professional.id,
          page,
          size,
          token
        );
      }
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
      professional,
      buildingWorks,
    },
  };
}

export default Portfolio;
