import dayjs from 'dayjs';
import { getWeekDays } from '@/utils/get-week-days'
import { CaretLeft } from 'phosphor-react'
import { CaretRight } from 'phosphor-react'
import { useMemo, useState } from 'react'
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { BlockedDates } from '@/app/register/schedule/[username]/ScheduleForm/CalendarStep';
import { api } from '@/lib/axios';

interface CalendarWeek {
    week: number;
    days: Array<{
        date: dayjs.Dayjs
        disabled: boolean;
    }>
}

interface BlockedDates {
    blockedWeekDays: number[];
    blockedDates: number[];
}

type CalendarWeeks = CalendarWeek[];

interface CalendarProps {
    selectedDate?: Date | null;
    onDateSelected: (date: Date) => void;
}

export function Calendar({ selectedDate, onDateSelected }: CalendarProps) {
    const [currentDate, setCurrentDate] = useState(() => {
        return dayjs().startOf('month') 
    })

    const router = useRouter()

    function handlePreviousMonth() {
        const previousMonthDate = currentDate.subtract(1, 'month')
        setCurrentDate(previousMonthDate)
    }

    function handleNextMonth() {
        const nextMonthDate = currentDate.add(1, 'month')
        setCurrentDate(nextMonthDate)
    }

    const shortWeekDays = getWeekDays({ short: true })

    const currentMonth = currentDate.format('MMMM')
    const currentYear = currentDate.format('YYYY')

    const username = String(router.query.username)

    const { data: BlockedDates } = useQuery<BlockedDates>(
        ['blocked-dates', currentDate.get('year'), currentDate.get('month')],
        async () => {
            const response = await api.get(`/users/${username}/blocked-dates`, {
                params: {
                    year: currentDate.get('year'),
                    month: currentDate.get('month') + 1,
                }
            })

            return response.data
        }

    )

    const calendarWeeks = useMemo(() => {
        if (!BlockedDates) {
            return []
        }

        const daysInMonthArray = Array.from({
            length: currentDate.daysInMonth(),
        }).map((_, i) => {
            return currentDate.set('date', i + 1)
        })

        const firstWeekDay = currentDate.get('day')

        const previousMonthFillArray = Array.from({
            length: firstWeekDay,
        }).map((_, i) => {
            return currentDate.subtract(i + 1, 'day')
        }).reverse()

        const lastDayInCurrentMonth = currentDate.set('date', currentDate.get.daysInMonth()).get('day')
        const lastWeekDay = currentDate.get('day')

        const nextMonthFillArray = Array.from({
            length: 7 - (lastWeekDay + 1),
        }).map((_, i) => {
            return lastDayInCurrentMonth.add(i + 1, 'day')
        })

        const calendarDays =  [
            ...previousMonthFillArray.map(date => {
                return { date, disabled: true}
            }),
            ...daysInMonthArray.map(date => {
                return { date, disabled: date.endOf('day').isBefore(new Date()) || BlockedDates?.blockedWeekDays.includes(date.get('day')) ||
                    BlockedDates.blockedDates.includes(date.get('date'))
                }
            }),
            ...nextMonthFillArray.map(date => {
                return { date, disabled: true}
            }),
        ]

        const calendarWeeks = calendarDays.reduce<CalendarWeeks>(
            (weeks, _, i, original) => {
                const isNewWeek = i % 7 === 0

                if(!isNewWeek) {
                    weeks.push({
                        week: i / 7 + 1,
                        days: original.slice(i, i + 7)
                })
                }

                return weeks
            }, 
            [],
        )

        return calendarWeeks
    }, [currentDate, BlockedDates])

    return (
        <div className="calendarContainer">
            <div className="calendarHeader">
                <h1 className="calendarTitle">
                    {currentMonth} <span>{currentYear}</span>
                </h1>

                <div className="calendarActions">
                    <button onClick={handlePreviousMonth} title='Previous month'>
                        <CaretLeft />
                    </button>
                    <button onClick={handleNextMonth} title='Next Month'>
                        <CaretRight />
                    </button>
                </div>
            </div>

            <div className="calendarBody">
                <thead>
                    <tr>
                        {shortWeekDays.map(weekDay => (
                            <th key={weekDay}>{weekDay}.</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {calendarWeeks.map(week => {
                        return (
                            <tr key={week.week}>{week.days.map(({date, disabled}) => {
                                return (
                                    <td key={date.toString()}>
                                        <button disabled={disabled} onClick={() => onDateSelected(date.toDate())} className="calendarDay">{date.get('date')}</button>
                                    </td>
                                )
                            })}</tr>
                        )
                    })}
                </tbody>
            </div>
        </div>
    )
}
