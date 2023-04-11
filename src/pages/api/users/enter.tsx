import twilio from "twilio";
import client from "@/libs/server/client";
import withHandler, { ResponseType } from "@/libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";

const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  const { phone, email } = req.body;
  const user = phone ? { phone } : email ? { email } : null;
  if (!user) return res.status(400).json({ ok: false });
  const payload = Math.floor(100000 + Math.random() * 900000) + ""; // 6자리 랜덤 숫자 생성
  const token = await client.token.create({
    data: {
      payload,
      user: {
        connectOrCreate: {
          // user가 없으면 새 user를 생성하고 token을 연결, user가 있으면 기존 유저에 토큰을 연결
          where: {
            ...user,
          },
          create: {
            name: "Anonymous",
            ...user,
          },
        },
      },
    },
  });
  if (phone) {
    // const message = await twilioClient.messages.create({
    //   messagingServiceSid: process.env.TWILIO_MSID,
    //   to: process.env.MY_PHONE!,
    //   body: `로그인 토큰은 ${payload}입니다.`,
    // });
    // console.log(message);
  } else if (email) {
    // email 인증
  }

  return res.json({
    ok: true,
  });
}

export default withHandler({ methods: ["POST"], handler, isPrivate: false });

// upsert: 생성하거나 수정할 때 사용, 뭔가 만들 때는 x
// create, update, where이 존재
