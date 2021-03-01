import { START, STOP, StartAction, StopAction } from '../actions/recorder';

interface RecorderState {
  dateStart: string;
}

const initialState: RecorderState = {
  dateStart: '',
};


const recorderReducer = (
  state: RecorderState = initialState,
  action: StartAction | StopAction
) => {
  switch (action.type) {
    case START:
      return { ...state, dateStart: new Date().toISOString() };
    case STOP:
      return { ...state, dateStart: '' };
    default:
      return state;
  }
};

export default recorderReducer;
