import client from "@/libs/server/client";
import withHandler, { ResponseType } from "@/libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@/libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  const {
    body: { productId, receivedId },
    session: { user },
  } = req;

  if (req.method === "GET") {
    const chat = await client.chat.findFirst({
      where: {
        createdById: user?.id,
        createdForId: receivedId,
        productId,
      },
    });
    res.json({ ok: true, chat });
  }
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);

// withIronSessionApiRoute로 감싸면 req.session을 확인할 수 있다.
