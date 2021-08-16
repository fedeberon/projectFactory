import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { professionalReducer as professionals } from './professionals';
import { projectReducer as projects } from './projects';
import { errorReducer as errors } from './errors';
import { categoriesReducer as categories } from './categories';

const reducer = combineReducers({
    professionals,
    projects,
    categories,
    errors,
});

export { professionalActions } from './professionals';
export { categoriesActions } from './categories';
export { projectActions } from './projects';
export { errorActions } from './errors';

export default configureStore({ reducer });