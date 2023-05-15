import Layout from "@/Components/layout";
import { readdirSync } from "fs";
import matter from "gray-matter";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import remarkHtml from "remark-html";
import remarkParse from "remark-parse";
import { unified } from "unified";

const Post: NextPage<{ post: string; data: any }> = ({ post, data }) => {
  return (
    <Layout title={data.title} seoTitle={data.title}>
      <div className="blog-post-content" dangerouslySetInnerHTML={{ __html: post }}></div>
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths = () => {
  const files = readdirSync("./src/posts").map((file) => {
    const [name, extension] = file.split(".");
    return { params: { slug: name } }; // URL을 매칭해 줘야 됨
  });

  return {
    paths: files,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { data, content } = matter.read(`./src/posts/${ctx.params?.slug}.md`);
  const { value } = await unified().use(remarkParse).use(remarkHtml).process(content); // HTML 태그로 바꿔줌

  return {
    props: {
      data,
      post: value,
    },
  };
};

export default Post;
