import Item from "@/Components/item";
import Layout from "@/Components/layout";
import ProductList from "@/Components/product-list";

export default function Loved() {
  return (
    <Layout title="관심목록" canGoBack>
      <div className="flex flex-col space-y-5 pb-10 divide-y">
        <ProductList kind="favs"></ProductList>
      </div>
    </Layout>
  );
}
