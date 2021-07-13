import React, { useEffect, useState } from "react";
import { getSession } from "next-auth/client";
import useTranslation from "next-translate/useTranslation";
import Layout from "../../components/Layout/Layout";
import * as productService from "../../services/productService";
import ModalForm from "../../components/ModalForm";
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

import {
    PlusSquareDotted,
    Images,
    ThreeDotsVertical,
    PencilSquare,
} from "react-bootstrap-icons";

const MyProducts = (props) => {
const { t } = useTranslation("common");
    const { session } = props;
  const [products, setProducts] = useState([]);
  const [pageSize, setPageSize] = useState({ page: 0, size: 10 });
  const [modalProducts, setModalProducts] = useState(false);
  const toggleModalProducts = () => setModalProducts(!modalProducts);

  useEffect(() => {
    async function fetchData() {
        const data = await productService.findMyProducts(
        session.user.id,
        pageSize.page,
        pageSize.size,
        session.accessToken
        );

      setProducts(data);
    }

    fetchData();
  }, []);

  const imagesCard = <></>;

  return (
  <Layout>
      <Row className="row-cols-2 g-2">
        <Col className="col-auto">
          <Button outline color="primary" onClick={toggleModalProducts}>
            <PlusSquareDotted size={100} />
          </Button>
        </Col>
        <Col className="col-auto">{imagesCard}</Col>
    </Row>

    <ModalForm
        size={"xl"}
        modalTitle={t("work-form")}
        className={"Button mt-50"}
        formBody={<></>
        }
        modalOpen={{ open: modalProducts, function: setModalProducts }}
      />
  </Layout>
  );
};

export async function getServerSideProps({ params, req, res, locale }) {
    const session = await getSession({ req });
    return {
      props: {
        session
      },
    };
};
export default MyProducts;
