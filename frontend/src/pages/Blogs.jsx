import React, { useState, useEffect } from "react";
import "./Blogs.css";

const Blogs = () => {
  const allBlogs = [
    {
      _id: 1,
      title: "Training for Strength & Endurance",
      category: "Fitness",
      image: "https://images.pexels.com/photos/864990/pexels-photo-864990.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
      content: "Structured training is the cornerstone of fitness. Combining resistance exercises with cardio helps build both strength and endurance. Learn proper techniques, recovery routines, and how to schedule workouts to achieve optimal results without risking injury."
    },
    {
      _id: 2,
      title: "Mindset is Everything",
      category: "Mental Health",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80",
      content: "Your mindset defines your fitness journey. Discipline, consistency, and mental toughness are just as important as physical training. Learn to set realistic goals, embrace challenges, and maintain motivation even on tough days."
    },
    {
      _id: 3,
      title: "Nutrition for Performance",
      category: "Nutrition",
      image: "https://images.pexels.com/photos/5938/food-salad-healthy-lunch.jpg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
      content: "Fueling your body correctly is essential for performance and recovery. Understand macronutrients — proteins, carbohydrates, and fats — and how they support training goals. Hydration, meal timing, and nutrient-dense foods optimize energy levels and recovery."
    },
    {
      _id: 4,
      title: "Yoga for Beginners",
      category: "Fitness",
      image: "https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&cs=tinysrgb&w=600",
      content: "Start your yoga journey with simple poses that improve flexibility, balance, and mental clarity."
    },
    {
      _id: 5,
      title: "Healthy Meal Prep Ideas",
      category: "Nutrition",
      image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600",
      content: "Save time and eat healthy with these easy meal prep strategies for the week."
    },
    {
      _id: 6,
      title: "Mindfulness Practices",
      category: "Mental Health",
      image: "https://images.pexels.com/photos/4056533/pexels-photo-4056533.jpeg?auto=compress&cs=tinysrgb&w=600",
      content: "Simple mindfulness exercises to reduce stress and improve mental clarity every day."
    }
  ];

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
            <button key={cat} onClick={() => handleFilter(cat)}>{cat}</button>
          ))}
        </div>
      </header>

      <section className="blogs-grid">
        {blogs.map(blog => (
          <article key={blog._id} className="blog-card" data-category={blog.category}>
            <img src={blog.image} alt={blog.title} className="blog-img" />
            <div className="blog-content">
              <h3 className="blog-title">{blog.title}</h3>
              <span className="badge category">{blog.category}</span>
              <p className="blog-excerpt">{blog.content.slice(0, 120)}...</p>
              <a href="#" className="read-more">Read More →</a>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
};

export default Blogs;



