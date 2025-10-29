import {RootState} from "../../../store";
import {createSelector} from "@reduxjs/toolkit";

const selectTechnicalLiteratureState = (state: RootState) => state.technicalLiterature;

export const selectAllTechnicalLiterature = createSelector(
    [selectTechnicalLiteratureState],
    (technicalLiteratureState) => technicalLiteratureState.list,
);

export const selectTechnicalLiteratureIsLoading = createSelector(
    [selectTechnicalLiteratureState],
    (technicalLiteratureState) => technicalLiteratureState.isLoading,
);

export const selectCurrentTechnicalLiterature = createSelector(
    [selectTechnicalLiteratureState],
    (technicalLiteratureState) => technicalLiteratureState.current,
);

export const selectTechnicalLiteratureById = createSelector(
    [selectTechnicalLiteratureState,
        (_state: RootState, id: string) => id],
    (literatureState, id) => literatureState.list.filter(position => position.id === id)[0],
);