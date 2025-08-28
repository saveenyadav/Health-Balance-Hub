import React from "react";
import "./Nutrition.css";

const Nutrition = () => {
  const meals = [
    {
      id: 1,
      title: "Balanced Breakfast",
      image: "https://images.pexels.com/photos/1435895/pexels-photo-1435895.jpeg?auto=compress&cs=tinysrgb&w=600",
      description:
        "Start your day with oats, fresh fruit, and protein. A balanced breakfast keeps your energy stable and improves focus."
    },
    {
      id: 2,
      title: "Healthy Lunch",
      image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600",
      description:
        "Opt for lean protein (chicken, tofu, fish) with whole grains and lots of veggies to stay fueled for the afternoon."
    },
    {
      id: 3,
      title: "Nutritious Dinner",
      image: "https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg?auto=compress&cs=tinysrgb&w=600",
      description:
        "Keep dinner light but satisfying: grilled fish, steamed veggies, and quinoa promote good digestion and restful sleep."
    }
  ];

  return (
    <main className="nutrition-container">
      <header className="nutrition-header">
        <h1>Nutrition for a Balanced Life</h1>
        <p>
          Good nutrition is the foundation of wellness. Explore simple, healthy,
          and sustainable meal ideas that support your body and mind.
        </p>
      </header>

      <section className="meals-grid">
        {meals.map((meal) => (
          <article key={meal.id} className="meal-card">
            <img src={meal.image} alt={meal.title} className="meal-img" />
            <div className="meal-content">
              <h2>{meal.title}</h2>
              <p>{meal.description}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="nutrition-tips">
        <h2>Quick Nutrition Tips</h2>
        <ul>
          <li>💧 Stay hydrated — aim for 6–8 glasses of water daily.</li>
          <li>🥦 Eat more whole foods — fruits, vegetables, nuts, and seeds.</li>
          <li>🍴 Practice portion control to avoid overeating.</li>
          <li>⏱️ Don’t skip meals; steady eating helps maintain energy levels.</li>
          <li>🥗 Plan ahead — meal prep makes healthy eating easier.</li>
        </ul>
      </section>
    </main>
  );
};

export default Nutrition;
