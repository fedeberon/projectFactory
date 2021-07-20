import React, { useState } from "react";
import { useSession } from "next-auth/client";
import {
  Button,
  Col,
  Row,
  Form,
} from "react-bootstrap";
import ModalForm from "./ModalForm";
import Autosuggest from "react-autosuggest";
import useTranslation from "next-translate/useTranslation";
import * as userService from "../services/userService";
import autosuggestStyles from "./FormTag/Autosuggest.module.css";
import Error from "../components/Error";

const page = 0;
const size = 5;

const AdministratorCreator = () => {
  const [modalAdministrator, setModalAdministrator] = useState(false);
  const [session] = useSession();
  const [administratorSelected, setAdministratorSelected] = useState({});
  const { t } = useTranslation("common");
  const [tags, setTags] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [timeErrorLive, setTimeErrorLive] = useState(0);

  const showErrorToLimitTime = (error) => {
    setError(error);
    clearTimeout(timeErrorLive);
    setTimeErrorLive(
      setTimeout(() => {
        setError("");
      }, 3000)
    );
  };

  const toggle = () => setModalAdministrator(!modalAdministrator);

  const onAddAdministrator = async (administrator) => {
    if (Object.keys(administratorSelected).length !== 0) {
      await userService.addAdministrator(
        administratorSelected,
        session.accessToken
      );
      toggle();
    } else {
      showErrorToLimitTime(t("the-administrator-cannot-be-empty"));
    }
    setAdministratorSelected({});
    setValue("");
  };

  // When suggestion is clicked, Autosuggest needs to populate the input
  // based on the clicked suggestion. Teach Autosuggest how to calculate the
  // input value for every given suggestion.
  const getSuggestionValue = (suggestion) => suggestion.username;

  // Use your imagination to render suggestions.
  const renderSuggestion = (suggestion) => <div>{suggestion.username}</div>;

  // Teach Autosuggest how to calculate suggestions for any given input value.
  const getSuggestions = async (value) => {
    const newSuggestions = await userService.getStartsWith(
      value,
      page,
      size,
      session.accessToken
    );

    return value.length === 0 ? [] : newSuggestions;
  };

  const onChange = (event, { newValue }) => {
    setValue(newValue);
  };

  // Autosuggest will call this function every time you need to update suggestions.
  const onSuggestionsFetchRequested = async ({ value }) => {
    setSuggestions(await getSuggestions(value));
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  // Autosuggest will pass through all these props to the input.
  const inputProps = {
    placeholder: t("administrator-creator.insert-username"),
    value,
    onChange: onChange,
  };

  // Autosugges will execute this function when suggestion is selected by mouse or enter key
  // This function add the tag selected to tag list
  const onSuggestionSelected = (
    event,
    { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }
  ) => {
    setAdministratorSelected(suggestion);
  };

  return (
    <>
      {session?.authorities?.includes("ROLE_ADMINISTRATOR") && (
        <Button onClick={toggle}>
          {t("administrator-creator.add-administrator")}
        </Button>
      )}

      <ModalForm
        className={"Button"}
        modalTitle={t("administrator-creator.add-administrator")}
        formBody={
          <>
            <h6>{t("administrator-creator.please-select-administrator")}</h6>
            <Form.Label htmlfor="administrator">
              {t("administrator-creator.username")}
            </Form.Label>

            <Autosuggest
              suggestions={suggestions}
              onSuggestionsFetchRequested={onSuggestionsFetchRequested}
              onSuggestionsClearRequested={onSuggestionsClearRequested}
              onSuggestionSelected={onSuggestionSelected}
              getSuggestionValue={getSuggestionValue}
              renderSuggestion={renderSuggestion}
              inputProps={inputProps}
              theme={autosuggestStyles}
            />

            <Button className="my-4" onClick={onAddAdministrator}>
              {t("administrator-creator.add-administrator")}
            </Button>
            {error && (
              <Row className="mt-2">
                <Col>
                  <Error error={error} />
                </Col>
              </Row>
            )}
          </>
        }
        modalOpen={{
          open: modalAdministrator,
          function: setModalAdministrator,
        }}
      />
    </>
  );
};

export default AdministratorCreator;
