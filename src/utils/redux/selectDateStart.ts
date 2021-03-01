import { RootState } from '../../reducers';
import { selectRecorderState } from './selectRecorderState';

export const selectDateStart = (rootState: RootState) =>
  selectRecorderState(rootState).dateStart;
