import Layout from "@/Components/layout";
import useUser from "@/libs/client/useUser";
import { Chat, ChatMessage, User } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";

interface ChatWithUser extends Chat {
  createdFor: User;
  createdBy: User;
  chatMessages: ChatMessage[];
}

interface ChatResponse {
  ok: boolean;
  chats: ChatWithUser[];
}

export default function Chats() {
  const { user } = useUser();
  const { data, isLoading } = useSWR<ChatResponse>("/api/chats");

  return (
    <Layout title="채팅" hasTabBar>
      {isLoading ? (
        <span className="flex justify-center mt-3">Loading...</span>
      ) : (
        <div className="divide-y-[1px] ">
          {data?.chats?.map((chat) => (
            <div key={chat.id}>
              <Link href={`/chats/${chat.id}`}>
                <div className="flex px-4  cursor-pointer py-3 items-center space-x-3 ">
                  {chat?.createdFor?.avatar && chat?.createdFor?.id !== user?.id ? (
                    <Image
                      src={chat?.createdFor?.avatar!}
                      alt="프로필 이미지"
                      width={200}
                      height={200}
                      className="w-12 h-12 rounded-full bg-slate-500"
                    />
                  ) : chat?.createdBy?.avatar && chat?.createdFor?.id === user?.id ? (
                    <Image
                      src={chat?.createdBy?.avatar!}
                      alt="프로필 이미지"
                      width={200}
                      height={200}
                      className="w-12 h-12 rounded-full bg-slate-500"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-slate-500" />
                  )}
                  <div>
                    <p className="text-gray-700">
                      {chat?.createdFor?.id === user?.id
                        ? chat?.createdBy?.name
                        : chat?.createdFor?.name}
                    </p>
                    <p className="text-sm  text-gray-500">{chat?.chatMessages[0]?.message}</p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
