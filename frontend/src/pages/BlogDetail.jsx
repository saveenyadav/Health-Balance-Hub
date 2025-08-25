import React from "react";
import { useParams } from "react-router-dom";
const BlogDetail = ({ blogs }) => {
  const { id } = useParams();
  const blog = blogs.find((b) => b._id.toString() === id);
  if (!blog) return <p>Blog not found!</p>;
  return (
    <div style={{ maxWidth: "800px", margin: "auto", padding: "2rem" }}>
      <h1>{blog.title}</h1>
      <img src={blog.image} alt={blog.title} style={{ width: "100%", margin: "1rem 0" }} />
      <p>{blog.content}</p>
    </div>
  );
};
export default BlogDetail;