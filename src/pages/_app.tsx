import useUser from "@/libs/client/useUser";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SWRConfig } from "swr"; //모든 SWR 훅에 대한 global 옵션을 제공

function CustomUser() {
  const { user } = useUser();
  return null;
} // 페이지를 보호

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig value={{ fetcher: (url: string) => fetch(url).then((response) => response.json()) }}>
      <div className="w-full max-w-xl mx-auto">
        <CustomUser />
        <Component {...pageProps} />
      </div>
    </SWRConfig>
  );
}
