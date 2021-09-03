import React, { useState, useEffect } from "react";
import styles from "./SuggestionsSearch.module.css";
import useTranslation from "next-translate/useTranslation";
import { PersonCircle, Search } from "react-bootstrap-icons";
import Link from "next/link";
import { Col, Row } from "react-bootstrap";

const SuggestionsSearch = (props) => {
  const {
    suggestions,
    active,
    onChangeCheckIdeas,
    onChangeCheckProjects,
    input,
  } = props;
  const { t } = useTranslation("common");

  return (
    <div
      className={`${styles.dropDownSearch} ${
        active ? styles.dropDownSearchActive : ""
      } nav-search w-100`}
    >
      {suggestions.map((suggestion) => (
        <Link href={suggestion.link} key={suggestion.id}>
          <a className={styles.link}>
            <div className={styles.suggestionContainer}>
              {suggestion.previewImage ? (
                <img
                  className={styles.previewImage}
                  src={suggestion.previewImage}
                  layout="fill"
                  alt="preview"
                />
              ) : suggestion.path ? (
                <img
                  className={styles.previewImage}
                  src={suggestion.path}
                  layout="fill"
                  alt="preview"
                />
              ) : (
                <PersonCircle className={`${styles.previewImage}`} />
              )}
              <div className={styles.divName}>
                {!suggestion.buildingWork ? (
                  <span>
                    <span className={styles.spanMatch}>{input.value}</span>
                    <span>{suggestion.value.slice(input.value.length)}</span>
                  </span>
                ) : (
                  <div>{suggestion.buildingWork.name}</div>
                )}
              </div>
            </div>
          </a>
        </Link>
      ))}
      <div className={styles.divCheckboxs}>
        <Row>
          <Col className={`col-12`}>
            <h5>{t("header.search-by")}:</h5>
          </Col>
          <Col>
            <div className="form-check">
              <label
                className={`form-check-label ${styles.label}`}
                htmlFor="flexRadioDefault1"
              >
                {t("photos")}
              </label>
              <input
                onChange={onChangeCheckIdeas}
                className={`form-check-input ${styles.inputRadio}`}
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault1"
              />
            </div>
          </Col>
          <Col>
            <div className="form-check">
              <label
                className={`form-check-label ${styles.label}`}
                htmlFor="flexRadioDefault2"
              >
                {t("professionals")}
              </label>
              <input
                onChange={onChangeCheckProjects}
                className={`form-check-input ${styles.inputRadio}`}
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault2"
                defaultChecked
              />
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default SuggestionsSearch;
