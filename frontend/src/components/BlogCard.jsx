import React from "react";
import PropTypes from "prop-types";
import "./BlogCard.css";
import { Link } from "react-router-dom";
const BlogCard = ({ blog }) => {
  return (
    <article className="blog-card">
      <img src={blog.image} alt={blog.title} className="blog-img" />
      <div className="blog-content">
        <h3 className="blog-title">{blog.title}</h3>
        <p className="blog-excerpt">{blog.content.slice(0, 150)}...</p>
        <Link to={`/blogs/${blog._id}`} className="read-more">
          Read More →
        </Link>
      </div>
    </article>
  );
};
BlogCard.propTypes = {
  blog: PropTypes.shape({
    _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired
  }).isRequired
};
export default BlogCard;