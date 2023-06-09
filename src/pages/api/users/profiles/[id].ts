import client from "@/libs/server/client";
import withHandler, { ResponseType } from "@/libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@/libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  if (req.method === "GET") {
    const profile = await client.user.findUnique({
      where: {
        id: Number(req.query.id),
      },
    });
    res.json({
      ok: true,
      profile,
    });
  }
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);

// withIronSessionApiRoute로 감싸면 req.session을 확인할 수 있다.
