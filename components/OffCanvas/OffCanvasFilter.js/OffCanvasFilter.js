import React, { useState } from "react";
import { Offcanvas, Col } from "react-bootstrap";
import { Funnel } from "react-bootstrap-icons";
import styles from "./OffCanvasFilter.module.css";
import useTranslation from "next-translate/useTranslation";
import FilterList from "../../FilterList/FilterList";
import PrimaryButton from "../../Buttons/PrimaryButton/PrimaryButton";
import { useSelector } from "react-redux";

const OffCanvasFilter = (props) => {
  const { filters, appliedFilters, setAppliedFilters,resetPage } = props;
  const [show, setShow] = useState(false);
  let { t } = useTranslation("common");

  const buildingWorkCategories = useSelector(
    (state) => state.categories.buildingWorks
  );

  const destructuringCategories = buildingWorkCategories.map((nameFilter) => {
    return nameFilter.name;
  });

  const handleToggle = () => {
    setShow((show) => !show);
  };

  return (
    <>
      <PrimaryButton onClick={handleToggle}>
        <Funnel size={15} /> {t("filter")}
      </PrimaryButton>

      <Offcanvas show={show} onHide={handleToggle}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{t("filter-list.filters")}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Col xs={12}>
            <aside>
              <FilterList
                filters={destructuringCategories}
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
