'use client'

import { ArrowRight, Check } from 'lucide-react'
import './register.css'
import { api } from '@/lib/axios'
import { AxiosError } from 'axios'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'


export default function ConnectCalendar() {
    const session = useSession()
    const router = useRouter()

    const hasAuthError = !!router.query.error
    const isSignedIn = session.status === 'authenticated'

    async function handleConnectCalendar() {

        await signIn('google')
    }

    async function handleNavigateToNextStep() {
        await router.push('/register/time-intervals')
    }

    return (
        <> 
        <NextSeo title="Conecte a sua agenda do Google | Iginite Call" noindex />
        <section className="containerRegister">
            <div className="headerRegister">
                <h2>Conecte-se sua agenda!</h2>
                <p>
                    Conecte o seu calendário para verificar automaticamente as horas ocupadas e os 
                    novos eventos à medida em que são agendados.
                </p>
                <span className="step">
                    <p>Passo 1 de 4</p>
                </span>
                <div className="containerVoidDiv">
                    <div className="voidDiv" />
                    <div className="voidDiv" />
                    <div className="voidDiv" />
                    <div className="voidDiv" />
                </div>
            </div>
            <div className="connectBox">
                <div className="connectItem">
                    <p className="text">Google Calendar</p>
                    {
                        isSignedIn ? (
                            <button disabled>Conectado <Check /></button>
                        )
                        : 
                        (
                            <button onClick={handleConnectCalendar} className="">Conectar<ArrowRight /></button>
                        )
                    }
                </div>
                {hasAuthError && (
                    <div className="authError">
                        Falha ao se conectar ao Google, verifique se você habilitou as permissões de acesso ao Google Calendar.
                    </div>
                )}
            <button onClick={handleNavigateToNextStep} disabled={!isSignedIn} type='submit'>Proximo passo <ArrowRight /></button>
            </div>
        </section>
        </>
    )
}