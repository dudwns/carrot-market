import client from "@/libs/server/client";
import withHandler, { ResponseType } from "@/libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@/libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  const { token } = req.body;
  const foundToken = await client.token.findUnique({
    // 해당 토큰이 존재하면 해당 token을 리턴
    where: {
      payload: token,
    },
    // include: {
    //   user: true, //user 정보도 받음
    // },
  });
  if (!foundToken) return res.status(404).end(); // 토큰이 존재하지 않으면
  req.session.user = {
    id: foundToken.userId,
  }; // user 세션을 만듦
  await req.session.save(); // 쿠키에 저장
  await client.token.deleteMany({
    // 해당 유저의 토큰을 모두 삭제
    where: {
      userId: foundToken.userId,
    },
  });
  res.json({ ok: true });
}
export default withApiSession(withHandler("POST", handler));

// withIronSessionApiRoute로 감싸면 req.session을 확인할 수 있다.
