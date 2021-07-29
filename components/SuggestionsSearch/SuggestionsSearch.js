import React, { useState, useEffect } from "react";
import styles from "./SuggestionsSearch.module.css";
import useTranslation from "next-translate/useTranslation";
import { Search } from "react-bootstrap-icons";
import Link from "next/link";

const SuggestionsSearch = (props) => {
  const {
    suggestions,
    active,
    onChangeCheckIdeas,
    onChangeCheckProjects,
    input
  } = props;
  const { t } = useTranslation("common");

  return (
    <div
      className={`${styles.dropDownSearch} ${
        active ? styles.dropDownSearchActive : ""
      } nav-search`}
    >
      {suggestions.map((suggestion) => (
        <Link href={suggestion.link} key={suggestion.id}>
          <a className={styles.link}>
            <div className={styles.suggestionContainer}>
              <img
                className={styles.previewImage}
                src={suggestion.previewImage}
                layout="fill"
                alt="preview"
              />
              <div className={styles.divName}>
                <span>
                  <span className={styles.spanMatch}>{input.value}</span>
                  <span>{suggestion.value.slice(input.value.length)}</span>
                </span>
              </div>
            </div>
          </a>
        </Link>
      ))}
      <div className={styles.divCheckboxs}>
        <div className="form-check">
          <input
            onChange={onChangeCheckIdeas}
            className="form-check-input"
            type="radio"
            name="flexRadioDefault"
            id="flexRadioDefault1"
          />
          <label className="form-check-label" htmlFor="flexRadioDefault1">
            {t("header.search-by-ideas")}
          </label>
        </div>
        <div className="form-check">
          <input
            onChange={onChangeCheckProjects}
            className="form-check-input"
            type="radio"
            name="flexRadioDefault"
            id="flexRadioDefault2"
            defaultChecked
          />
          <label className="form-check-label" htmlFor="flexRadioDefault2">
            {t("header.search-by-professionals")}
          </label>
        </div>
      </div>
    </div>
  );
};

export default SuggestionsSearch;
