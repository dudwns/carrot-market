import Image from "next/image";
import Link from "next/link";

interface ItemProps {
  id: number;
  image?: string;
  title: string;
  price: number;
  hearts: number;
}

export default function Item({ id, image, title, price, hearts }: ItemProps) {
  return (
    <Link href={`/products/${id}`}>
      <div className="flex  px-4 pt-5 cursor-pointer justify-between">
        <div className="flex space-x-4">
          {image ? (
            <Image
              src={image}
              alt="제품 이미지"
              width={100}
              height={100}
              className=" bg-slate-300 w-20 h-20 object-cover"
            />
          ) : (
            <div className="w-20 h-20 bg-gray-400 rounded-md" />
          )}

          <div className="pt-2 flex flex-col">
            <h3 className="text-sm font-medium text-gray-900">{title}</h3>
            <span className="font-medium mt-1 text-gray-900">${price}</span>
          </div>
        </div>
        <div className="flex items-end justify-end space-x-2">
          <div className="flex space-x-0.5 items-center text-sm text-gray-600">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              ></path>
            </svg>
            <span>{hearts}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
