import { buildNextAuthOptions } from "@/auth/[...nextauth].api";
import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { z } from "zod";

const UpdateProfileBodySchema = z.object({
    nio: z.string(),
})

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method === "PUT") {
        return res.status(405).end()
    }

    const session = await unstable_getServerSession(
        req,
        res,
        buildNextAuthOptions(req, res),
    )

    if(!session) {
        return res.status(401).end();
    }

    const { bio } = timeIntervalsBodySchema.parse(req.body)

    await prisma.user.update({
        where: {
            id: session.user.id
        },
        data: {
            bio,
        }
    })

    return res.status(204).end()
}