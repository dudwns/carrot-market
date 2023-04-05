import Button from "@/Components/button";
import Layout from "@/Components/layout";
import TextArea from "@/Components/textarea";

export default function Write() {
  return (
    <Layout canGoBack>
      <form className="p-4 space-y-4">
        <TextArea required placeholder="질문해 보세요!" />
        <Button text="submit" />
      </form>
    </Layout>
  );
}
