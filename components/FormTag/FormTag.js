import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Col, Container, Form, Row } from "react-bootstrap";
import useTranslation from "next-translate/useTranslation";
import autosuggestStyles from "./Autosuggest.module.css";
import PrimaryButton from "../Buttons/PrimaryButton/PrimaryButton";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { tagsActions } from "../../store";
import chroma from "chroma-js";

/**
 * This object config syles is customised for not get data.color
 * if else create a individual color for select component.
 * @returns {Object} configStyles
 */
const colourStyles = {
  control: (styles) => ({
    ...styles,
    backgroundColor: "white",
    borderColor: "#CECECE",
    "&:hover": { borderColor: "#B3B3B3" },
    boxShadow: "0 0 0 0",
  }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    const myData = { color: "#000000" };
    const color = chroma(myData.color);
    return {
      ...styles,
      backgroundColor: isDisabled
        ? null
        : isSelected
        ? myData.color
        : isFocused
        ? color.alpha(0.1).css()
        : null,
      color: isDisabled
        ? "#ccc"
        : isSelected
        ? chroma.contrast(color, "white") > 2
          ? "white"
          : "black"
        : myData.color,
      cursor: isDisabled ? "not-allowed" : "default",

      ":active": {
        ...styles[":active"],
        backgroundColor:
          !isDisabled && (isSelected ? myData.color : color.alpha(0.3).css()),
      },
    };
  },
  multiValue: (styles, { data }) => {
    const myData = { color: "#1f9fd6" };
    const color = chroma(myData.color);
    return {
      ...styles,
      backgroundColor: color.alpha(1).css(),
    };
  },
  multiValueLabel: (styles, { data }) => {
    const myData = { color: "#FFFFFF" };
    return {
      ...styles,
      color: myData.color,
    };
  },
  multiValueRemove: (styles, { data }) => {
    const myData = { color: "#000000" };
    return {
      ...styles,
      color: myData.color,
      ":hover": {
        backgroundColor: myData.color,
        color: "white",
      },
    };
  },
};

const FormTag = ({ toggle, image }) => {
  const [timeErrorLive, setTimeErrorLive] = useState(0);
  const dispatch = useDispatch();
  const tags = useSelector((state) => state.tags.buildingWorks);
  const selectedTagsDefault = useSelector((state) => state.tags.selectedTags);

  const { t } = useTranslation("common");

  const {
    control,
    setError,
    formState: { errors },
    handleSubmit,
  } = useForm({ defaultValues: { buildingWorkTags: image.tags } });

  useEffect(() => {
    if (image.tags) {
      dispatch(tagsActions.setSelectedTags(image.tags));
    }
  }, [image]);

  const onSubmit = async ({ buildingWorkTags }, event) => {
    image.tags = buildingWorkTags;
    toggle();
  };

  const customTheme = (theme) => {
    return {
      ...theme,
      colors: {
        ...theme.colors,
        primary25: "#be1d7b",
        primary: "#000000",
      },
    };
  };

  const handleOnEditTag = (values) => {
    dispatch(tagsActions.setSelectedTags(values));
  };

  return (
    <Container fluid="sm">
      <Row>
        <Col>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row className="row-cols-1 row-cols-md-2">
              <Col xs={12} md={5} className={"order-1 order-md-1"}>
                <img
                  className={`${autosuggestStyles.imgTag} w-100 img-fluid`}
                  src={image.preview}
                  alt="image-selected"
                ></img>
              </Col>
              <Col xs={12} md={7} className={"order-3 order-md-2"}>
                <Form.Group className={`mb-2`}>
                  <Form.Label htmlFor="buildingWorkTags">
                    {t("form-tag.tag")}
                  </Form.Label>
                  <Controller
                    name={"buildingWorkTags"}
                    control={control}
                    onChange={handleOnEditTag}
                    value={selectedTagsDefault}
                    defaultValue={selectedTagsDefault}
                    rules={{
                      required: {
                        value: true,
                        message: `${t("common:is-required", {
                          nameRequired: t(
                            "common:formulary.the-buildingWork-tag"
                          ),
                        })}`,
                      },
                    }}
                    render={({ field }) => (
                      <>
                        <Select
                          {...field}
                          name={"buildingWorkTags"}
                          inputId={"buildingWorkTags"}
                          options={tags}
                          isMulti
                          getOptionLabel={(option) => `${option?.name}`}
                          getOptionValue={(option) => `${option?.id}`}
                          isClearable
                          isSearchable
                          placeholder={t("select-some-tag-here-please")}
                          noOptionsMessage={() => t("no-options")}
                          // theme={customTheme}
                          styles={colourStyles}
                          className={
                            "form-field" +
                            (errors.buildingWorkTags ? " has-error" : "")
                          }
                        />
                      </>
                    )}
                  />
                  {errors.buildingWorkTags && (
                    <Form.Text
                      variant="danger"
                      className="invalid error-Form.Label text-danger"
                    >
                      {errors.buildingWorkTags.message}
                    </Form.Text>
                  )}
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col sm={12}>
                <PrimaryButton
                  type="submit"
                  dark
                  className={"w-100 mt-1"}
                  disabled={tags?.length == 0}
                >
                  {t("save-tags")}
                </PrimaryButton>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default FormTag;
