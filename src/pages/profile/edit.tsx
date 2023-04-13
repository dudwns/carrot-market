import Button from "@/Components/button";
import Input from "@/Components/input";
import Layout from "@/Components/layout";
import useMutation from "@/libs/client/useMutation";
import useUser from "@/libs/client/useUser";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface EditProfileForm {
  email?: string;
  phone?: string;
  name?: string;
  formErrors?: string;
}

interface EditProfileResponse {
  ok: boolean;
  error?: string;
}

export default function Edit() {
  const { user } = useUser();
  const {
    register,
    setValue,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<EditProfileForm>();

  const [editProfile, { data, loading }] = useMutation<EditProfileResponse>(`/api/users/me`);

  const onValid = ({ email, phone, name }: EditProfileForm) => {
    if (loading) return;
    if (email == "" && phone == "" && name == "") {
      return setError("formErrors", { message: "이름, 이메일, 전화번호 중 하나가 필요합니다." }); // 에러 설정
    }
    editProfile({
      email,
      phone,
      name,
    });
  };

  useEffect(() => {
    if (user?.name) setValue("name", user.name);
    if (user?.email) setValue("email", user.email); // form의 값을 바꿈
    if (user?.phone) setValue("phone", user.phone);
  }, [user, setValue]);

  useEffect(() => {
    if (data && !data.ok && data.error) {
      setError("formErrors", { message: data.error });
    }
  }, [data, setError]);

  return (
    <Layout canGoBack>
      <form onSubmit={handleSubmit(onValid)} className="py-10 px-4 space-y-4">
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
        <Input register={register("name")} required={false} label="Name" name="name" type="text" />
        <Input
          register={register("email")}
          required={false}
          label="Email address"
          name="email"
          type="email"
        />
        <Input
          register={register("phone")}
          required={false}
          label="Phone number"
          name="phone"
          type="number"
          kind="phone"
        />
        {errors.formErrors ? (
          <span className="my-2 text-red-500 font-medium text-center block">
            {errors.formErrors.message}
          </span>
        ) : null}
        <Button loading={loading} text="Update profile" />
      </form>
    </Layout>
  );
}
