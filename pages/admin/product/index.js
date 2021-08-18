// Frameworks
import React, { useEffect, useState } from "react";
import { getSession } from "next-auth/client";
import { Button, Col, Form, Row } from "react-bootstrap";
import { CheckCircle, XCircle } from "react-bootstrap-icons";
import useTranslation from "next-translate/useTranslation";

// Components
import Layout from "../../../components/Layout/Layout";
import Tabs from "../../../components/Tabs/Tabs";
import TableAdmin from "../../../components/TableAdmin/TableAdmin";

//Services
import * as imageService from "../../../services/imageService";
import * as productService from "../../../services/productService";

const ProductAdmin = ({
  productsNotApproved,
  productsApproved,
  productsRejected,
  session,
}) => {
  const [pageSize, setPageSize] = useState({ page: 0, size: 10 });
  const [productListNotAppoved, setProductListNotAppoved] = useState([]);
  const [productsListAppoved, setListAppoved] = useState([]);
  const [productsListRejected, setProductsListRejected] = useState([]);

  const { t } = useTranslation("administrator");

  /**
   * Component button accept to add it to the table that requires it.
   * @param {*} productlId String necessary to identify the products
   * in changeState
   * @returns A button armed with the functionality to change the state to Id
   */
  const buttonAccept = (productlId) => {
    return (
      <Button
        variant={"outline-success"}
        onClick={() => changeState(productlId, "APPROVED")}
      >
        <CheckCircle size={25} /> {t("accept")}
      </Button>
    );
  };

  /**
   * Component button reject to add it to the table that requires it.
   * @param {*} productId String necessary to identify the profesisonal
   * in changeState
   * @returns A button armed with the functionality to change the state to Id.
   */
  const buttonReject = (productId) => {
    return (
      <Button
        variant={"outline-danger"}
        onClick={() => changeState(productId, "REJECTED")}
      >
        <XCircle size={25} /> {t("reject")}
      </Button>
    );
  };

  /**
   * Component button that accept all images of one productId.
   * @param {*} productId String necessary to identify the profesisonal
   * in acceptImages
   * @returns A button armed with the functionality to change the state to Id.
   */
  const buttonAcceptImages = (productId) => {
    return (
      <Button
        variant={"outline-success"}
        onClick={async () => changeStateImages(productId, true)}
      >
        <CheckCircle size={25} /> {t("accept-images")}
      </Button>
    );
  };

  const changeStateImages = async (id, approved) => {
    await imageService.changeStateImagesByProductIdId(
      id,
      approved,
      session.accessToken
    );
    pendingTab();
    approvedTab();
    disapprovedTab();
    alert(t("images-accepted"));
  };

  /**
   * Funtionality to buttonAcept and buttonReject components
   * to change the status of a product in a tabs pending, approved and
   * disapproved.
   * @param {*} id String necessary to identify of a product.
   * @param {*} status String to show that you want it to see.
   * The states are : PENDING APPROVED REJECTED DELETED
   */
  const changeState = async (id, status) => {
    const productChange = await saveChangeStatus(id, status);
    if (productChange) {
      pendingTab();
      approvedTab();
      disapprovedTab();
    }
  };

  /**
   * Request "fetch" to the DB that changes the status of a product.
   * @param {*} id String is necessary to identify a product
   * @param {*} status String to show that you want it to see.
   * The states are : PENDING APPROVED REJECTED DELETED
   * @returns true or false to obtein if save change or not
   */
  const saveChangeStatus = async (id, status) => {
    try {
      await productService.setStatus(id, status, session?.accessToken);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  /**
   * Funtionality to refresh the pending tab when a product is accepted.
   */
  const pendingTab = async () => {
    const products = await getAllProducts("PENDING");
    renderPending(products);
  };

  const renderPending = (products) => {
    const productsList = getList(products, [
      (productId) => buttonAccept(productId),
      (productId) => buttonReject(productId),
    ]);
    setProductListNotAppoved(productsList);
  };

  /**
   * Funcionality to refresh the approved tab when a product is rejected.
   */
  const approvedTab = async () => {
    const products = await getAllProducts("APPROVED");
    renderApproved(products);
  };

  const renderApproved = (products) => {
    const productsList = getList(products, [
      (productId) => buttonReject(productId),
    ]);
    setListAppoved(productsList);
  };

  /**
   * Funcionality to refresh the disapproved tab when you want to accept
   * a product again.
   */
  const disapprovedTab = async () => {
    const products = await getAllProducts("REJECTED");
    renderRejectedProductIds(products);
  };

  const renderRejectedProductIds = (products) => {
    const productsList = getList(products, [
      (productId) => buttonAccept(productId),
    ]);
    setProductsListRejected(productsList);
  };

  /**
   * Request "fetch" to obtain approved, disapproved, rejected or deleted
   * products, depends on the "status" parameter and with error control.
   * @param {*} status String to show that you want it to see.
   * The states are: PENDING APPROVED REJECTED DELETED
   * @returns arrangement of productly limited for page.
   */
  const getAllProducts = async (status) => {
    try {
      const productsNotAppoved = await productService.findAll(
        status,
        pageSize.page,
        pageSize.size,
        session?.accessToken
      );
      return productsNotAppoved;
    } catch (error) {
      console.error(error);
    }
  };

  const getProductsForApproved = async (status) => {
    try {
      const productsNotApproved = await productService.findAll(
        status,
        pageSize.page,
        pageSize.size,
        session?.accessToken
      );
      return productsNotApproved;
    } catch (error) {
      console.error(error);
    }
  };

  const getListHead = (
    <>
      <th>{t("common:image")}</th>
      <th>{t("common:name")}</th>
      <th>{t("common:price")}</th>
      <th>{t("common:date")}</th>
      <th>{t("common:company")}</th>
      <th>{t("common:table-admin.tokens")}</th>
      <th>{t("common:table-admin.actions")}</th>
    </>
  );

  /**
   * Complete the body part of the table showing the result of the pending,
   * approved or rejected product consultations.
   * @param {*} products these are the products who arrive
   * from a request "fetch" from the BD
   * @param {*} buttons is the buttons you want to display in the table as actions.
   * @returns the body of the table.
   */
  const getList = (products, buttons) => {
    const productsList = products.map((product, index) => {
      return (
        <tr key={index} className="align-middle text-center">
          <td scope="row">#{index + 1}</td>
          <td width="150px">
            <figure className="figure mx-auto">
              <img
                className="img-fluid rounded"
                src={product.previewImage}
                alt=""
              />
            </figure>
          </td>
          <td>{product.name}</td>
          <td>{product.price}</td>
          <td>{product.statusUpdate}</td>
          <td>{product.company.name}</td>
          <td>
            <Form.Control
              min="0"
              type="number"
              className="d-inline-block w-50 mr-2"
              defaultValue={product.tokensAsigned}
            />
            <Button
            onClick={(e) =>
              setNewTokensToProduct(
                e.target.previousElementSibling.value,
                product.id
              )
            }
            >
              {t("apply")}
            </Button>
          </td>
          <td>
            {buttons.map((button, index) => {
              return <div key={index}>{button(product.id)}</div>;
            })}
          </td>
        </tr>
      );
    });
    return productsList;
  };

  const setNewTokensToProduct = async (tokens, productId) => {
    await productService.setNewTokensToProductId(
      tokens,
      productId,
      session.accessToken
    );
    alert(t("tokens-setted"));
  };

  /**
   * This is for when using the SSR and loading the tableAdmin component properly
   * with the list of pending products.
   */
  useEffect(async () => {
    if (productsNotApproved) {
      const productsList = getList(productsNotApproved, [
        (productId) => buttonAccept(productId),
        (productId) => buttonReject(productId),
      ]);
      setProductListNotAppoved(productsList);
    }
  }, [productsNotApproved]);

  /**
   * This is for when using the SSR and loading the tableAdmin component properly
   * with the list of approved proffesional.
   */
  useEffect(async () => {
    if (productsApproved) {
      const productList = getList(productsApproved, [
        (productId) => buttonReject(productId),
      ]);
      setListAppoved(productList);
    }
  }, [productsApproved]);

  /**
   * This is for when using the SSR and loading the tableAdmin component properly
   * with the list of disapproved proffesional.
   */
  useEffect(async () => {
    if (productsRejected) {
      const productList = getList(productsRejected, [
        (productId) => buttonAccept(productId),
      ]);
      setProductsListRejected(productList);
    }
  }, [productsRejected]);

  /**
   * These are the titles of the tabs needed to describe each other.
   */
  const titles = [t("pending"), t("approved"), t("disapproved")];

  /**
   * Find all products by username and status, if username is empty, only find by status
   * when get all products, the method will render them
   */
  const findByContactAndStatus = async (username, status) => {
    let newProducts;

    if (username != "")
      newProducts = await productService.findByContactAndStatus(
        username,
        status,
        pageSize.page,
        pageSize.size
      );
    else newProducts = await getProduct(status);

    switch (status) {
      case "PENDING":
        renderPending(newProducts);
        break;
      case "APPROVED":
        renderApproved(newProducts);
        break;
      case "REJECTED":
        renderRejectedProducts(newProducts);
        break;
    }
  };

  return (
    <Layout title={t("managing-products")}>
      <section className="container py-2">
        <Row>
          <Col>
            <Tabs titles={titles}>
              <TableAdmin
                listHead={getListHead}
                listBody={productListNotAppoved}
                title={titles[0]}
                onSearch={(username) =>
                  findByContactAndStatus(username, "PENDING")
                }
              />
              <TableAdmin
                listHead={getListHead}
                listBody={productsListAppoved}
                title={titles[1]}
                onSearch={(username) =>
                  findByContactAndStatus(username, "APPROVED")
                }
              />
              <TableAdmin
                listHead={getListHead}
                listBody={productsListRejected}
                title={titles[2]}
                onSearch={(username) =>
                  findByContactAndStatus(username, "REJECTED")
                }
              />
            </Tabs>
          </Col>
        </Row>
      </section>
    </Layout>
  );
};

export async function getServerSideProps({ params, req, res, locale }) {
  // Get the user's session based on the request
  const session = await getSession({ req });

  if (
    !session ||
    !session.authorities.includes(process.env.NEXT_PUBLIC_ROLE_ADMINITRATOR)
  ) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  let token;

  let productsApproved = [];
  let productsRejected = [];
  let productsNotApproved = [];
  let { page, size } = req.__NEXT_INIT_QUERY;

  if (!page || page <= 0) {
    page = 0;
  }
  if (!size || size <= 0) {
    size = process.env.NEXT_PUBLIC_SIZE_PER_PAGE;
  }

  if (session) {
    let status = "PENDING";
    token = session.accessToken;
    productsNotApproved = await productService.findAll(
      status,
      page,
      size,
      token
    );

    status = "APPROVED";
    productsApproved = await productService.findAll(status, page, size, token);
    status = "REJECTED";
    productsRejected = await productService.findAll(status, page, size, token);
  }

  return {
    props: {
      productsNotApproved,
      productsApproved,
      productsRejected,
      session,
    },
  };
}
export default ProductAdmin;
