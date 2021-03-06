import React, { useState } from "react";
import useTranslation from "next-translate/useTranslation";
import { useForm, Controller } from "react-hook-form";
import { Button, Col, Form, FormGroup, Row } from "react-bootstrap";
import Select from "react-select";
import useSize from "../../hooks/window/useSize";
import PrimaryButton from "../Buttons/PrimaryButton/PrimaryButton";

const FormFilterCompany = (props) => {
  const { onGetFilterCompanies, setCompanies } = props;
  const [options, setOptions] = useState([
    { id: 0, field: "name" },
    { id: 1, field: "province" },
    { id: 2, field: "location" },
    { id: 3, field: "category" },
    { id: 4, field: "contact" },
  ]);
  const [pageSize, setPageSize] = useState({ page: 0, size: 10 });
  const { width } = useSize();

  const { t } = useTranslation("common");

  const {
    control,
    register,
    setError,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm();

  const onSubmit = async ({ name, optionsSelected }, event) => {
    // You should handle login logic with name, optionsSelected for form data
    let data = {
      name,
      optionsSelected,
    };
    let companiesFilter = await onGetFilterCompanies(
      data,
      "APPROVED",
      pageSize.page,
      pageSize.size
    );
    setCompanies(companiesFilter);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Row
        className="row-cols-1 row-cols-md-3 gap-2 gap-md-0"
        style={width >= 768 ? { height: 100 } : { height: "auto" }}
      >
        <Col className="col-12 col-md-4">
          <FormGroup>
            <Form.Label htmlFor="name">{t("name")}</Form.Label>
            <Form.Control
              type="text"
              id="name"
              placeholder={t("write-the-here-please", {
                namePlaceholder: t("the-name").toLowerCase(),
              })}
              {...register("name", {
                required: {
                  value: true,
                  message: `${t("is-required", {
                    nameRequired: t("the-name"),
                  })}`,
                },
              })}
              className={"form-field" + (errors.name ? " has-error" : "")}
            />
            {errors.name && (
              <Form.Text
                variant="danger"
                className="invalid error-Form.Label text-danger"
              >
                {errors.name.message}
              </Form.Text>
            )}
          </FormGroup>
        </Col>
        <Col className="col-12 col-md-4">
          <FormGroup>
            <Form.Label htmlFor="optionsSelected">
              {t("filter-by-option")}
            </Form.Label>
            <Controller
              name="optionsSelected"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: `${t("is-required", {
                    nameRequired: t("filter-by-option"),
                  })}`,
                },
              }}
              render={({ field }) => (
                <Select
                  {...field}
                  inputId={"optionsSelected"}
                  options={options}
                  getOptionLabel={(option) => `${option?.field}`}
                  getOptionValue={(option) => `${option?.id}`}
                  isClearable
                  className={
                    "form-field" + (errors.optionsSelected ? " has-error" : "")
                  }
                />
              )}
            />
            {errors.optionsSelected && (
              <Form.Text
                variant="danger"
                className="invalid error-Form.Label text-danger"
              >
                {errors.optionsSelected.message}
              </Form.Text>
            )}
          </FormGroup>
        </Col>
        <Col className="col-12 col-md-4 align-self-center">
          <PrimaryButton type="submit" dark>
            {t("search")}
          </PrimaryButton>
        </Col>
      </Row>
    </Form>
  );
};

export default FormFilterCompany;
