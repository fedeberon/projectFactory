import React from "react";
import Link from "next/link";
import Layout from "../components/Layout/Layout";
import { Col, Row } from "react-bootstrap";

const NotFound = () => {
  return (
    <Layout>
      <Row className={`row-cols-1 justify-content-center m-4 text-center`}>
        <Col xs={6}>
          <h1>Oooops...</h1>
          <h2>That page cannot be found.</h2>
          <h2>
            Go back to the{" "}
            <Link href={"/"}>
              <a>Home</a>
            </Link>
          </h2>
        </Col>
      </Row>
    </Layout>
  );
};

export default NotFound;
