'use client'
import { ArrowRight } from 'lucide-react'
import './register.css'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from 'next-auth/react'
import { GetServerSideProps } from 'next'
import { unstable_getServerProps } from 'next/dist/build/templates/pages'
import { buildNextAuthOptions } from '@/auth/[...nextauth].api'
import { api } from '@/lib/axios'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'


const UpdateProfileSchema = z.object({
    bio: z.string()
})

type UpdateProfileData = z.infer<typeof UpdateProfileSchema> 


export default function UpdateProfile() {

    const {
        register,
        handleSubmit,
        formState: {isSubmitting}

    } = useForm<UpdateProfileData>({
        resolver: zodResolver(UpdateProfileSchema),
    })

    const session = useSession()
    const router = useRouter()

    async function handleUpdateProfile(data: UpdateProfileData) {
        await api.put('/users/update-profile', {
            bio: data.bio,
        })

        await router.push(`/schedule/${session.data?.user.username}`)
    }

    return (
        <>
        <NextSeo title='Atualize seu perfil | Ignite Call' />
        <section className="containerRegister">
            <div className="headerRegister">
                <h2>Bem vindo ao Ignite Call!</h2>
                <p>
                    Precisamos de algumas informações para criar seu perfil! Ah, você pode editar essas informações depois.
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
            <form action="" className="formRegister" onSubmit={handleSubmit(handleUpdateProfile)}>
                <label>
                   <p>Foto de perfil</p>
                </label>
                <label>
                    <p>Sobre você</p>
                    <textarea rows={6} {...register('bio')} />
                    <p className="formAnnotation">
                        Fale um pouco sobre você. Isto será exibido em sua página pessoal.
                    </p>
                </label>
                <button type='submit' disabled={isSubmitting}>Finalizar <ArrowRight /></button>
            </form>
        </section>
        </>
    )
}

export const GetServerSideProps: GetServerSideProps = async ({ req, res}) => {
    const session = await unstable_getServerProps(
        req,
        res,
        buildNextAuthOptions(req, res)
    )
    return (
        props: {
            session,
        },
    )
}