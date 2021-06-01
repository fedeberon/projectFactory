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
import TagList from "./TagList";

const FormTag = ({ toggle, image }) => {
  const [tags, setTags] = useState([]);

  const { t, lang } = useTranslation("common");

  const {
    control,
    register,
    setError,
    formState: { errors },
    handleSubmit,
  } = useForm();

  useEffect(() => {
    console.log(image);
    setTags([]);
  }, [image]);

  const onSubmit = async (event) => {
    image.tags = tags;
    toggle();
  };

  const removeTag = (tag) => {
    const newTags = Array.from(tags);
    const index = newTags.indexOf(tag);
    if (index > -1) {
        newTags.splice(index, 1);
        setTags(newTags);
    }
  };

  const addOneTag = () => {
    const tag = {
      name: document.querySelector("#tag").value,
      id: 1,
    };
    const newTags = Array.from(tags);
    newTags.push(tag);
    setTags(newTags);
  };

  return (
    <Container fluid="sm">
      <Form onSubmit={handleSubmit(onSubmit)}>
        <img src={image.preview} alt="image-selected"></img>
        <FormGroup>
          <Label for="tag">{t("Tag")}</Label>
          <Row>
            <Col xs={8}>
              <Input
                type="text"
                id="tag"
                placeholder={t("WriteTagHere")}
                {...register("tag", {
                  required: {
                    value: true,
                    message: `${t("TagIsRequired")}`,
                  },
                  minLength: {
                    value: 3,
                    message: `${t("TagCannotBe3OrLess")}`,
                  },
                })}
                className={"form-field" + (errors.tag ? " has-error" : "")}
              />
            </Col>
            <Col>
              <Button color="primary mt-1" onClick={addOneTag}>
                {t("AddTag")}
              </Button>
            </Col>
          </Row>

          {errors.tag && (
            <FormText className="error-label">{errors.tag.message}</FormText>
          )}
        </FormGroup>

        <TagList tags={tags} />

        <Button type="submit" color="primary mt-1">
          {t("AddTags")}
        </Button>
      </Form>
    </Container>
  );
};

export default FormTag;
