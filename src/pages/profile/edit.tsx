import Button from "@/Components/button";
import Input from "@/Components/input";
import Layout from "@/Components/layout";
import useMutation from "@/libs/client/useMutation";
import useUser from "@/libs/client/useUser";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import firebase from "@/libs/server/firebase";
import { useRouter } from "next/router";
import Image from "next/image";

interface EditProfileForm {
  email?: string;
  phone?: string;
  name?: string;
  formErrors?: string;
  avatar?: FileList;
}

interface EditProfileResponse {
  ok: boolean;
  error?: string;
}

export default function Edit() {
  const { user } = useUser();
  const router = useRouter();
  const {
    register,
    setValue,
    handleSubmit,
    setError,
    formState: { errors },
    watch,
    clearErrors,
  } = useForm<EditProfileForm>();
  const [avatarPreview, setAvatarPreview] = useState("");
  const avatar = watch("avatar");
  const [editProfile, { data, loading }] = useMutation<EditProfileResponse>(`/api/users/me`);

  const onValid = ({ email, phone, name, avatar }: EditProfileForm) => {
    if (loading) return;
    if (email == "" && phone == "" && name == "") {
      return setError("formErrors", { message: "이름, 이메일, 전화번호 중 하나가 필요합니다." }); // 에러 설정
    }

    if (avatar && avatar.length > 0) {
      const storageService = getStorage(firebase);
      const imageRef = ref(storageService, `image/${avatar[0].name}`);
      const uploadTask = uploadBytesResumable(imageRef, avatar[0]);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            editProfile({
              email,
              phone,
              name,
              avatarId: url,
            });
          });
        }
      );
    } else {
      editProfile({
        email,
        phone,
        name,
      });
    }
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
    if (data && data.ok) {
      router.push("/profile");
    }
  }, [data, setError, router]);

  useEffect(() => {
    if (avatar && avatar.length > 0) {
      const file = avatar[0];
      setAvatarPreview(URL.createObjectURL(file)); // 업로드 한 file에 대한 URL로 접근 권한을 얻음
    }
  }, [avatar]);

  return (
    <Layout canGoBack>
      <form onSubmit={handleSubmit(onValid)} className="py-10 px-4 space-y-4">
        <div className="flex items-center space-x-3">
          {user?.avatar || avatarPreview ? (
            <Image
              src={avatarPreview ? avatarPreview : user?.avatar!}
              alt="프로필 이미지"
              width={200}
              height={200}
              className=" w-14 h-14 rounded-full bg-slate-500"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-slate-500" />
          )}
          <label
            htmlFor="picture"
            className="cursor-pointer py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 text-gray-700"
          >
            이미지 변경
            <input
              {...register("avatar")}
              id="picture"
              type="file"
              className="hidden"
              accept="image/*"
            />
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
        <Button loading={loading} text="Update profile" onClick={() => clearErrors()} />
      </form>
    </Layout>
  );
}
