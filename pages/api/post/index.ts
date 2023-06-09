import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { getSession } from "next-auth/react";

// POST /api/post
// Optional fields in body: title
// Required fields in body: content
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { inbox, content } = req.body;

  const session = await getSession({ req });
  if (session) {
    const result = await prisma.post.create({
      data: {
        inbox: { connect: { id: inbox } },
        content: content,
        author: { connect: { email: session?.user?.email } },
        published: true,
      },
    });
    res.json(result);
  } else {
    res.status(401).send({ message: "Unauthorized" });
  }
}
