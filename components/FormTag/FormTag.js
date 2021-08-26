import React, { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useSession } from "next-auth/client";
import { Button, Container, Form } from "react-bootstrap";
import useTranslation from "next-translate/useTranslation";
// import CategoryList from "../List/CategoryList";
import Autosuggest from "react-autosuggest";
import autosuggestStyles from "./Autosuggest.module.css";
import * as tagService from "../../services/tagService";
import TagList from "../List/TagList/TagList";

const FormTag = ({ toggle, image }) => {
  const [tags, setTags] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [value, setValue] = useState("");
  const [session, loading] = useSession();
  const refInput = useRef();

  const { t } = useTranslation("common");

  const {
    control,
    register,
    setError,
    formState: { errors },
    handleSubmit,
  } = useForm();

  useEffect(() => {
    setTags(image.tags);
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
  const getSuggestionValue = (suggestion) => suggestion.tag;

  // Use your imagination to render suggestions.
  const renderSuggestion = (suggestion) => <div>{suggestion.tag}</div>;

  // Teach Autosuggest how to calculate suggestions for any given input value.
  const getSuggestions = async (value) => {
    // const inputValue = value.trim().toLowerCase();
    // const inputLength = inputValue?.length;
    // const newSuggestions = await tagService.getStartsWith(
    //   inputValue,
    //   session.accessToken
    // );
    // return inputLength === 0 ? [] : newSuggestions;
  };

  const onChange = (event, { newValue }) => {
    setValue(newValue);
  };

  // Autosuggest will call this function every time you need to update suggestions.
  const onSuggestionsFetchRequested = async ({ value }) => {
    // setSuggestions(await getSuggestions(value));
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  const onSuggestionsClearRequested = () => {
    // setSuggestions([]);
  };

  // Autosuggest will pass through all these props to the input.
  const inputProps = {
    placeholder: t("form-tag.insert-tag"),
    value,
    onChange: onChange,
  };

  // Autosugges will execute this function when suggestion is selected by mouse or enter key
  // This function add the tag selected to tag list
  const onSuggestionSelected = (
    event,
    { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }
  ) => {
    const newTags = Array.from(tags);
    newTags.push(suggestion);
    setTags(newTags);
    clearInput();
  };

  const clearInput = () => {
    // setSuggestions([]);
    // setValue("");
  };

  const onAddTag = async () => {
    // console.log(refInput.current.input.value);
    const array = new Array();
    array.push({name: refInput.current.input.value});
    // console.log(array);
    // console.log("suggestions despues de array", suggestions);
    // setSuggestions(array);
    setTags([...tags, ...array]);

    // const tag = {
    //   tag: document.querySelector("#input-tag").value.toLowerCase().trim(),
    // };

    // if (tag.tag != "") {
    //   if (!isEqual(tag)) {
    //     const newTag = await tagService.addTag(tag, session.accessToken);
    //     const newTags = Array.from(tags);
    //     newTags.push(newTag);
    //     setTags(newTags);
    //     toggle();
    //   } else {
    //     showErrorToLimitTime(
    //       t("company-creator.already-exists", {
    //         fieldName: t("the-tag"),
    //       })
    //     );
    //   }
    // } else {
    //   showErrorToLimitTime(
    //     t("company-creator.cannot-be-empty", {
    //       fieldName: t("the-tag"),
    //     })
    //   );
    // }
  };

  // useEffect(() => {
  //   console.log("suggestions", suggestions);
  //   console.log("suggestions typeof", typeof suggestions);
  // }, [suggestions]);

  // useEffect(() => {
  //   console.log("tags", tags);
  //   console.log("tags typeof", typeof tags);
  // }, [tags]);

  return (
    <Container fluid="sm">
      <Form onSubmit={handleSubmit(onSubmit)}>
        <img className="w-100" src={image.preview} alt="image-selected"></img>
        <Form.Group>
          <Form.Label htmlFor="tag">{t("form-tag.tag")}</Form.Label>

          <Autosuggest
            ref={refInput}
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
            <Form.Text
              variant="danger"
              className="invalid error-Form.Label text-danger"
            >
              {errors.tag.message}
            </Form.Text>
          )}
        </Form.Group>

        <div className="my-3">
          <TagList tags={tags} onDeleteTag={removeTag} />
        </div>

        <Button className="my-3" onClick={onAddTag}>
          {t("tag-creator.add-tag")}
        </Button>

        <Button
          type="submit"
          disabled={tags?.length == 0}
          variant="primary mt-1"
        >
          {t("add-tags")}
        </Button>
      </Form>
    </Container>
  );
};

export default FormTag;
