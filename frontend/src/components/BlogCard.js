const BlogCard = ({ blog }) => (
  <div className="blog-card">
    <h3>{blog.title}</h3>
    <p><em>{blog.category}</em></p>
    <p>{blog.content.slice(0, 150)}...</p>
  </div>
);

export default BlogCard;