import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { professionalReducer as professional } from './professionals';

const reducer = combineReducers({
    professional
});

export { professionalActions } from './professionals';

export default configureStore({ reducer });