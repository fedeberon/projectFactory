// Frameworks
import React, { useEffect, useState } from "react";
import { getSession, useSession } from "next-auth/client";
import useTranslation from "next-translate/useTranslation";
import { Col, Row, Button } from "react-bootstrap";
import { PlusSquareDotted, PersonCircle } from "react-bootstrap-icons";

// Components
import ModalForm from "../../components/ModalForm";
import FormObra from "../../components/FormObra/FormObra";
import Layout from "../../components/Layout/Layout";
import BackgroundDefault from "../../components/BackgroundDefault/BackgroundDefault";
import ImagesGroup from "../../components/ImagesGroup/ImagesGroup";

// Services
import * as professionalService from "../../services/professionalService";
import * as buildingWorkService from "../../services/buildingWorkService";
import * as imageService from "../../services/imageService";

// Styles
import indexStyles from "./index.module.css";
import SpinnerCustom from "../../components/SpinnerCustom/SpinnerCustom";

const Portfolio = ({ professional, buildingWorks, session }) => {
  // const [session] = useSession();
  const { t } = useTranslation("common");
  const [previewImage, setPreviewImage] = useState([]);
  const [images, setImages] = useState([]);
  const [localBuildingWorks, setLocalBuildingWorks] = useState(buildingWorks);
  const [pageSize, setPageSize] = useState({ page: 1, size: 3 });
  const [paginationMultipleImage, setPaginationMultipleImage] = useState({
    page: 0,
    size: 100,
  });
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
    let newBuildingWorks = {
      buildingWorks: [],
      count: 0,
    };
    setLoading(true);
    if (session) {
      try {
        let token = session.accessToken;
        let professionalId = session.user.id;
        let professional = await professionalService.getById(
          professionalId,
          token
        );
        if (professional) {
          // resetPage();
          newBuildingWorks = await buildingWorkService.getByProfessionalId(
            professional.id,
            pageSize.page,
            pageSize.size,
            token
          );

          // const newBuildingWorks = buildingWorks.filter(
          //   (buildingWork) =>
          //     !localBuildingWorks.some((local) => local.id === buildingWork.id)
          // );

          const count = await getTotalBuildingWorksByProfessional();
          const endArray = newBuildingWorks[newBuildingWorks.length - 1];
          const buildingWorks = {
            buildingWorks: endArray
          }

          if (count.count) {
            setLocalBuildingWorks({
              ...localBuildingWorks,
              buildingWorks: [
                ...localBuildingWorks.buildingWorks,
                // ...buildingWorks.buildingWorks,
                ...buildingWorks.buildingWorks,
              ],
              count: count.count,
            });
          }
          // setLocalBuildingWorks({
          //   buildingWorks: buildingWorks,
          //   count,
          // });

          // setLocalBuildingWorks({
          //   ...localBuildingWorks,
          //   buildingWorks: [
          //     ...localBuildingWorks.buildingWorks,
          //     ...buildingWorks.buildingWorks,
          //   ],
          // });

          setLoading(false);
        }
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    }
  };

  const getTotalBuildingWorksByProfessional = async () => {
    try {
      const count = await buildingWorkService.getCountByProfessional(
        session.user.id
      );
      return count;
    } catch (error) {
      console.error(error);
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
          {
            name: data.name,
            description: data.description,
            categories: data.categories,
          },
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
          // const newBuildingWork = await buildingWorkService.getById(folder.id);F
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
    const [buildingWork] = localBuildingWorks.buildingWorks.filter(
      (d) => d.id == id
    );
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
        paginationMultipleImage.page,
        paginationMultipleImage.size,
        session.accessToken
      );
      return dataImages;
    } catch (error) {
      console.error(error);
    }
  };

  // useEffect(async () => {
  //   if (buildingWorks) {
  //     setLocalBuildingWorks(buildingWorks);
  //   }
  // }, [buildingWorks]);

  useEffect(() => {
    console.log(localBuildingWorks);
  }, [localBuildingWorks])

  const onGetByProfessionalId = async () => {
    // setLoading(true);
    try {
      if (session) {
        const buildingWorks = await buildingWorkService.getByProfessionalId(
          professional.id,
          pageSize.page,
          pageSize.size,
          session.accessToken
        );

        // setLoading(false);
        return buildingWorks;
      }
    } catch (error) {
      console.error(error);
      // setLoading(false);
    }
  };

  useEffect(async () => {
    const buildingWorks = await onGetByProfessionalId();
    // const buildingWorks = {
    //   buildingWorks: images,
    // };
    if (images) {
      // setLocalBuildingWorks([...localBuildingWorks, ...images]);
      setLocalBuildingWorks({
        ...localBuildingWorks,
        buildingWorks: [
          ...localBuildingWorks.buildingWorks,
          ...buildingWorks.buildingWorks,
        ],
      });
    }
  }, [pageSize]);

  const resetPage = () => {
    const { page } = { page: 0 };
    setPageSize({ ...pageSize, page });
  };

  const changePage = () => {
    const { page } = { page: pageSize.page + 1 };
    setPageSize({ ...pageSize, page });
  };

  const fetchMoreData = () => {
    changePage();
  };

  return (
    <Layout>
      <section className="container py-2">
        <Row className="row-cols-1">
          <Col>
            {professional.backgroundImage ? (
              <img
                width={"100%"}
                height={"300px"}
                src={`${professional.backgroundImage}`}
                className={indexStyles.backgroundImg}
              />
            ) : (
              <BackgroundDefault image={false} />
            )}
            <div className={indexStyles.previewDiv}>
              {professional.previewImage ? (
                <img
                  src={professional.previewImage}
                  className={indexStyles.previewImg}
                ></img>
              ) : (
                // <BackgroundDefault className={indexStyles.previewImg}/>
                <div className={indexStyles.previewImg}>
                  <PersonCircle size={"100%"} />
                </div>
              )}
              {/* <img
                src={professional.previewImage}
                className={indexStyles.previewImg}
              ></img> */}
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="text-center">
              <h1 className="text-break">{professional.contact}</h1>
              <h1 className="text-break">{professional?.company?.name}</h1>
            </div>
          </Col>
        </Row>
        <Row className="row-cols-1 gap-4">
          <Col className="col-auto mx-auto mx-md-0">
            <Button variant="outline-primary" onClick={openModalBuilderWork}>
              <PlusSquareDotted size={100} />
            </Button>
          </Col>
          <Col className="col-12">
            {localBuildingWorks.buildingWorks.length > 0 && (
              <ImagesGroup
                isLoading={isLoading}
                localBuildingWorks={localBuildingWorks}
                editBuildingWork={editBuildingWork}
                fetchMoreData={fetchMoreData}
                profileHidden={true}
                getTotalBuildingWorks={getTotalBuildingWorksByProfessional}
              />
            )}
          </Col>
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
  let count = 0;
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
          3,
          token
        );
        // count = await buildingWorkService.getCountByProfessional(
        //   professionalId
        // );
      }
    }
  } catch (e) {
    console.error(e);
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

      // buildingWorks: {
      //   buildingWorks: buildingWorks,
      //   count: count.count,
      // },
      session,
    },
  };
}

export default Portfolio;
