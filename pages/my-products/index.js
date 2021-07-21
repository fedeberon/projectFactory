import React, { useEffect, useState } from "react";
import { getSession, useSession } from "next-auth/client";
import useTranslation from "next-translate/useTranslation";
import Layout from "../../components/Layout/Layout";
import * as productService from "../../services/productService";
import ModalForm from "../../components/ModalForm";
import Link from "next/link";
import {
  Card,
  Col,
  Row,
  Button,
  DropdownButton,
  Dropdown,
} from "react-bootstrap";

import FormProduct from "../../components/FormProduct/FormProduct";

import {
  PlusSquareDotted,
  ThreeDotsVertical,
  PencilSquare,
  XCircle,
  ExclamationCircle,
  Check2Circle,
} from "react-bootstrap-icons";
import indexStyles from "./index.module.css";
import filteredImagesStyles from "../../components/FilteredImages/FilteredImages.module.css";
import * as imageService from "../../services/imageService";

const CustomButtonTogle = ({ id, editProduct }) => {
  return (
    <DropdownButton
      variant="start"
      drop="left"
      align="end"
      title={<ThreeDotsVertical color={"dark"} size={25} />
      }>
      <Dropdown.Menu>
        <Dropdown.Item
          onClick={() => {
            editProduct(id);
          }}
        >
          <PencilSquare color={"red"} size={25} />
          {` Edit`}
        </Dropdown.Item>
      </Dropdown.Menu>
    </DropdownButton>
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
      price: 0,
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
        price: 0,
      },
    };
    setProductData(defaultValues);
    setImages([]);
    setPreviewImage([]);
    toggleModalProducts();
  };

  const onAddProduct = async (data) => {
    if (session) {
      try {
        let productNew = await productService.addProduct(
          data,
          session.accessToken
        );

        const productReload = await productService.findMyProducts(
          pageSize.page,
          pageSize.size,
          session.accessToken
        );

        setLocalProducts(productReload);
        toggleModalProducts();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const onSetProduct = (data) => { };

  const isState = (product) => {
    let statusColor;
    let ico;
    if (product.status === "PENDING") {
      statusColor = `bg-warning text-dark`;
      ico = <ExclamationCircle className={`${statusColor}`} size={15} />;
    }
    if (product.status === "APPROVED") {
      statusColor = "bg-success";
      ico = <Check2Circle className={`${statusColor}`} size={15} />;
    }
    if (product.status === "REJECTED") {
      statusColor = `bg-danger`;
      ico = <XCircle className={`${statusColor}`} size={15} />;
    }
    return (
      <>
        <Card.Text className={`${indexStyles.itemStatus} ${statusColor} m-0`}>
          {ico}
          {t(product.status.toLowerCase())}
        </Card.Text>
      </>
    );
  };

  const imagesCard = (
    <Row className="row-cols-1 row-cols-lg-2 row-cols-xl-3 g-4">
      {isLoading ? (
        <h1>{t("loading")}...</h1>
      ) : (
        localProducts.map((product) => (
          <Col key={product.id}>
            <Card className={`${filteredImagesStyles.colCard}`}>
              <Card.Body className="p-0">
                <Link
                  href={`/product/[id]`}
                  as={`/product/${product.name.replace(/\s+/g, "-")}-${product.id
                    }`}
                >
                  <img
                    className={`${filteredImagesStyles.cardImage} ${indexStyles.cursorPointer
                      } ${product.status === "PENDING"
                        ? `${indexStyles.imgGray}`
                        : product.status === "REJECTED"
                          ? `${indexStyles.imgRejected}`
                          : ``
                      }`}
                    src={product.previewImage}
                    alt="preview"
                  />
                </Link>
                {isState(product)}
                <div className={`${filteredImagesStyles.cardText}`}>
                  <Col className="col-auto">
                    <img
                      className={`${filteredImagesStyles.imgProfile} rounded-circle`}
                    />
                  </Col>
                  <Col className={`col-auto`}>
                    <Card.Text
                      className={`${filteredImagesStyles.textShadowSm} fw-bold`}
                    >
                      {product.name}
                    </Card.Text>
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
        <Row className="row-cols-2 g-2">
          <Col className="col-auto">
            <Button variant="primary" onClick={openModalProduct}>
              <PlusSquareDotted size={100} />
            </Button>
          </Col>
          <Col className="col-12">{imagesCard}</Col>
        </Row>

        <ModalForm
          size={"xl"}
          modalTitle={t("product-form")}
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
      </section>
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
      data,
    },
  };
}
export default MyProducts;
