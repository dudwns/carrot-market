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
    const chats = await client.chat.findMany({
      where: {
        OR: [{ createdById: user?.id }, { createdForId: user?.id }],
      },
      include: {
        createdFor: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        chatMessages: {
          select: {
            id: true,
            message: true,
            chatId: true,
          },
          orderBy: {
            id: "desc",
          },
          take: 1,
        },
      },
    });
    res.json({ ok: true, chats });
  }

  if (req.method === "POST") {
    const chatDuplicated = await client.chat.findFirst({
      where: {
        AND: [{ createdById: user?.id }, { createdForId: +receivedId }, { productId: +productId }],
      },
    });

    if (!chatDuplicated) {
      const chat = await client.chat.create({
        data: {
          createdBy: {
            connect: {
              id: user?.id,
            },
          },
          createdFor: {
            connect: {
              id: +receivedId,
            },
          },
          product: {
            connect: {
              id: +productId,
            },
          },
        },
      });
      res.json({ ok: true, chat });
    } else if (chatDuplicated) {
      res.json({ ok: true, chat: chatDuplicated });
    }
  }
}

export default withApiSession(
  withHandler({
    methods: ["GET", "POST"],
    handler,
  })
);

// withIronSessionApiRoute로 감싸면 req.session을 확인할 수 있다.
