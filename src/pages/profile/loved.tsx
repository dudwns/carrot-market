import Item from "@/Components/item";
import Layout from "@/Components/layout";

export default function Loved() {
  return (
    <Layout canGoBack>
      <div className="flex flex-col space-y-5 pb-10 divide-y">
        {[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map((_, i) => (
          <Item key={i} id={i} title="iphone 14" price={99} hearts={1} comments={1} />
        ))}
      </div>
    </Layout>
  );
}
