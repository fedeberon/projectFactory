import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Button,
  Col,
  Container,
  Form,
  FormGroup,
  FormText,
  Input,
  Label,
  Row,
} from "react-bootstrap";
import useTranslation from "next-translate/useTranslation";
import tagListStyles from "./TagList.module.css";

const TagList = ({ tags, onDeleteTag }) => {
  
  const handleDeleteTag = (event, tag) => {
    event.preventDefault();
    onDeleteTag(tag);
  };

  return (
    <ul className={tagListStyles.ul}>
        {tags.map((tag, index) => (
          <li key={index} className={tagListStyles.li}>
              <span className={tagListStyles.span}>{tag.tag}</span>
              <button className={tagListStyles.closeBtn} onClick={(event) => handleDeleteTag(event, tag)}>x</button>
          </li>
        ))}
    </ul>
  );
};

export default TagList;
