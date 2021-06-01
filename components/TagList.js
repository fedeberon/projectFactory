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
} from "reactstrap";
import { useTranslation } from "react-i18next";

const TagList = ({ tags }) => {


  return (
    <ul style={{
        padding: 0,
        float:"left",
        width: "100%",
        margin: 0
    }}>
        {tags.map((tag, index) => (
          <li 
          key={index}
          style={{
            background: "#1f9fd6",
            color: "#fff",
            fontSize: "12px",
            borderRadius: "3px",
            padding: "4px 16px 4px 8px",
            margin: "0 2px 2px 0",
            position: "relative",
            cursor: "pointer",
            transition: "all 0.3s",
            display: "inline-block"
          }}
          >
              <span 
              style={{
                color: "#fff",
                fontSize: "12px",
                cursor: "pointer",
                whiteSpace: "nowrap",
                fontWeight: 500,
              }}>{tag.name}</span>
              <button
              style={{
                all:"unset",
                fontSize: "0.9rem",
                position: "absolute",
                top: "0px",
                right: "3px",
                color: "#fff",
                display: "block",
                textDecoration: "none",
                paddingLeft: "2px",
                paddingTop: "3px",
                lineHeight: "0.5",
            
              }}>x</button>
          </li>
        ))}
    </ul>
  );
};

export default TagList;
