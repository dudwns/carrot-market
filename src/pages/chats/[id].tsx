import Layout from "@/Components/layout";
import Message from "@/Components/message";
import useMutation from "@/libs/client/useMutation";
import useUser from "@/libs/client/useUser";
import { Chat, ChatMessage, User } from "@prisma/client";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import useSWR from "swr";

interface MessageForm {
  message: string;
}

interface MessageWithChat extends ChatMessage {
  chat: Chat;
  user: User;
}

interface MessageResponse {
  ok: boolean;
  messages: MessageWithChat[];
}

export default function ChatDetail() {
  const { user } = useUser();
  const router = useRouter();
  const [createdMessage, { data, loading }] = useMutation(`/api/chats/messages/${router.query.id}`);
  const {
    data: messageData,
    isLoading,
    mutate,
  } = useSWR<MessageResponse>(`/api/chats/messages/${router.query.id}`);

  const { register, handleSubmit, reset } = useForm<MessageForm>();
  const onValid = ({ message }: MessageForm) => {
    reset();
    mutate(
      (prev) =>
        prev &&
        ({
          ...prev,
          messages: [...prev.messages, { id: Date.now(), message: message, user: { ...user } }],
        } as any),
      false
    );
    createdMessage({ message });
  };

  return (
    <Layout canGoBack>
      <div className="py-10 px-4 space-y-4">
        {messageData?.messages?.map((message) => (
          <Message
            key={message?.id}
            message={message?.message}
            reversed={message?.user?.id === user?.id}
            avatarUrl={message.user.avatar ? message.user.avatar : ""}
          />
        ))}
        <form
          onSubmit={handleSubmit(onValid)}
          className="fixed py-2 bg-white   bottom-0 inset-x-0 "
        >
          <div className="flex relative max-w-md items-center w-full mx-auto">
            <input
              type="text"
              {...register("message")}
              className="shadow-sm rounded-full w-full border-gray-300 focus:ring-orange-500 focus:outline-none pr-12 focus:border-orange-500"
            />
            <div className="absolute inset-y-0 flex py-1.5 pr-1.5 right-0">
              <button className="flex focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 items-center bg-orange-500 rounded-full px-3 hover:bg-orange-600 text-sm text-white">
                &rarr;
              </button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
}
