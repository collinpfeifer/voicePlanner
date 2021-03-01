import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { RootState } from '../reducers';
import { selectDateStart } from '../utils/redux/selectDateStart';

export interface UserEvent {
  id: number;
  title: string;
  dateStart: string;
  dateEnd: string;
}

export interface UserEventsState {
  byIds: Record<UserEvent['id'], UserEvent>;
  allIds: UserEvent['id'][];
}

export const LOAD_REQUEST = 'userEvents/load_request';

export interface LoadReaquestAction extends Action<typeof LOAD_REQUEST> {}

export const LOAD_SUCCESS = 'userEvents/load_success';

export interface LoadSuccessAction extends Action<typeof LOAD_SUCCESS> {
  payload: {
    events: UserEvent[];
  };
}

export const LOAD_FAILURE = 'userEvents/load_failure';

export interface LoadFailureAction extends Action<typeof LOAD_FAILURE> {
  error: string;
}

export const loadUserEvents = (): ThunkAction<
  void,
  RootState,
  undefined,
  LoadReaquestAction | LoadSuccessAction | LoadFailureAction
> => async (dispatch, getState) => {
  dispatch({
    type: LOAD_REQUEST,
  });

  try {
    const response = await fetch('http://localhost:4000/events');
    const events: UserEvent[] = await response.json();

    dispatch({
      type: LOAD_SUCCESS,
      payload: { events },
    });
  } catch (e) {
    dispatch({
      type: LOAD_FAILURE,
      error: 'Failed to load events.',
    });
  }
};

export const CREATE_REQUEST = 'userEvents/create_request';

interface CreateRequestAction extends Action<typeof CREATE_REQUEST> {}

export const CREATE_SUCCESS = 'userEvents/create_success';

export interface CreateSuccessAction extends Action<typeof CREATE_SUCCESS> {
  payload: {
    event: UserEvent;
  };
}

export const CREATE_FAILURE = 'userEvents/create_failure';

export interface CreateFailureAction extends Action<typeof CREATE_FAILURE> {}

export const createUserEvent = (): ThunkAction<
  Promise<void>,
  RootState,
  undefined,
  CreateRequestAction | CreateSuccessAction | CreateFailureAction
> => async (dispatch, getState) => {
  dispatch({
    type: CREATE_REQUEST,
  });

  try {
    const dateStart = selectDateStart(getState());
    const event: Omit<UserEvent, 'id'> = {
      title: 'No name',
      dateStart,
      dateEnd: new Date().toISOString(),
    };

    const response = await fetch(`http://localhost:4000/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });

    const createdEvent: UserEvent = await response.json();

    dispatch({
      type: CREATE_SUCCESS,
      payload: { event: createdEvent },
    });
  } catch (e) {
    dispatch({
      type: CREATE_FAILURE,
    });
  }
};

export const DELETE_REQUEST = 'userEvents/delete_request';

interface DeleteRequestAction extends Action<typeof DELETE_REQUEST> {}

export const DELETE_SUCCESS = 'userEvents/delete_success';

export interface DeleteSuccessAction extends Action<typeof DELETE_SUCCESS> {
  payload: { id: UserEvent['id'] };
}

export const DELETE_FAILURE = 'userEvents/delete_failure';

interface DeleteFailureAction extends Action<typeof DELETE_FAILURE> {}

export const deleteUserEvent = (
  id: UserEvent['id']
): ThunkAction<
  Promise<void>,
  RootState,
  undefined,
  DeleteRequestAction | DeleteSuccessAction | DeleteFailureAction
> => async (dispatch) => {
  dispatch({
    type: DELETE_REQUEST,
  });

  try {
    const response = await fetch(`http://localhost:4000/events/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      dispatch({
        type: DELETE_SUCCESS,
        payload: { id },
      });
    }
  } catch (e) {
    dispatch({ type: DELETE_FAILURE });
  }
};

export const UPDATE_REQUEST = 'userEvents/update_request';
export const UPDATE_SUCCESS = 'userEvents/update_success';
export const UPDATE_FAILURE = 'userEvents/update_failure';

export interface UpdateRequestAction extends Action<typeof UPDATE_REQUEST> {}

export interface UpdateSuccessAction extends Action<typeof UPDATE_SUCCESS> {
  payload: { event: UserEvent };
}

interface UpdateFailureAction extends Action<typeof UPDATE_FAILURE> {}

export const updateUserEvent = (
  event: UserEvent
): ThunkAction<
  Promise<void>,
  RootState,
  undefined,
  UpdateRequestAction | UpdateSuccessAction | UpdateFailureAction
> => async (dispatch) => {
  dispatch({
    type: UPDATE_REQUEST,
  });

  try {
    const response = await fetch(`http://localhost:4000/events/${event.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });
    const updatedEvent: UserEvent = await response.json();

    dispatch({ type: UPDATE_SUCCESS, payload: { event: updatedEvent } });
  } catch (e) {
    dispatch({
      type: UPDATE_FAILURE,
    });
  }
};

const selectUserEventsState = (rootState: RootState) => rootState.userEvents;

export const selectUserEventsArray = (rootState: RootState) => {
  const state = selectUserEventsState(rootState);
  return state.allIds.map((id: number) => state.byIds[id]);
};
