import React, { useState, useEffect } from "react";
import styles from "./SuggestionsSearch.module.css";
import useTranslation from "next-translate/useTranslation";
import { Search } from "react-bootstrap-icons";

const SuggestionsSearch = (props) => {
  const {
    suggestions,
    active,
    onChangeCheckIdeas,
    onChangeCheckProjects,
    input,
  } = props;
  const [byProfessionals, setByProfessionals] = useState(false);

  useEffect(() => {
    if (suggestions.length > 0) {
      const suggestion = suggestions[0];
      if (suggestion.email != undefined) {
        setByProfessionals(true);
      } else {
        setByProfessionals(false);
      }
    } else {
      setByProfessionals(false);
    }
  }, [suggestions]);

  const getProfessionalList = () =>
    suggestions.map((professional, index) => (
      <div className={styles.suggestionContainer} key={professional.id}>
        <img
          className={styles.previewImage}
          src={professional.previewImage}
          layout="fill"
          alt="professional-preview"
        />
        <div className={styles.divName}>
          <span>
            <span className={styles.spanMatch}>{input.value}</span>
            <span>{professional.contact.slice(input.value.length)}</span>
          </span>
        </div>
      </div>
    ));

  const getProjectsList = () =>
    suggestions.map((project, index) => (
      <div key={project.id}>{project.name}</div>
    ));

  const { t } = useTranslation("common");
  return (
    <div
      className={`${styles.dropDownSearch} ${
        active ? styles.dropDownSearchActive : ""
      }`}
    >
      {byProfessionals ? getProfessionalList() : getProjectsList()}
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
