import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { professionalReducer as professionals } from './professionals';

const reducer = combineReducers({
    professionals
});

export { professionalActions } from './professionals';

export default configureStore({ reducer });