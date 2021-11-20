import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { professionalReducer as professionals } from './professionals';
import { projectReducer as projects } from './projects';
import { errorReducer as errors } from './errors';

const reducer = combineReducers({
    professionals,
    projects,
    errors,
});

export { professionalActions } from './professionals';
export { projectActions } from './projects';
export { errorActions } from './errors';

export default configureStore({ reducer });