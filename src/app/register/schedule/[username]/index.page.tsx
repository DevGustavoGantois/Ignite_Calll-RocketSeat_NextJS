import { prisma } from "@/lib/prisma";
import { GetStaticPaths, GetStaticProps } from "next";
import Image from "next/image";
import { ScheduleForm } from "./ScheduleForm";
import { NextSeo } from "next-seo";

interface ScheduleProps {
    user: {
        name: string;
        bio: string;
        avatarUrl: string;
    }
}

export default function Schedule({user}: ScheduleProps) {
    return (
        <>
        <NextSeo title={`Agendar com ${user.name} | Ignite Call`} />
        <div className="container">
            <div className="userHeader">
                <Image src={user.avatarUrl} width={400} height={400} alt="" />
                <header>{user.name}</header>
                <p>{user.bio}</p>
            </div>
            <ScheduleForm />
        </div>
        </>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [],
        fallback: 'blocking',
    }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const username = String(params?.username )

    const user = await prisma.user.findUnique({
        where: {
            username,
        }
    })

    if (!user) {
        return {
            notFound: true,
        }
    }

    return {
        props: {
            user: {
                name: user.name,
                bio: user.bio,
                avatarUrl: user.avatar_url
            },
        },
        revalidate: 60 * 60 * 24, //1 day
    }
}