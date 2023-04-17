import Button from "@/Components/button";
import Layout from "@/Components/layout";
import useMutation from "@/libs/client/useMutation";
import useUser from "@/libs/client/useUser";
import { cls } from "@/libs/client/utils";
import { Product, User } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import useSWR from "swr";
import { useSWRConfig } from "swr";

interface ProductWithUser extends Product {
  user: User;
} // Product의 모든 필드도 가지고, user 라는 User 타입 필드를 하나 더 가진다.

interface ItemDetailResponse {
  ok: boolean;
  product: ProductWithUser;
  relatedProducts: Product[];
  isLiked: boolean;
}

export default function ItemDetail() {
  const { user, isLoading } = useUser();
  const router = useRouter();
  // const { mutate } = useSWRConfig();
  const { data, mutate: boundMutate } = useSWR<ItemDetailResponse>(
    router.query.id ? `/api/products/${router.query.id}` : null
  );
  const [toggleFav, { loading }] = useMutation(`/api/products/${router.query.id}/fav`);
  const onFacvoriteClick = () => {
    if (!data) return;

    // mutate("/api/users/me", (prev: any) => ({ ok: !prev.ok }), false); // 전역적으로 요청한 key의 data를 수정 가능
    if (!loading) {
      toggleFav({});
      boundMutate({ ...data, isLiked: !data.isLiked }, false); // 캐싱된 data를 수정, 두 번째 인자는 재검증 유무 (API 재요청)
    }
  };

  return (
    <Layout canGoBack>
      <div className="px-4 py-10">
        <div className="mb-8">
          {data?.product?.image ? (
            <div className="relative h-96">
              <Image
                src={data.product.image}
                alt="제품 이미지"
                layout="fill"
                className=" bg-slate-300 object-cover"
              />
            </div>
          ) : (
            <div className="h-96 bg-slate-300" />
          )}
          <div className="flex cursor-pointer py-3 border-t border-b items-center space-x-3 ">
            {data?.product?.user?.avatar ? (
              <Image
                src={data.product.user.avatar}
                alt="프로필 이미지"
                width={200}
                height={200}
                className=" w-12 h-12 rounded-full bg-slate-500"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-slate-500" />
            )}
            <div>
              <p className="text-sm font-medium text-gray-700">{data?.product?.user?.name}</p>
              <Link href={`/users/profiles/${data?.product?.user?.id}`}>
                <span className="text-xs -font-medium text-gray-500">프로필 보기</span>
              </Link>
            </div>
          </div>
          <div className="mt-5">
            <h1 className="text-3xl font-bold text-gray-900">
              {data ? data?.product?.name : "Loading..."}
            </h1>
            <span className="text-3xl mt-3 text-gray-900 block">${data?.product?.price}</span>
            <p className="text-base my-6 text-gray-700">{data?.product?.description}</p>
            <div className="flex items-center justify-between space-x-2">
              <Button large text="Talk to seller" />
              <button
                onClick={onFacvoriteClick}
                className={cls(
                  "p-3 rounded-md flex items-center justify-center hover:bg-gray-100",
                  data?.isLiked
                    ? "text-red-500 hover:text-red-600"
                    : "text-gray-400 hover:text-gray-500"
                )}
              >
                {data?.isLiked ? (
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6 "
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Similar items</h2>
          <div className="mt-6 grid grid-cols-2 gap-4">
            {data?.relatedProducts.map((product) => (
              <Link href={`/products/${product.id}`} key={product.id}>
                <div>
                  {product?.image ? (
                    <>
                      <Image
                        src={product.image}
                        alt="제품 이미지"
                        width={224}
                        height={224}
                        className=" bg-slate-300 w-56 h-56 object-cover"
                      />
                    </>
                  ) : (
                    <div className="h-56 w-full mb-4 bg-slate-300" />
                  )}
                  <h3 className=" text-gray-700 -mb-1">{product.name}</h3>
                  <span className="text-sm font-medium text-gray-900">${product.price}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
