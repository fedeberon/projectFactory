import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
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
import { useTranslation } from "react-i18next";
import TagList from "../TagList/TagList";
import Autosuggest from 'react-autosuggest';
import autosuggestStyles from "./Autosuggest.module.css";
import * as tagService from "../../services/tagService";


const FormTag = ({ toggle, image }) => {
  const [tags, setTags] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [value, setValue] = useState("");
  const [session, loading] = useSession();

  const { t, lang } = useTranslation("common");

  const {
    control,
    register,
    setError,
    formState: { errors },
    handleSubmit,
  } = useForm();

  useEffect(() => {
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

  // When suggestion is clicked, Autosuggest needs to populate the input
  // based on the clicked suggestion. Teach Autosuggest how to calculate the
  // input value for every given suggestion.
  const getSuggestionValue = suggestion => suggestion.tag;

  // Use your imagination to render suggestions.
  const renderSuggestion = suggestion => (
    <div>
      {suggestion.tag}
    </div>
  );

  // Teach Autosuggest how to calculate suggestions for any given input value.
  const getSuggestions = async (value) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    const newSuggestions = await tagService.getStartsWith(inputValue, session.accessToken);
    
    return inputLength === 0 ? [] : newSuggestions;
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
    placeholder: t("InsertTag"),
    value,
    onChange: onChange
  };

  // Autosugges will execute this function when suggestion is selected by mouse or enter key
  // This function add the tag selected to tag list
  const onSuggestionSelected = (event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) => {
    const newTags = Array.from(tags);
    newTags.push(suggestion);
    setTags(newTags);
    onSuggestionsClearRequested();
  }


  return (
    <Container fluid="sm">
      <Form onSubmit={handleSubmit(onSubmit)}>
        <img className="w-100" src={image.preview} alt="image-selected"></img>
        <FormGroup>
          <Label for="tag">{t("Tag")}</Label>
        
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
            

          {errors.tag && (
            <FormText className="error-label">{errors.tag.message}</FormText>
          )}
        </FormGroup>
        
        <div className="my-3">
          <TagList tags={tags} onDeleteTag={removeTag} />
        </div>
        
        <Button type="submit" color="primary mt-1">
          {t("AddTags")}
        </Button>
      </Form>
    </Container>
  );
};

export default FormTag;
