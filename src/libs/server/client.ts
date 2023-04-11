import { PrismaClient } from "@prisma/client";

declare global {
  var client: PrismaClient | undefined;
}

const client = global.client || new PrismaClient(); // glbbal client가 없으면 객체 생성

if (process.env.NODE_ENV === "development") global.client = client; // client를 global client에 넣음

export default new PrismaClient();
