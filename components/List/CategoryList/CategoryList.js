import React from "react";
import CategoryListStyles from "./CategoryList.module.css";
import { useDispatch, useSelector } from 'react-redux';
import { categoriesActions } from '../../../store';

const CategoryList = () => {
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
    <ul className={CategoryListStyles.ul}>
        {selectedTags.map((tag, index) => (
          <li key={index} className={CategoryListStyles.li}>
              <span className={CategoryListStyles.span}>{tag.name}</span>
              <button className={CategoryListStyles.closeBtn} onClick={(event) => handleDeleteTag(event, tag)}>x</button>
          </li>
        ))}
    </ul>
  );
};

export default CategoryList;
