import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BlogCard from '../components/BlogCard';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const fetchBlogs = async () => {
    const res = await axios.get('/api/blogs');
    setBlogs(res.data);
  };
  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <main className="container">
      <h2>Our Blog</h2>
      <section className="blogs-grid">
        {blogs.map(b => <BlogCard key={b._id} blog={b} />)}
      </section>
    </main>
  );
};

export default Blogs;



