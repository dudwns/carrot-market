import client from "@/libs/server/client";
import withHandler, { ResponseType } from "@/libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@/libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  const {
    session: { user },
    body: { name, price, description },
  } = req;
  if (req.method === "POST") {
    // const {
    //   uid,
    //   rtmps: { streamKey, url },
    // } = await (
    //   await fetch(
    //     `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ID}/stream/live_inputs`,
    //     {
    //       method: "POST",
    //       headers: {
    //         Authorization: `Bearer ${process.env.CF_STREAM_TOKEN}`,
    //       },
    //       body: `{"meta": {"name":"${name}"},"recording": { "mode": "automatic", "timeoutSeconds": 10}}`,
    //     }
    //   )
    // ).json();
    const stream = await client.stream.create({
      data: {
        // cloudflareId: uid,
        // cloudflareKey: streamKey,
        // cloudflareUrl: url,
        name,
        price,
        description,
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });
    res.json({
      ok: true,
      stream,
    });
  } else if (req.method === "GET") {
    const streams = await client.stream.findMany({
      take: 10, // 10개의 항목만 가져옴
      // skip: 20, // 앞에 data 20개를 스킵하고 21번째 부터 시작
    });
    res.json({
      ok: true,
      streams,
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
