import { api } from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { CalendarBlank, Clock } from "phosphor-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const confirmFormSchema = z.object({
    name: z.string().min(3, { message: 'O nome precisa de no mínimo 3 caracteres.'}),
    email: z.string().email({ message: 'Digite um email válido.'}),
    observations: z.string().nullable(),
})

interface ConfirmStepProps {
    schedulingDate: Date;
    onCancelConfirmation: () => void;
}

type confirmFormData = z.infer<typeof confirmFormSchema>

export function ConfirmStep({schedulingDate, onCancelConfirmation}: ConfirmStepProps) {

    const {register, handleSubmit, formState:{ isSubmitting, errors }} = useForm<confirmFormData>({
        resolver: zodResolver(confirmFormSchema)
    })

    const router = useRouter()
    const username = String(router.query.username)

    async function handleConfirmScheduling(data: confirmFormData) {
        
        const { name, email, observations} = data
        
        await api.post(`/users/${username}/schedule`, {
            name,
            email,
            observations,
            date: schedulingDate,
        })

        onCancelConfirmation()
    }

    const describeDate = dayjs(schedulingDate).format('DD[ de ]MMMM[ de ]YYYY')
    const describeTime = dayjs(schedulingDate).format('HH:mm[h]')

    return (
        <form onSubmit={handleSubmit(handleConfirmScheduling)} className="confirmForm">
            <div className="formHeader">
                <p>
                    <CalendarBlank />
                    {describeDate}
                </p>
                <p>
                    <Clock />
                    {describeTime}
                </p>
            </div>
            <label>
                <p>Nome completo</p>
                <input type="text" placeholder="Seu nome" {...register('name')}/>
                {errors.name && (
                    <p className="formError">
                        {errors.name.message}
                    </p>
                )}
            </label>
            <label>
                <p>Endereço de Email</p>
                <input type="email" placeholder="jhondoe@example.com" {...register('email')} />
                {errors.email && (
                    <p className="formError">
                        {errors.email.message}
                    </p>
                )}
            </label>
            <label>
                <p>Observações</p>
                <textarea {...register('observations')} />
            </label>
            <div className="formActions">
                <button type="button" onClick={onCancelConfirmation}>Cancelar</button>
                <button type="submit" disabled={isSubmitting}>Confirmar</button>
            </div>
        </form>
    )
}