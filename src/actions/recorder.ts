import { Action } from 'redux';

export const START = 'recorder/start';
export const STOP = 'recorder/stop';

export type StartAction = Action<typeof START>;
export type StopAction = Action<typeof STOP>;

export const start = (): StartAction => ({
  type: START,
});

export const stop = (): StopAction => ({
  type: STOP,
});
