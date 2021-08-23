import React, { useState } from 'react';
import { Alert, Col, Row } from 'react-bootstrap';
import PrimaryButton from '../Buttons/PrimaryButton/PrimaryButton';
import useTranslation from "next-translate/useTranslation";
import { useDispatch, useSelector } from 'react-redux';
import { categoriesActions } from '../../store';
import Autosuggest from 'react-autosuggest';
import autosuggestStyles from "../FormTag/Autosuggest.module.css";
import * as categoryService from "../../services/categoryService";

const CategorySelector = (props) => {
    const { typeCategory } = props;
    const dispatch = useDispatch();
    const { t } = useTranslation("common");
    const selectedCategories = useSelector(state => state.categories.selectedCategories);
    const [suggestions, setSuggestions] = useState([]);
    const [value, setValue] = useState("");
    const [error, setError] = useState("");
    const MAX_SUGGESTIONS = 5;

    const isEqual = (category) => selectedCategories.some((c) => c.name === category.name.toLowerCase());

    const onSuggestionsFetchRequested = async ({ value }) => {
        setSuggestions(await getSuggestions(value));
    };

    const onSuggestionsClearRequested = () => {
        setSuggestions([]);
      };

    const getSuggestions = async (value) => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;
        const newSuggestions = await categoryService.getAllByTypeCategoryAndStartsWith(
          typeCategory,
          inputValue
        );
    
        return inputLength === 0 ? [] : newSuggestions.slice(0, MAX_SUGGESTIONS);
    };

    const renderSuggestion = (suggestion) => <div>{suggestion.name}</div>;

    const onSuggestionSelected = (
        event,
        { suggestion }
      ) => {
        suggestion.name = suggestion.name.toLowerCase().trim();
        addCategory(suggestion);
    };

    const getSuggestionValue = (suggestion) => suggestion.name;

    const clearInput = () => {
        setSuggestions([]);
        setValue("");
    };

    const onChange = (event, { newValue }) => {
        setValue(newValue);
    };

    const removeError = () => setError("");

    const inputProps = {
        placeholder: t("form-category.insert-category"),
        value,
        onChange,
        onClick: removeError,
    };
    
    const addCategory = (category) => {
        if (category.name !== "") {
            if (!isEqual(category)) {
                const newCategories = Array.from(selectedCategories);
                newCategories.push(category);
                dispatch(categoriesActions.setSelectedCategories(newCategories));
                clearInput();
            } else {
                setError(
                    t("company-creator.already-exists", {
                    fieldName: t("company-creator.the-category"),
                }));
            }
        } else {
            setError(
                t("company-creator.cannot-be-empty", {
                fieldName: t("company-creator.the-category"),
                })
            );
        }
    };

    const handleClickButton = async () => {
        if (value !== "") {
            const suggestions = await getSuggestions(value);
            const [selectedSuggestion] = suggestions.filter(s => s.name === value);
            if (selectedSuggestion)
            addCategory(selectedSuggestion);
            else
            setError(t("form-category.write-complete-category"))
        } else {
            setError(
                t("company-creator.cannot-be-empty", {
                fieldName: t("company-creator.the-category"),
                })
            );
        }
    };

    return (<>
        <Row>
            <Col sm={12} md={8} lg={8}>
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
            </Col>
            <Col sm={12} md={4} lg={4} className="d-flex">
                <PrimaryButton
                    onClick={handleClickButton}
                    className="mx-auto mx-lg-0"
                >
                    {t("company-creator.add-category")}
                </PrimaryButton>
            </Col>
        </Row>

        <Row>
            <Col>
                {error !== "" &&
                    <Alert className="mt-4" variant="danger">{error}</Alert>
                }
            </Col>
        </Row>
    </>);
};

export default CategorySelector;
