import FloatingButton from "@/Components/floating-button";
import Item from "@/Components/item";
import Layout from "@/Components/layout";
import { Product } from "@prisma/client";
import Head from "next/head";
import useSWR, { SWRConfig } from "swr";
import client from "@/libs/server/client";
import { NextPage } from "next";

export interface ProductWithCount extends Product {
  _count: {
    favs: number;
  };
}

interface ProdectsResponse {
  ok: boolean;
  products: ProductWithCount[];
}

const Home: NextPage = () => {
  const { data } = useSWR<ProdectsResponse>("/api/products");

  return (
    <Layout title="홈" hasTabBar>
      <Head>
        <title>HOME</title>
      </Head>

      <div className="flex flex-col  space-y-5 divide-y ">
        {data
          ? data?.products?.map((product) => (
              <Item
                key={product.id}
                id={product.id}
                image={product.image!}
                title={product.name}
                price={product.price}
                hearts={product._count?.favs || 0}
              />
            ))
          : "Loading..."}
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
};

const Page: NextPage<{ products: ProductWithCount[] }> = ({ products }) => {
  return (
    <SWRConfig
      value={{
        fallback: {
          "/api/products": {
            ok: true,
            products,
          },
        },
      }} // 캐시 초기값 설정
    >
      <Home />
    </SWRConfig>
  );
};

export async function getServerSideProps() {
  const products = await client.product.findMany({});
  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
    },
  };
}

export default Page;
