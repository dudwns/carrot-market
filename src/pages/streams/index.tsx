import FloatingButton from "@/Components/floating-button";
import Layout from "@/Components/layout";
import { Stream } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";

interface StreamsResponse {
  ok: boolean;
  streams: Stream[];
  pages: number;
}

export default function Streams() {
  const { data } = useSWR<StreamsResponse>(`/api/streams`);
  return (
    <Layout title="라이브" hasTabBar>
      <div className="divide-y-[1px] space-y-4">
        {data?.streams?.map((stream) => (
          <div key={stream.id}>
            <Link href={`/streams/${stream?.id}`} key={stream?.id}>
              <div className="pt-4 px-4 block">
                <div className="relative overflow-hidden w-full rounded-md shadow-sm bg-slate-300 aspect-video">
                  <Image
                    layout="fill"
                    src={`https://videodelivery.net/${stream.cloudflareId}/thumbnails/thumbnail.jpg?height=320`}
                    alt="썸네일"
                  />
                </div>

                <h1 className="text-2xl mt-2 font-bold text-gray-900">{stream?.name}</h1>
              </div>
            </Link>
          </div>
        ))}
        <FloatingButton href="/streams/create">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"
            ></path>
          </svg>
        </FloatingButton>
      </div>
    </Layout>
  );
}
