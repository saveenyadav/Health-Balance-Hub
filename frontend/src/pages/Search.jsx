import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Search.module.css";
import { FaSearch } from "react-icons/fa";

function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  const sampleData = [
    { id: 1, title: "Home Page", category: "Home", path: "/" },
    { id: 2, title: "Learn About Health Balance Hub", category: "About", path: "/about" },
    { id: 3, title: "Read Our Blogs", category: "Blogs", path: "/blogs" },
    { id: 4, title: "Top 10 Home Workouts", category: "Workout", path: "/workout" },
    { id: 5, title: "Healthy Smoothie Recipes", category: "Nutrition", path: "/nutrition" },
    { id: 6, title: "Stress Relief Meditation", category: "Mindset", path: "/mindset" },
    { id: 7, title: "Contact Our Experts", category: "Contact", path: "/contact" },
  ];

  const handleSearch = (e) => {
    e.preventDefault();

    
    const exactMatch = sampleData.find(
      (item) => item.title.toLowerCase() === query.trim().toLowerCase() || item.category.toLowerCase() === query.trim().toLowerCase()
    );

    if (exactMatch) {
      navigate(exactMatch.path);
    } else {
      
      const filtered = sampleData.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    }
  };

  const handleClick = (path) => {
    navigate(path);
  };

  return (
    <div className={styles.searchPage}>
      {/* Hero */}
      <header className={styles.hero}>
        <h1>Discover Your Balance</h1>
        <form className={styles.searchBar} onSubmit={handleSearch}>
          <div className={styles.inputWrapper}>
            <FaSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search Health Balance Hub..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button type="submit">Search</button>
        </form>
      </header>

      {/* Results */}
      <section className={styles.results}>
        {results.length > 0 &&
          results.map((item, index) => (
            <div
              key={item.id}
              className={styles.resultCard}
              style={{
                animation: `popUp 0.25s ease forwards`,
                animationDelay: `${index * 0.1}s`,
              }}
              onClick={() => handleClick(item.path)}
            >
              <h2>{item.title}</h2>
              <span className={styles.category}>{item.category}</span>
            </div>
          ))}
      </section>
    </div>
  );
}

export default Search;