import useUser from "@/libs/client/useUser";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Script from "next/script";
import { SWRConfig } from "swr"; //모든 SWR 훅에 대한 global 옵션을 제공

// function CustomUser() {
//   const { user } = useUser();
//   return null;
// } // 페이지를 보호

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig value={{ fetcher: (url: string) => fetch(url).then((response) => response.json()) }}>
      <div className="w-full max-w-xl mx-auto">
        {/* <CustomUser /> */}
        <Component {...pageProps} />
      </div>
      {/* <Script src="https://developers.kakao.com/sdk/js/kakao.js" strategy="afterInteractive" />
      <Script
        src="https://connect.facebook.net/en_US/sdk.js"
        onLoad={() => {
          // 앞에 스크립트를 다 불러오고 난 후에  함수를 실행
          window.fbAsyncInit = function () {
            FB.init({
              appId: "your-app-id",
              autoLogAppEvents: true,
              xfbml: true,
              version: "v16.0",
            });
          };
        }}
        strategy="lazyOnload"
      /> */}
    </SWRConfig>
  );
}

// 모든 페이지에서 공통으로 사용되는 컴포넌트를 선언하고 레이아웃 구조를 정의
