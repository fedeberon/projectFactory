import React from "react";
import CategoryListStyles from "../CategoryList/CategoryList.module.css";
const TagList = (props) => {
  const { tags, onDeleteTag } = props;

  //   const handleDeleteTag = (event, tag) => {
  //     event.preventDefault();
  //     onDeleteTag(tag);
  //   };

  //   const onDeleteTag = (tag) => {
  //     selectedTags.filter((t) => t !== tag);
  //   };

  return (
    <ul className={CategoryListStyles.ul}>
      {tags.map((tag, index) => (
        <li key={index} className={CategoryListStyles.li}>
          <span className={CategoryListStyles.span}>{tag.name}</span>
          <button
            className={CategoryListStyles.closeBtn}
            onClick={() => onDeleteTag(tag)}
          >
            x
          </button>
        </li>
      ))}
    </ul>
  );
};

export default TagList;
