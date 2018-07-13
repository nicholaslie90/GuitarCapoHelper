import {
    OPEN_CHORDS_MODAL,
    CLOSE_CHORDS_MODAL,
    OPEN_SETTINGS_MODAL,
    CLOSE_SETTINGS_MODAL,
} from "../actions/types";

const INITIAL_STATE = {
    chordsModalIsOpen: false,
    settingsModalIsOpen: false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case OPEN_CHORDS_MODAL:
            return {...state, chordsModalIsOpen: action.payload};

        case CLOSE_CHORDS_MODAL:
            return {...state, chordsModalIsOpen: action.payload};

        case OPEN_SETTINGS_MODAL:
            return {...state, settingsModalIsOpen: action.payload};

        case CLOSE_SETTINGS_MODAL:
            return {...state, settingsModalIsOpen: action.payload};

        default:
            return state;
    }
}