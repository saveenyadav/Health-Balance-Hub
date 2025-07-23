import React from "react";
import PropTypes from "prop-types";

const BlogCard = ({ blog }) => (
  <article className="blog-card" aria-label={blog.title}>
    <img src={blog.image} alt={blog.title} className="blog-img" />
    <h3>{blog.title}</h3>
    <p>{blog.content.slice(0, 150)}…</p>
  </article>
);

BlogCard.propTypes = {
  blog: PropTypes.shape({
    title: PropTypes.string,
    image: PropTypes.string,
    content: PropTypes.string,
  }).isRequired,
};

export default BlogCard;
