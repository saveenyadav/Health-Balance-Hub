import React from "react";
import { useParams, Link } from "react-router-dom"; // import Link
import { allBlogs } from "../data/blogs"; 
import "./BlogDetail.css";

const BlogDetail = () => {
  const { id } = useParams();
  const blog = allBlogs.find(b => b._id === parseInt(id));

  if (!blog) return <p>Blog not found</p>;

  return (
    <main className="blog-detail">
      <h1>{blog.title}</h1>
      <img src={blog.image} alt={blog.title} className="blog-detail-img" />
      <p>{blog.content}</p>

      {/* Back to Blogs link */}
      <Link to="/blogs" className="back-to-blogs">
        ← Back to Blogs
      </Link>
    </main>
  );
};

export default BlogDetail;


