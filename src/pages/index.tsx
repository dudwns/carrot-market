import FloatingButton from "@/Components/floating-button";
import Item from "@/Components/item";
import Layout from "@/Components/layout";
import { Product } from "@prisma/client";
import Head from "next/head";
import useSWR from "swr";

export interface ProductWithCount extends Product {
  _count: {
    favs: number;
  };
}

interface ProdectsResponse {
  ok: boolean;
  products: ProductWithCount[];
}

export default function Home() {
  const { data, isLoading } = useSWR<ProdectsResponse>("/api/products");
  console.log(data);

  return (
    <Layout title="홈" hasTabBar>
      <Head>
        <title>HOME</title>
      </Head>

      <div className="flex flex-col  space-y-5 divide-y ">
        {isLoading ? (
          <span className="flex justify-center mt-3">Loading...</span>
        ) : (
          data?.products?.map((product) => (
            <Item
              key={product.id}
              id={product.id}
              image={product.image!}
              title={product.name}
              price={product.price}
              hearts={product._count.favs}
            />
          ))
        )}
        <FloatingButton href="/products/upload">
          <svg
            className="h-6 w-6"
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
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </FloatingButton>
      </div>
    </Layout>
  );
}
