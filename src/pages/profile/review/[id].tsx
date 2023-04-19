import Button from "@/Components/button";
import Input from "@/Components/input";
import Layout from "@/Components/layout";
import TextArea from "@/Components/textarea";
import useMutation from "@/libs/client/useMutation";
import useUser from "@/libs/client/useUser";
import { cls } from "@/libs/client/utils";
import { Review, User } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";

interface RevieWithUser extends Review {
  createdBy: User;
}

interface ReviewsResponse {
  ok: boolean;
  reviews: RevieWithUser[];
}

interface ProfileResponse {
  ok: boolean;
  profile: User;
}

interface ReviewForm {
  review: string;
}

interface ReviewMutateResponse {
  ok: boolean;
}
export default function Profile() {
  const { user } = useUser();
  const router = useRouter();
  const { register, handleSubmit } = useForm<ReviewForm>();
  const [score, setScore] = useState(5);
  const { data } = useSWR<ReviewsResponse>(
    router?.query?.id ? `/api/reviews/${router.query.id}` : null
  );
  const { data: profileData } = useSWR<ProfileResponse>(
    router?.query?.id ? `/api/users/profiles/${router.query.id}` : null
  );
  const [createdReview, { data: reviewMutateData, loading }] = useMutation<ReviewMutateResponse>(
    `/api/reviews/${router.query.id}`
  );
  const onValid = ({ review }: ReviewForm) => {
    if (loading) return;
    createdReview({ reviewStr: review, score });
  };

  useEffect(() => {
    if (reviewMutateData && reviewMutateData.ok) {
      router.push(`/profile/${router?.query?.id}`);
    }
  }, [reviewMutateData, router]);

  return (
    <Layout title="프로필 리뷰" canGoBack hasTabBar>
      <div className="px-4">
        <div className="flex items-center mt-4 space-x-3 mb-4">
          {profileData?.profile?.avatar ? (
            <>
              <Image
                src={profileData?.profile?.avatar}
                alt="프로필 이미지"
                width={200}
                height={200}
                className=" w-16 h-16 bg-slate-500 rounded-full"
              />
            </>
          ) : (
            <div className="w-16 h-16 bg-slate-500 rounded-full" />
          )}

          <div className="flex flex-col">
            <span className="font-medium text-gray-900">
              {user?.name ? profileData?.profile?.name : "Loading..."}
            </span>
            {Number(router.query.id) === user?.id ? (
              <Link href="/profile/edit">
                <span className="text-sm text-gray-500 font-medium">프로필 편집</span>
              </Link>
            ) : null}
          </div>
        </div>
        <form onSubmit={handleSubmit(onValid)}>
          <div className="flex items-center mb-5 ">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i + 1}
                className={cls(
                  "h-10 w-10 cursor-pointer",
                  score >= i + 1 ? "text-yellow-400" : "text-gray-400"
                )}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                onClick={() => {
                  setScore(i + 1);
                }}
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <div className="mb-2">
            <TextArea
              placeholder="최소 10자"
              register={register("review", { required: true, minLength: 10 })}
            ></TextArea>
          </div>
          <Button loading={loading} text="제출하기"></Button>
        </form>
      </div>
    </Layout>
  );
}
