import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { professionalReducer as professionals } from './professionals';
import { projectReducer as projects } from './projects';

const reducer = combineReducers({
    professionals,
    projects
});

export { professionalActions } from './professionals';
export { projectActions } from './projects';

export default configureStore({ reducer });