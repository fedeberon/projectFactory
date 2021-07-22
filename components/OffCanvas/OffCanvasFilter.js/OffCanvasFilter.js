import React, { useState } from "react";
import { Offcanvas, Button, Navbar, Col } from "react-bootstrap";
import { Funnel } from "react-bootstrap-icons";
import styles from "./OffCanvasFilter.module.css";
import useTranslation from "next-translate/useTranslation";
import FilterList from "../../FilterList/FilterList";

const OffCanvasFilter = (props) => {
  const { filters, appliedFilters, setAppliedFilters } = props;
  const [show, setShow] = useState(false);
  let { t } = useTranslation("common");

  const handleToggle = () => setShow((show) => !show);

  return (
    <>
      <a
        className={`${styles.btnLight} ${styles.btnLg}`}
        onClick={handleToggle}
      >
        <Funnel size={25} /> {t("filter")}
      </a>

      <Offcanvas show={show} onHide={handleToggle}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{t("filter-list.filters")}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Col xs={12}>
            <aside>
              <FilterList
                filters={filters}
                appliedFilters={appliedFilters}
                setAppliedFilters={setAppliedFilters}
              />
            </aside>
          </Col>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default OffCanvasFilter;