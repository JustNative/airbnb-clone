"use client"

import { useEffect, useState } from 'react';
import { DateRange, Range, RangeKeyDict } from 'react-date-range'

import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'

interface CalendarProps {
    value: Range;
    disabledDates?: Date[];
    onChange: (value: RangeKeyDict) => void;
}

const Calendar: React.FC<CalendarProps> = ({
    value,
    disabledDates,
    onChange
}) => {

    const [isMouted, setIsMouted] = useState(false);


    useEffect(() => {
        if (!isMouted) {
            setIsMouted(true)
        }
    }, [isMouted])

    if (!isMouted) return null;

    return (
        <DateRange
            onChange={onChange}
            rangeColors={['#262626']}
            ranges={[value]}
            date={new Date()}
            direction='vertical'
            showDateDisplay={false}
            minDate={new Date()}
            disabledDates={disabledDates}
        />
    )
}

export default Calendar