import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './Recorder.module.css';
import { start, stop } from '../../actions/recorder';
import { RootState } from '../../reducers';
import { ReactMic, ReactMicStopEvent } from 'react-mic';

const selectDateStart = (rootState: RootState) => rootState.recorder;

const selectRecorderState = (rootState: RootState) =>
  rootState.recorder.dateStart;

const addZero = (n: number) => (n < 10 ? `0${n}` : `${n}`);

const onData = (recordedBlob: Blob) => {
    console.log('chunk of real-time data is: ', recordedBlob);
  }
 
const onStop = (recordedBlob: ReactMicStopEvent) => {
    console.log('recordedBlob is: ', recordedBlob);
  }

const Recorder = () => {
  const dispatch = useDispatch();
  const dateStart = useSelector(selectDateStart);
  const started = dateStart.dateStart !== '';
  let interval = useRef<number>(0);
  const [, setCount] = useState<number>(0);
  const [record, setRecord] = useState<boolean>(false);

  const handleClick = () => {
    if (started) {
        window.clearInterval(interval.current);
        setRecord(false);
        dispatch(stop());
    } else {
      dispatch(start());
      setRecord(true);
      interval.current = window.setInterval(() => {
        setCount((count) => count + 1);
      }, 1000);
    }
  };

  useEffect(() => {
    return () => {
      window.clearInterval(interval.current);
    };
  }, []);

  let seconds = started
    ? Math.floor((Date.now() - new Date(dateStart.dateStart).getTime()) / 1000)
    : 0;
  let hours = seconds ? Math.floor(seconds / 60 / 60) : 0;
  seconds -= hours * 60 * 60;
  let minutes = seconds ? Math.floor(seconds / 60) : 0;
  seconds -= minutes * 60;

  return (
    <div
      className={`${styles.recorder} ${' '} ${
        started ? styles.recorderStarted : ''
      }`}
    >
      <ReactMic
        record={record}
        strokeColor="white"
        onStop={onStop}
        onData={onData}
        backgroundColor="black"
      />
      <button onClick={handleClick} className={styles.recorderRecord}>
        <span></span>
      </button>
      <div className={styles.recorderCounter}>{`${addZero(hours)}:${addZero(
        minutes
      )}:${addZero(seconds)}`}</div>
    </div>
  );
};

export default Recorder;
