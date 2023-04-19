import client from "@/libs/server/client";
import withHandler, { ResponseType } from "@/libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@/libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  const {
    session: { user },
    body: { userId, productId },
    query: { id },
  } = req;

  if (req.method === "GET") {
    const sale = Boolean(
      await client.sale.findFirst({
        where: {
          userId: user?.id,
          productId: Number(id),
        },
      })
    );
    if (sale) {
      res.json({
        ok: true,
        isSale: true,
      });
    } else {
      res.json({
        ok: true,
        isSale: false,
      });
    }
  }
  if (req.method === "POST") {
    const sale = await client.sale.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
        product: {
          connect: {
            id: +productId,
          },
        },
      },
    });

    res.json({
      ok: true,
      isSale: true,
    });
  }
}

export default withApiSession(
  withHandler({
    methods: ["GET", "POST"],
    handler,
  })
);
