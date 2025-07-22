import { useEffect, useState } from 'react';
import axios from 'axios';
import BlogCard from '../components/BlogCard';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    axios.get('/api/blogs')
      .then(res => setBlogs(res.data))
      .catch(console.error);
  }, []);

  return (
    <section className="blogs-page">
      <h2>Wellness Blog</h2>
      {blogs.length > 0 ? blogs.map(blog => (
        <BlogCard key={blog._id} blog={blog} />
      )) : <p>No blogs found</p>}
    </section>
  );
};

export default Blogs;



