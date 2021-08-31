import React, { useEffect, useState } from "react";
import filterListStyles from "./FilterList.module.css";
import useTranslation from "next-translate/useTranslation";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import TagCreator from "../TagCreator";

const FilterList = ({
  filters,
  appliedFilters,
  setAppliedFilters,
  handleToggle,
}) => {
  const { t } = useTranslation("common");
  const [tags, setTags] = useState([]);
  const [activeState, setActiveState] = useState("");

  useEffect(() => {
    setTags(filters);
  }, [filters]);

  const isActive = (filterBtn) => {
    return appliedFilters.some((filter) => filter === filterBtn);
  };

  const onClickFilter = (filter, event) => {
    event.target.classList.toggle("active");
    if (appliedFilters.includes(filter)) {
      removeFilter(filter);
    } else {
      addFilter(filter);
    }
  };

  const addFilter = (filter) => {
    // const newAppliedFilters = Array.from(appliedFilters);
    // newAppliedFilters.push(filter);
    // setAppliedFilters(newAppliedFilters);
    setAppliedFilters([filter]);
    handleToggle();
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
      {tags.map((filter) => (
        <ListGroupItem
          tag="button"
          action
          key={filter}
          className={isActive(filter) ? "active" : ""}
          onClick={(event) => onClickFilter(filter, event)}
        >
          {filter}
        </ListGroupItem>
      ))}
      <TagCreator tags={tags} setTags={setTags} />
    </ListGroup>
  );
};

export default FilterList;
