import React from 'react';

const plans = [
  { name: 'Balanced Diet', probs: ['Vegetables', 'Moderate Protein', 'Low Sugar'] },
  { name: 'High-Protein', probs: ['Eggs', 'Chicken', 'Lentils'] },
  { name: 'Vegan', probs: ['Tofu', 'Leafy Greens', 'Nuts & Seeds'] }
];

export default function Nutrition() {
  return (
    <main className="container">
      <h2>Nutrition Plans</h2>
      <div className="cards-grid">
        {plans.map(p => (
          <section key={p.name} className="nutrition-card">
            <h3>{p.name}</h3>
            <ul>
              {p.probs.map(item => <li key={item}>{item}</li>)}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}