import Button from "@/Components/button";
import Input from "@/Components/input";
import Layout from "@/Components/layout";
import TextArea from "@/Components/textarea";

export default function Create() {
  return (
    <Layout canGoBack>
      <div className="space-y-5 py-10 px-4">
        <Input required label="Name" name="name" type="text" />
        <Input required label="Price" placeholder="0.00" name="price" type="text" kind="price" />
        <TextArea name="description" label="Description" />
        <Button text="Go live" />
      </div>
    </Layout>
  );
}
