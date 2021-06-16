import React, { useState } from "react";
import { useSession } from "next-auth/client";
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
import ModalForm from "./ModalForm";
import Autosuggest from "react-autosuggest";
import { useTranslation } from "react-i18next";
import * as userService from "../services/userService";
import autosuggestStyles from "./FormTag/Autosuggest.module.css";

const page = 0;
const size = 5;

const AdministratorCreator = () => {
  const [modalAdministrator, setModalAdministrator] = useState(false);
  const [session] = useSession();
  const [administratorSelected, setAdministratorSelected] = useState({});
  const { t, lang } = useTranslation("common");
  const [tags, setTags] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [value, setValue] = useState("");

  const toggle = () => setModalAdministrator(!modalAdministrator);

  const onAddAdministrator = async (administrator) => {
    await userService.addAdministrator(
      administratorSelected,
      session.accessToken
    );
    toggle();
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
    placeholder: t("InsertUsername"),
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
        <button onClick={toggle}>{t("AddAdministrator")}</button>
      )}

      <ModalForm
        className={"Button"}
        modalTitle={t("AddAdministrator")}
        formBody={
          <>
            <Label for="administrator">{t("Username")}</Label>

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

            <button onClick={onAddAdministrator}>
              {t("AddAdministrator")}
            </button>
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