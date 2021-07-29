import React from 'react';
import styles from "./Sidebar.module.css";
import { Col, Row } from "react-bootstrap";

const Sidebar = ({children}) => {
    return (
      <Col sm={12} md={4} lg={3} className={styles.sidebar}>
        <div className="module-filter">
          {children}
        </div>
      </Col>
    )
};

export default Sidebar
