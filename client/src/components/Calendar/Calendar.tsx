
import { useEffect, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import Icon from '@mdi/react';
import { mdiClockOutline, mdiMapMarker } from '@mdi/js';
import {
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Popover,
    useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import dayjs from 'dayjs';
import { z } from 'zod';

import { type CalendarEvents, CalendarEventsArraySchema } from '@dashboard-buddy/types';

import type { FunctionComponent } from 'react';
import type { EventApi, EventInput } from '@fullcalendar/core';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';

import styles from './Calendar.module.scss';

const _EventExtendedProps = z.object({
    location: z.string().max(255).nullable()
});

const translateEventDataForFullCalendar =
    ({ eventData }: { eventData: CalendarEvents }): EventInput[] =>
        eventData.map(({ eventId, title, location, startTime, endTime }) => ({
            eventId,
            end: endTime,
            start: startTime,
            extendedProps: {
                location
            },
            title
        }));

const Calendar: FunctionComponent = () => {
    const [ eventAnchorEl, setEventAnchorEl ] = useState<HTMLElement | null>(null);
    const [ eventList, setEventList ] = useState<EventInput[]>([])
    const [ getEventsStatus, setGetEventsStatus ] = useState<string>('loading');
    const [ selectedEvent, setSelectedEvent ] = useState<EventApi | null>(null);

    const calendarRef = useRef<InstanceType<typeof FullCalendar>>(null);
    const isMediumScreen = useMediaQuery(useTheme().breakpoints.down('md'));

    useEffect(() => {
        void (async () => {
            try {
                const response = await fetch('/api/calendar/events');
                const rawData: unknown = await response.json();
                const eventData = CalendarEventsArraySchema.parse(rawData);
                const processedEventData = translateEventDataForFullCalendar({ eventData });

                setEventList(processedEventData)
                setGetEventsStatus('complete');
            } catch (error) {
                console.error({ error });
                setGetEventsStatus('error');
            }
        })();
    }, []);

    useEffect(() => {
        if (calendarRef.current) {
            const calendar = calendarRef.current.getApi();
            calendar.changeView(isMediumScreen ? 'listWeek' : 'dayGridMonth');
        }
    }, [ isMediumScreen ]);

    return (
        <div className={styles.root}>
            <div className={styles['calendar-container']}>
                <FullCalendar
                    eventClick={({ el, event }) => {
                        setEventAnchorEl(el);
                        setSelectedEvent(event);
                    }}
                    eventInteractive={false}
                    events={eventList}
                    expandRows
                    fixedWeekCount={false}
                    handleWindowResize
                    headerToolbar={{
                        start: 'title',
                        center: '',
                        right: 'prev,next'
                    }}
                    height='auto'
                    initialView={isMediumScreen ? 'listWeek' : 'dayGridMonth'}
                    plugins={[ bootstrap5Plugin, dayGridPlugin, listPlugin ]}
                    ref={calendarRef}
                    themeSystem='bootstrap5'
                />
            </div>
            { (!!eventAnchorEl && !!selectedEvent) &&
                <Popover
                    anchorEl={eventAnchorEl}
                    anchorOrigin={{
                        horizontal: 'center',
                        vertical: 'bottom'
                    }}
                    classes={{ paper: styles.popover }}
                    onClose={() => { setEventAnchorEl(null) }}
                    open
                    transformOrigin={{
                        horizontal: 'left',
                        vertical: 'top'
                    }}
                >
                    <List>
                        <ListItem>
                            <ListItemText classes={{ root: styles['popover-title']}} primary={selectedEvent.title} />
                        </ListItem>
                        { !!selectedEvent.extendedProps.location &&
                            <ListItem>
                                <ListItemIcon classes={{ root: styles.icon}}>
                                    <Icon path={mdiMapMarker} size={.9} />
                                </ListItemIcon>
                                <ListItemText primary={(selectedEvent.extendedProps as  z.infer<typeof _EventExtendedProps>).location} />
                            </ListItem>
                        }
                        <ListItem>
                            <ListItemIcon classes={{ root: styles.icon}}>
                                <Icon path={mdiClockOutline} size={.9} />
                            </ListItemIcon>
                            <ListItemText primary={`${dayjs(selectedEvent.start).format('h:mma')} to ${dayjs(selectedEvent.end).format('h:mma')}`} />
                        </ListItem>
                    </List>
                </Popover>
            }
        </div>
    );
};

export default Calendar;