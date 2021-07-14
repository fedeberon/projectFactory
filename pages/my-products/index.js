import React, { useEffect, useState } from "react";
import { getSession, useSession } from "next-auth/client";
import useTranslation from "next-translate/useTranslation";
import Layout from "../../components/Layout/Layout";
import * as productService from "../../services/productService";
import ModalForm from "../../components/ModalForm";
import Link from "next/link";
import {
    ButtonDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Card,
    CardDeck,
    Col,
    Row,
    Button,
    CardBody,
    CardText,
} from "reactstrap";

import FormProduct from "../../components/FormProduct/FormProduct";

import {
    PlusSquareDotted,
    Images,
    ThreeDotsVertical,
    PencilSquare,
} from "react-bootstrap-icons";
import indexStyles from "./index.module.css";
import filteredImagesStyles from "../../components/FilteredImages/FilteredImages.module.css";
import image from "next/image";
import * as imageService from "../../services/imageService";

const CustomButtonTogle = ({ id, editProduct }) => {
  const [dropdownOpen, setOpen] = useState(false);
  const toggle = () => setOpen((dropdownOpen) => !dropdownOpen);
  return (
    <ButtonDropdown direction="left" isOpen={dropdownOpen} toggle={toggle}>
      <DropdownToggle outline color="light">
        <ThreeDotsVertical color={"dark"} size={25} />
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem
          onClick={() => {
            editProduct(id);
          }}
        >
          <PencilSquare color={"red"} size={25} />
          {` Edit`}
        </DropdownItem>
      </DropdownMenu>
    </ButtonDropdown>
  );
};

const MyProducts = (props) => {
  const { t } = useTranslation("common");
  const { data } = props;
  const [products, setProducts] = useState(data);
  const [session] = useSession();
  const [pageSize, setPageSize] = useState({ page: 0, size: 10 });
  const [localProducts, setLocalProducts] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [modalProducts, setModalProducts] = useState(false);
  const toggleModalProducts = () => setModalProducts(!modalProducts);
  const [previewImage, setPreviewImage] = useState([]);
  const [images, setImages] = useState([]);
  const [stateFormProduct, setStateFormProduct] = useState({
    post: false,
    put: false,
  });
  const [productId, setProductId] = useState(null);
  const [productData, setProductData] = useState({
    defaultValues: {
      name: "",
      description: "",
      price: 0
    },
  });

  useEffect(async () => {
    if (products) {
      setLocalProducts(products);
    }
  }, [products]);

  const editProduct = async (id) => {
    setStateFormProduct({
      post: false,
      put: true,
    });
    const [product] = localProducts.filter((p) => p.id == id);
    let copyProductsData = Object.assign({}, productData);
    copyProductsData.defaultValues.name = product.name;
    copyProductsData.defaultValues.description = product.description;
    copyProductsData.defaultValues.price = product.price;

    setProductData(copyProductsData);

    let imagenes = await onEditGetProducts(id);

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

    const imagen = await fetch(product.previewImage);
    let blob = await imagen.blob();
    let file = new File([blob], `${product.previewImage}`, {
      type: "image/jpg",
    });

    Object.assign(file, {
      preview: URL.createObjectURL(file),
    });

    setPreviewImage([file]);
    setProductId(id);
    toggleModalProducts();
  };

  const onEditGetProducts = async (id) => {
    try {
      let dataImages = await imageService.getImagesByProductId(
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

  const openModalProduct = () => {
    setStateFormProduct({
      post: true,
      put: false,
    });
    const defaultValues = {
      defaultValues: {
        name: "",
        description: "",
        price: 0
      },
    };
    setProductData(defaultValues);
    setImages([]);
    setPreviewImage([]);
    toggleModalProducts();
  };

  const onAddProduct = async (data) => {
    await productService.addProduct(data, session.accessToken);
    toggleModalProducts();
  };

  const onSetProduct = (data) => {
    console.log(data);
  };

  const imagesCard = (
    <Row className="row-cols-1 row-cols-lg-2 row-cols-xl-3 g-4">
      {isLoading ? (
        <h1>{t("loading")}...</h1>
      ) : (
        localProducts.map((product) => (
          <Col key={product.id}>
            
            <CardDeck className={`${filteredImagesStyles.colCard}`}>
              <Card>
                <CardBody className="p-0">
                  <Link
                    href={`/product/[id]`}
                    as={`/product/${product.name.replace(/\s+/g, "-")}-${
                      product.id
                    }`}
                  >
                    <img
                      className={`${filteredImagesStyles.cardImage}`}
                      src={product.previewImage}
                      alt="preview"
                    />
                  </Link>
                  <div className={`${filteredImagesStyles.cardText}`}>
                    <Col className="col-auto">
                      <img
                        className={`${filteredImagesStyles.imgProfile} rounded-circle`}
                      />
                    </Col>
                    <Col className={`col-auto`}>
                      <CardText
                        className={`${filteredImagesStyles.textShadowSm} fw-bold`}
                      >
                        {product.name}
                      </CardText>
                    </Col>
                    <Col
                      className={`col-auto ${filteredImagesStyles.containerHeart}`}
                    >
                      {session && (
                        <div>
                          <CustomButtonTogle
                            id={product.id}
                            editProduct={editProduct}
                          />
                        </div>
                      )}
                    </Col>
                  </div>
                </CardBody>
              </Card>
            </CardDeck>
          </Col>
        ))
      )}
    </Row>
  );

  return (
  <Layout>
      <Row className="row-cols-2 g-2">
        <Col className="col-auto">
          <Button outline color="primary" onClick={openModalProduct}>
            <PlusSquareDotted size={100} />
          </Button>
        </Col>
        <Col className="col-auto">{imagesCard}</Col>
    </Row>

    <ModalForm
        size={"xl"}
        modalTitle={t("work-form")}
        className={"Button mt-50"}
        formBody={
        <>
          <FormProduct
            onAddProduct={onAddProduct}
            onSetProduct={onSetProduct}
            toggle={toggleModalProducts}
            productData={productData}
            previewImage={previewImage}
            setPreviewImage={setPreviewImage}
            images={images}
            setImages={setImages}
            changeState={{ stateFormProduct, function: setStateFormProduct }}
            productId={productId}
          />
        </>
        }
        modalOpen={{ open: modalProducts, function: setModalProducts }}
      />
  </Layout>
  );
};

export async function getServerSideProps({ params, req, res, locale }) {
    const session = await getSession({ req });

    if (
      !session ||
      !session.authorities.includes(process.env.NEXT_PUBLIC_ROLE_COMPANY)
    ) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    let { page, size } = req.__NEXT_INIT_QUERY;

    if (!page || page <= 0) {
      page = 0;
    }
    if (!size || size <= 0) {
      size = process.env.NEXT_PUBLIC_SIZE_PER_PAGE;
    }

    const data = await productService.findMyProducts(
      page,
      size,
      session.accessToken
    );

    return {
      props: {
        data
      },
    };
};
export default MyProducts;
