import { Calendar } from "@/components/Calendar";
import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useState } from "react";

interface Availability {
    possibleTimes: number[];
    availableTimes: number[];
}


interface CalendarStepProps {
    onSelectDateTime: (date: Date) => void;
}

export function CalendarStep({onSelectDateTime}: CalendarStepProps) {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const router = useRouter();

    const isDateSelected = !!selectedDate;
    const username = String(router.query.username);

    const weekDay = selectedDate ? dayjs(selectedDate).format('dddd') : null;
    const describedDate = selectedDate ? dayjs(selectedDate).format('DD[ de ]MMMM') : null;

    const selectedDateWithOutTime = selectedDate
        ? dayjs(selectedDate).format('YYYY-MM-DD')
        : null;


    const fetchAvailability = async (): Promise<Availability> => {
        const response = await api.get(`/users/${username}/availability`, {
            params: {
                date: selectedDateWithOutTime,
            },
        });
        return response.data;
    };

    function handleSelectTime(hour: number) {
        const dateWithTime = dayjs(selectedDate).set('hour', hour).startOf('hour').toDate()

        onSelectDateTime(dateWithTime)
    }

    const { data: BlockedDates } = useQuery<BlockedDates>(
        ['blocked-dates', selectedDateWithOutTime],
        fetchAvailability,
        {
            enabled: !!selectedDate, 
        }
    );

    return (
        <div className="container">
            <Calendar selectedDate={selectedDate} onDateSelected={setSelectedDate} />
            {isDateSelected && (
                <div className="TimePicker">
                    <div className="timePickerHeader">
                        {weekDay} <span>{describedDate}</span>
                    </div>
                    <div className="timePickerList">
                        {availability?.possibleTimes.map((hour) => {
                            return (
                                <button onClick={() => handleSelectTime(hour)} key={hour} disabled={!availability.availableTimes.includes(hour)} className="timerPickerItem">{String(hour).padStart(2, '0')}:00</button>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}