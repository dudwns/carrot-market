import Layout from "@/Components/layout";
import Link from "next/link";

export default function Chats() {
  return (
    <Layout title="채팅" hasTabBar>
      <div className="divide-y-[1px] ">
        {[1, 2, 3, 4, 5, 6, 7].map((_, i) => (
          <div>
            <Link href={`/chats/${i}`} key={i}>
              <div className="flex px-4  cursor-pointer py-3 items-center space-x-3 ">
                <div className="w-12 h-12 rounded-full bg-slate-300" />
                <div>
                  <p className="text-gray-700">Steve Jebs</p>
                  <p className="text-sm  text-gray-500">내일 오후 2시에 홍대에서 만나요.</p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </Layout>
  );
}
