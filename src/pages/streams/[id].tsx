import Layout from "@/Components/layout";
import Message from "@/Components/message";
import useMutation from "@/libs/client/useMutation";
import useUser from "@/libs/client/useUser";
import { Stream } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";

interface StreamMessage {
  id: number;
  message: string;
  user: {
    avatar?: string;
    id: number;
  };
}

interface StreamWithMessages extends Stream {
  messages: StreamMessage[];
}

interface StreamResponse {
  ok: true;
  stream: StreamWithMessages;
}

interface MessageForm {
  message: string;
}

export default function StreamDetail() {
  const { user } = useUser();
  const router = useRouter();
  const { register, handleSubmit, reset } = useForm<MessageForm>();
  const { data, mutate } = useSWR<StreamResponse>(
    router.query.id ? `/api/streams/${router.query.id}` : null,
    { refreshInterval: 1000 }
  );
  const [sendMessage, { loading, data: sendMessageData }] = useMutation(
    `/api/streams/${router.query.id}/messages`
  );
  const onValid = (form: MessageForm) => {
    if (loading) return;
    reset();
    mutate(
      (prev) =>
        prev &&
        ({
          ...prev,
          stream: {
            ...prev.stream,
            messages: [
              ...prev.stream.messages,
              { id: Date.now(), message: form.message, user: { ...user } },
            ],
          },
        } as any),
      false
    );
    sendMessage(form);
  };

  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scrollRef?.current?.scrollIntoView(); // 스크롤을 자동으로 맨 아래로 설정
  });

  return (
    <Layout canGoBack>
      <div className="py-10 px-4 space-y-4">
        <iframe
          className="w-full aspect-video rounded-md shadow-sm"
          src={`https://iframe.videodelivery.net/${data?.stream?.cloudflareId}`}
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
          allowFullScreen={true}
        ></iframe>
        <div className="mt-5">
          <h1 className="text-3xl font-bold text-gray-900">{data?.stream?.name}</h1>
          <span className="text-2xl block mt-3 text-gray-900">${data?.stream?.price}</span>
          <p className=" my-6 text-gray-700">{data?.stream?.description}</p>
          <div className="bg-orange-400 flex flex-col space-y-3 p-5 rounded-md overflow-scroll">
            <span>Stream Keys (secret)</span>
            <span className="text-white">
              <span className="font-meduim text-gray-800">URL: </span>
              {data?.stream?.cloudflareUrl}
            </span>
            <span className="text-white">
              <span className="font-meduim text-gray-800">Key: </span>
              {data?.stream?.cloudflareKey}
            </span>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Live Chat</h2>
          <div className="py-10 pb-16 h-[50vh] overflow-scroll px-4 space-y-4">
            {data?.stream?.messages.map((message) => (
              <Message
                key={message.id}
                message={message?.message}
                reversed={message.user.id === user?.id}
                avatarUrl={message.user.avatar}
              />
            ))}
            <div ref={scrollRef} />
          </div>
          <div className="fixed py-2 bg-white   bottom-0 inset-x-0 ">
            <form
              onSubmit={handleSubmit(onValid)}
              className="flex relative max-w-md items-center w-full mx-auto"
            >
              <input
                type="text"
                {...register("message", { required: true })}
                className="shadow-sm rounded-full w-full border-gray-300 focus:ring-orange-500 focus:outline-none pr-12 focus:border-orange-500"
              />
              <div className="absolute inset-y-0 flex py-1.5 pr-1.5 right-0">
                <button className="flex focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 items-center bg-orange-500 rounded-full px-3 hover:bg-orange-600 text-sm text-white">
                  &rarr;
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
