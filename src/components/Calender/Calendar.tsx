import React, { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { selectUserEventsArray } from '../../actions/userEvents';
import { loadUserEvents } from '../../actions/userEvents';
import styles from './Calendar.module.css';
import { RootState } from '../../reducers';
import { groupEventsByDay } from '../../utils/redux/groupEventsByDay';
import EventItem from './EventItem';

interface Props extends PropsFromRedux {}

const Calendar: React.FC<Props> = ({ events, loadUserEvents }) => {
  useEffect(() => {
    loadUserEvents();
  }, []);

  let groupedEvents: ReturnType<typeof groupEventsByDay> | undefined;
  let sortedGroupsKeys: string[] | undefined;

  if (events.length) {
    groupedEvents = groupEventsByDay(events);
    sortedGroupsKeys = Object.keys(groupedEvents).sort(
      (date1, date2) => +new Date(date1) - +new Date(date2)
    );
  }

  return groupedEvents && sortedGroupsKeys ? (
    <div className={styles.calendar}>
      {sortedGroupsKeys.map((dayKey) => {
        const events = groupedEvents ? groupedEvents[dayKey] : [];
        const groupDate = new Date(dayKey);
        const day = groupDate.getDate();
        const month = groupDate.toLocaleDateString(undefined, {
          month: 'long',
        });
        return (
          <div className={styles.calendarDay}>
            <div className={styles.calendarDayLabel}>
              <span>{`${day} ${month}`}</span>
              <div>
                <div className={styles.calendarEvents}>
                  {events.map((event) => {
                    return (
                      <EventItem key={`event_${event.id}`} event={event} />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  ) : (
    <p>Loading...</p>
  );
};

const mapStateToProps = (state: RootState) => ({
  events: selectUserEventsArray(state),
});

const mapDispatchToProps = {
  loadUserEvents,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Calendar);
