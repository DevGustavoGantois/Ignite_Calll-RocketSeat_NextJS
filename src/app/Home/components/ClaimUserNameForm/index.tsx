"use client";

import './ClaimUserForm.css';
import { ArrowBigRight } from "lucide-react";
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';

const claimUsernameFormSchema = z.object({
    username: z.string().min(3, { message: 'O usuário precisa ter pelo menos 3 letras.' })
        .regex(/^([a-z\\-]+)$/i, { message: 'O usuário pode ter apenas letras e hifens.' })
        .transform((username) => username.toLowerCase()),
});

type ClaimUserNameFormData = z.infer<typeof claimUsernameFormSchema>;

export function ClaimUserNameForm() {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ClaimUserNameFormData>({
        resolver: zodResolver(claimUsernameFormSchema),
    });
    
    const router = useRouter();  

    async function handleClaimUsername(data: ClaimUserNameFormData) { 
        const { username } = data;
        
        await router.push(`/register?username=${username}`);
    }

    return (
        <form className="form" onSubmit={handleSubmit(handleClaimUsername)}>
            <div className="controlContainer">
                <input 
                    type="text" 
                    placeholder="Seu usuário" 
                    prefix="ignite.com/" 
                    className="input" 
                    {...register('username')} 
                />
                <button type="submit" disabled={isSubmitting}>
                    Reservar <ArrowBigRight />
                </button>
                <p className="formAnotation">
                    {errors.username ? errors.username.message : 'Digite o nome do usuário desejado.'}
                </p>
            </div>
        </form>
    );  
}
