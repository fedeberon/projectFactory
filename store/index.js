import { combineReducers, configureStore } from "@reduxjs/toolkit";

import { professionalReducer as professionals } from "./professionals";
import { projectReducer as projects } from "./projects";
import { errorReducer as errors } from "./errors";
import { categoriesReducer as categories } from "./categories";
import { tagsReducer as tags } from "./tags";

const reducer = combineReducers({
  professionals,
  projects,
  categories,
  tags,
  errors,
});

export { professionalActions } from "./professionals";
export { categoriesActions } from "./categories";
export { tagsActions } from "./tags";
export { projectActions } from "./projects";
export { errorActions } from "./errors";

export default configureStore({ reducer });
