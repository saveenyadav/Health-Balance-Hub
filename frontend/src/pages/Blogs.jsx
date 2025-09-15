import React, { useState } from "react";
import BlogCard from "../components/BlogCard";
import { allBlogs } from "../data/blogs"; // import blogs
import "./Blogs.css";

const Blogs = () => {
  const [blogs, setBlogs] = useState(allBlogs);
  const [filter, setFilter] = useState("All");

  const handleFilter = (category) => {
    setFilter(category);
    if (category === "All") setBlogs(allBlogs);
    else setBlogs(allBlogs.filter(blog => blog.category === category));
  };

  return (
    <main className="blogs-container">
      <header className="blogs-header">
        <h1 className="blogs-title">Our Blog</h1>
        <p className="blogs-subtitle">Tips and insights for a balanced lifestyle — Nutrition, Fitness, and Mental Wellness.</p>
        <div className="filter-buttons">
          {["All", "Fitness", "Nutrition", "Mental Health"].map(cat => (
            <button key={cat} onClick={() => handleFilter(cat)}>
              {cat}
            </button>
          ))}
        </div>
      </header>

      <section className="blogs-grid">
        {blogs.map(blog => (
          <BlogCard key={blog._id} blog={blog} />
        ))}
      </section>
    </main>
  );
};

export default Blogs;




