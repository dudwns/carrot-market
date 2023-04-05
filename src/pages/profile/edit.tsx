import Button from "@/Components/button";
import Input from "@/Components/input";
import Layout from "@/Components/layout";

export default function Edit() {
  return (
    <Layout canGoBack>
      <form className="py-10 px-4 space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-14 h-14 rounded-full bg-slate-500" />
          <label
            htmlFor="picture"
            className="cursor-pointer py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 text-gray-700"
          >
            Change
            <input id="picture" type="file" className="hidden" accept="image/*" />
          </label>
        </div>
        <Input required label="Email address" name="email" type="email" />
        <Input required label="Phone number" name="phone" type="number" kind="phone" />

        <Button text="Update profile" />
      </form>
    </Layout>
  );
}
