import Layout from "@/Components/layout";
import ProductList from "@/Components/product-list";

export default function Sold() {
  return (
    <Layout title="판매내역" canGoBack>
      <div className="flex flex-col space-y-5 pb-10 divide-y">
        <ProductList kind="sales"></ProductList>
      </div>
    </Layout>
  );
}
