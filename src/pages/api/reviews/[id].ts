import client from "@/libs/server/client";
import withHandler, { ResponseType } from "@/libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@/libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  const {
    query: { id },
    body: { reviewStr, score },
    session: { user },
  } = req;
  if (req.method === "GET") {
    const reviews = await client.review.findMany({
      where: {
        createdForId: Number(id),
      },
      include: { createdBy: { select: { id: true, name: true, avatar: true } } },
    });
    res.json({
      ok: true,
      reviews,
    });
  }
  if (req.method === "POST") {
    const review = await client.review.create({
      data: {
        createdBy: {
          connect: {
            id: user?.id,
          },
        },
        createdFor: {
          connect: {
            id: Number(id),
          },
        },
        review: reviewStr,
        score: Number(score),
      },
    });
    res.json({
      ok: true,
    });
  }
}

export default withApiSession(
  withHandler({
    methods: ["GET", "POST"],
    handler,
  })
);
// withIronSessionApiRoute로 감싸면 req.session을 확인할 수 있다.
