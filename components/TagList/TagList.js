import React from "react";
import tagListStyles from "./TagList.module.css";
import { useDispatch, useSelector } from 'react-redux';
import { categoriesActions } from '../../store';

const TagList = () => {
  const dispatch = useDispatch();
  const selectedTags = useSelector(state => state.categories.selectedCategories);

  const handleDeleteTag = (event, tag) => {
      event.preventDefault();
      onDeleteTag(tag);
  };

  const onDeleteTag = (tag) => {
      dispatch(categoriesActions.setSelectedCategories(selectedTags.filter(t => t !== tag)));
  };

  return (
    <ul className={tagListStyles.ul}>
        {selectedTags.map((tag, index) => (
          <li key={index} className={tagListStyles.li}>
              <span className={tagListStyles.span}>{tag.name}</span>
              <button className={tagListStyles.closeBtn} onClick={(event) => handleDeleteTag(event, tag)}>x</button>
          </li>
        ))}
    </ul>
  );
};

export default TagList;
