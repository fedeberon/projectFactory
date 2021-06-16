import React, { useEffect, useState } from "react";
import filterListStyles from "./FilterList.module.css";
import { useTranslation } from "react-i18next";
import { ListGroup, ListGroupItem } from "reactstrap";
import TagCreator from "../TagCreator";

const FilterList = ({ filters, appliedFilters, setAppliedFilters }) => {
  const { t, lang } = useTranslation("common");
  const [tags, setTags] = useState([]);

  useEffect(() => setTags(filters), [filters]);

  const onClickFilter = (filter, event) => {
    event.target.classList.toggle("active");
    if (appliedFilters.includes(filter)) {
      removeFilter(filter);
    } else {
      addFilter(filter);
    }
  };

  const addFilter = (filter) => {
    const newAppliedFilters = Array.from(appliedFilters);
    newAppliedFilters.push(filter);
    setAppliedFilters(newAppliedFilters);
  };

  const removeFilter = (filter) => {
    const newAppliedFilters = Array.from(appliedFilters);
    const index = newAppliedFilters.indexOf(filter);
    if (index > -1) {
      newAppliedFilters.splice(index, 1);
      setAppliedFilters(newAppliedFilters);
    }
  };

  return (
    <ListGroup>
      <ListGroupItem disabled className="bg-warning">
        <h5 className="m-0">{t("Filters")}</h5>
      </ListGroupItem>
      {tags.map((filter) => (
        <ListGroupItem
          tag="button"
          action
          key={filter.tag}
          onClick={(event) => onClickFilter(filter, event)}
        >
          {filter.tag}
        </ListGroupItem>
      ))}
      <TagCreator tags={tags} setTags={setTags} />
    </ListGroup>
  );
};

export default FilterList;
