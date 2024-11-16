import { ArrowRight } from 'lucide-react'
import './styles.css'
import { useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
import { getWeekDays } from '@/utils/get-week-days'
import { zodResolver } from '@hookform/resolvers/zod'
import { convertTimesStringToMinutes } from '@/utils/convert-time-string-to-minutes'
import { api } from '@/lib/axios'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'

const timeIntervalsFormSchema = z.object({
    intervals: z.array(z.object({
        weekDay: z.number().min(0, {}).max(6),
        enabled: z.boolean(),
        startTime: z.string(),
        endTime: z.string(),
    })).length(7)
    .transform(intervals => intervals.filter(interval => interval.enabled))
    .refine(intervals => intervals.length > 0, {
        message: 'Você precisa selecionar pelo menos um dia da semana!',
    })
    .transform(intervals => {
        return intervals.map(interval => {
            return {
                weekDay: interval.weekDay,
                startTimeInMinutes: convertTimesStringToMinutes(interval.startTime), 
                endtTimeMinutes: convertTimesStringToMinutes(interval.endTime),
            }
        })
    })
    .refine(intervals => {
        return intervals.every(interval => interval.endtTimeMinutes - 60 >= interval.startTimeInMinutes)
    }, {
        message: 'O horário de termino deve ser de pelo menos 1h distante do início.',
    })
})

type TimeIntervalsFormInput = z.input<typeof timeIntervalsFormSchema>
type TimeIntervalsFormOutput = z.input<typeof timeIntervalsFormSchema>


export default function TimeIntervals() {

    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: {isSubmitting, errors}
    } = useForm<TimeIntervalsFormInput>({
        resolver: zodResolver(timeIntervalsFormSchema),
        defaultValues: {
            intervals: [
                {weekDay: 0, enabled: false, startTime: '08:00', endTime: '18:00'},
                { weekDay: 1, enabled: true, startTime: '08:00', endTime: '18:00'},
                { weekDay: 2, enabled: true, startTime: '08:00', endTime: '18:00'},
                { weekDay: 3, enabled: true, startTime: '08:00', endTime: '18:00'},
                { weekDay: 4, enabled: true, startTime: '08:00', endTime: '18:00'},
                { weekDay: 5, enabled: false, startTime: '08:00', endTime: '18:00'},
            ],
        }
    })

    const router = useRouter()

    const weekDays = getWeekDays()

    const { fields } = useFieldArray({
        control,
        name: 'intervals',
    })

    const intervals = watch('intervals')

    async function handleSetTimeIntervals(data: TimeIntervalsFormOutput) {
        const { intervals} = data as TimeIntervalsFormOutput

        await api.post('/usrs/time-intervals', {intervals})

        await router.push('/register/update-profile')

    }

    return (
        <>
        <NextSeo title='Selecione sua Disponibilidade | Ignite Call' noindex />
        <section className="connectBox">
            <header className="headerRegister">
                <p className="step"></p>
            </header>
            <div className="containerVoidDiv">
                    <div className="voidDiv" />
                    <div className="voidDiv" />
                    <div className="voidDiv" />
                </div>
                <form className="intervalBox" onSubmit={handleSubmit(handleSetTimeIntervals)}>
                    <div className="intervalsContainer">
                        {fields.map((field, index) => {
                            return (
                                <div className="intervalItem" key={field.id}>
                            <div className="intervalDay">
                                <div className="checkBox" />
                                <p className="step">
                                    {weekDays[field.weekDay]}
                                </p>
                                <div className="intervalInputs">
                                    <input type='time' step={5} size={2} {...register(`intervals.${index}.startTime`)} />
                                    <input type='time' step={5} size={2} {...register(`intervals.${index}.endTime`)} />
                                </div>
                            </div>
                        </div>
                            )
                        })}
                    </div>
                    {errors.intervals && (
                        <form className="FormError">{errors.intervals.message}</form>
                    )}
                    <button type='submit' disabled={isSubmitting}>
                        Próximo passo
                        <ArrowRight />
                    </button>
                </form>
        </section>
        </>
    )
}