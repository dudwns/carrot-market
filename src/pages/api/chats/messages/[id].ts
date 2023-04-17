import client from "@/libs/server/client";
import withHandler, { ResponseType } from "@/libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@/libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  const {
    body: { message },
    session: { user },
    query: { id },
  } = req;

  if (req.method === "GET") {
    const messages = await client.chatMessage.findMany({
      where: {
        chatId: Number(id),
      },
      include: {
        chat: true,
        user: true,
      },
    });
    res.json({ ok: true, messages });
  }

  if (req.method === "POST") {
    const messageData = await client.chatMessage.create({
      data: {
        user: {
          connect: {
            id: user?.id,
          },
        },
        chat: {
          connect: {
            id: Number(id),
          },
        },
        message,
      },
    });
    res.json({ ok: true });
  }
}

export default withApiSession(
  withHandler({
    methods: ["GET", "POST"],
    handler,
  })
);

// withIronSessionApiRoute로 감싸면 req.session을 확인할 수 있다.
