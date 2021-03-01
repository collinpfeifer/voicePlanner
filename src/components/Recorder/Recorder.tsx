import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './Recorder.module.css';
import { start, stop } from '../../actions/recorder';
import { ReactMic, ReactMicStopEvent } from 'react-mic';
import { addZero } from '../../utils/addZero';
import {selectDateStart} from '../../utils/redux/selectDateStart';
import { createUserEvent } from '../../actions/userEvents';


const onData = (recordedBlob: Blob) => {
  console.log('chunk of real-time data is: ', recordedBlob);
};

const onStop = (recordedBlob: ReactMicStopEvent) => {
  console.log('recordedBlob is: ', recordedBlob);
};

const Recorder = () => {
  //Initialzing state and dispatch for redux
  const dispatch = useDispatch();
  const dateStart = useSelector(selectDateStart);
  const started = dateStart !== '';
  let interval = useRef<number>(0);
  const [, setCount] = useState<number>(0);
  const [record, setRecord] = useState<boolean>(false);

  //starting and stopping record button
  const handleClick = () => {
    if (started) {
      window.clearInterval(interval.current);
      setRecord(false);
      dispatch(createUserEvent());
      dispatch(stop());
    } else {
      dispatch(start());
      setRecord(true);
      interval.current = window.setInterval(() => {
        setCount((count) => count + 1);
      }, 1000);
    }
  };

  //Used for stopping possible memory leak
  useEffect(() => {
    return () => {
      window.clearInterval(interval.current);
    };
  }, []);

  //calculating time to display from Date()
  let seconds = started
    ? Math.floor((Date.now() - new Date(dateStart).getTime()) / 1000)
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
