import {
    OPEN_CHORDS_MODAL,
    CLOSE_CHORDS_MODAL,
    OPEN_SETTINGS_MODAL,
    CLOSE_SETTINGS_MODAL
} from './types'

export const openChordsModal = () => ({
    type: OPEN_CHORDS_MODAL,
    payload: true
});


export const closeChordsModal = () => ({
    type: CLOSE_CHORDS_MODAL,
    payload: false
});

export const openSettingsModal = () => ({
    type: OPEN_SETTINGS_MODAL,
    payload: true
});


export const closeSettingsModal = () => ({
    type: CLOSE_SETTINGS_MODAL,
    payload: false
});