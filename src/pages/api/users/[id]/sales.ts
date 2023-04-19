import client from "@/libs/server/client";
import withHandler, { ResponseType } from "@/libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@/libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  const {
    query: { id },
  } = req;

  if (req.method === "GET") {
    const sales = await client.sale.findMany({
      where: {
        userId: Number(id),
      },
      include: {
        product: {
          include: {
            _count: {
              select: {
                favs: true,
              },
            },
          },
        },
      },
    });
    res.json({
      ok: true,
      sales,
    });
  }
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);
