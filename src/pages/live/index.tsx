import FloatingButton from "@/Components/floating-button";
import Layout from "@/Components/layout";
import Link from "next/link";

export default function Live() {
  return (
    <Layout title="라이브" hasTabBar>
      <div className="divide-y-[1px] space-y-4">
        {[1, 2, 3, 4, 5].map((_, i) => (
          <div>
            <Link href={`/live/${i}`} key={i}>
              <div className="pt-4 px-4 block">
                <div className="w-full rounded-md shadow-sm bg-slate-300 aspect-video" />
                <h1 className="text-2xl mt-2 font-bold text-gray-900">Galaxy 550</h1>
              </div>
            </Link>
          </div>
        ))}
        <FloatingButton href="/live/create">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"
            ></path>
          </svg>
        </FloatingButton>
      </div>
    </Layout>
  );
}