import Layout from "@/Components/layout";
import { readFileSync, readdirSync } from "fs";
import matter from "gray-matter";
import { GetStaticProps, NextPage } from "next";
import Link from "next/link";

interface Post {
  title: string;
  date: string;
  category: string;
  slug: string;
}

const Blog: NextPage<{ posts: Post[] }> = ({ posts }) => {
  return (
    <Layout title="Blog" seoTitle="Blog">
      <h1 className="font-semibold text-center text-xl mt-5 mb-10">Latest Posts</h1>
      <ul>
        {posts.map((post, index) => (
          <div key={index} className="mb-5 ">
            <Link href={`/blog/${post.slug}`}>
              <span className="text-lg text-red-500">{post.title}</span>
              <div>
                <span>
                  {post.date} / {post.category}
                </span>
              </div>
            </Link>
          </div>
        ))}
      </ul>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const blogPosts = readdirSync("./src/posts").map((file) => {
    // NodeJS API를 이용해서 디렉터리를 읽음
    const content = readFileSync(`./src/posts/${file}`, "utf-8"); //NodeJS API를 이용해서 파일을 읽음
    const [slug, _] = file.split("."); // 뒤에 확장자를 분리해서 가져옴
    return { ...matter(content).data, slug }; // matter: parser 같은 역할, front matter을 읽어옴
  }); // next.js가 페이지를 호출할 때 pages 폴더와 같은 위치에 있음

  return {
    props: {
      posts: blogPosts,
    },
  };
};

export default Blog;
