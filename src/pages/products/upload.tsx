import Button from "@/Components/button";
import Input from "@/Components/input";
import Layout from "@/Components/layout";
import TextArea from "@/Components/textarea";
import useMutation from "@/libs/client/useMutation";
import { Product } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import firebase from "@/libs/server/firebase";
import Image from "next/image";

interface UploadProductForm {
  name: string;
  price: number;
  description: string;
  photo?: FileList;
}

interface UploadProductMutation {
  ok: boolean;
  product: Product;
}

export default function Upload() {
  const router = useRouter();
  const { register, handleSubmit, watch } = useForm<UploadProductForm>();
  const [uploadProduct, { loading, data }] = useMutation<UploadProductMutation>("/api/products");
  const onvalid = ({ name, price, description, photo }: UploadProductForm) => {
    if (loading) return;
    if (photo && photo.length > 0) {
      const storageService = getStorage(firebase);
      const imageRef = ref(storageService, `image/${photo[0].name}`);
      const uploadTask = uploadBytesResumable(imageRef, photo[0]);
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
            uploadProduct({
              name,
              price,
              description,
              photoId: url,
            });
          });
        }
      );
    } else {
      uploadProduct({ name, price, description });
    }
  };
  useEffect(() => {
    if (data?.ok) {
      router.push(`/products/${data.product.id}`);
    }
  }, [data, router]);
  const photo = watch("photo");
  const [photoPrivews, setPhotoPrivews] = useState("");
  useEffect(() => {
    if (photo && photo.length > 0) {
      const file = photo[0];
      setPhotoPrivews(URL.createObjectURL(file));
    }
  }, [photo]);
  return (
    <Layout canGoBack>
      <form className="p-4 space-y-4" onSubmit={handleSubmit(onvalid)}>
        <div>
          {photoPrivews ? (
            <div className="relative h-96">
              <Image
                src={photoPrivews}
                alt="제품 이미지"
                layout="fill"
                className=" bg-slate-300 object-cover"
              />
            </div>
          ) : (
            <label className="w-full cursor-pointer text-gray-600 hover:border-orange-500 hover:text-orange-500 flex items-center justify-center border-2 border-dashed border-gray-300 h-48 rounded-md">
              <svg
                className="h-12 w-12"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <input {...register("photo")} className="hidden" type="file" accept="image/*" />
            </label>
          )}
        </div>
        <Input
          register={register("name", { required: true })}
          required
          label="Name"
          name="name"
          type="text"
        />
        <Input
          register={register("price", { required: true })}
          required
          label="Price"
          name="price"
          type="text"
          kind="price"
        />
        <TextArea
          register={register("description", { required: true })}
          name="description"
          label="Description"
          required
        />
        <Button loading={loading} text="Upload item" />
      </form>
    </Layout>
  );
}
