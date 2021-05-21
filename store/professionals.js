import {createSlice} from '@reduxjs/toolkit';

const { reducer, actions } = createSlice({
    name: 'professionals',
    initialState: {
        items: [],
        selectedId: null,
        professional: null
    },

    reducers: {
        store(state, action) {
            const professional = action.payload;
            professional.forEach(item => state.items.push(item));
        },
        select(state, action) {
            state.selectedId = action.payload.id;
        },
        set(state, action){
            state.prefessional = action.payload;
        },
        addItems(state, action){
            const professionals = action.payload;
            professionals.forEach(item => state.items.push(item));
        },
        addItem(state, action){
            const professional = action.payload;
            state.items.push(professional);
            console.log(professional);
        }

    }
});


export { actions as professionalActions };
export { reducer as professionalReducer };