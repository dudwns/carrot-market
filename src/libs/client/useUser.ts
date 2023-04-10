import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";

export default function useUser() {
  const { data, error } = useSWR("/api/users/me"); // 2개의 인자가 필요, 첫 번째는 요청을 보낼 URL(캐시를 저장할 때 사용할 Key이기도 함), 두 번째는 fetcher 함수
  const router = useRouter();
  useEffect(() => {
    if (data && !data.ok) {
      router.replace("/enter");
    }
  }, [data, router]);

  //return router.replace("/enter"); // push와 다른 점은 뒤로가기 히스토리에 기록이 남지 않음

  return { user: data?.profile, isLoading: !data && !error };
}
