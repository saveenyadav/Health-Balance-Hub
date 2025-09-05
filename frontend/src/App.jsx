// // App.jsx
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Header from "./components/Header";
// import Footer from "./components/Footer";
// import Home from "./pages/Home";
// import About from "./pages/About";
// import Blogs from "./pages/Blogs";
// import Workout from "./pages/Workout";
// import Nutrition from "./pages/Nutrition";
// import Mindset from "./pages/Mindset";
// import Contact from "./pages/Contact";
// import Search from "./pages/Search";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import BlogDetail from "./pages/BlogDetail";
// import Navbar from "./components/Navbar";
// import "./styles/App.css";

// function App() {
//   return (
//     <Router>
//       <div className="app-container">
//         {/* Fixed Header */}
//         <Header />

//         {/* Main content (padding applied in CSS for all pages) */}
//         <main className="main-content">
//           <Routes>
//             <Route path="/" element={<Home />} />
//             <Route path="/about" element={<About />} />
//             <Route path="/blogs" element={<Blogs />} />
//             <Route path="/blogs/:id" element={<BlogDetail />} />
//             <Route path="/workout" element={<Workout />} />
//             <Route path="/nutrition" element={<Nutrition />} />
//             <Route path="/mindset" element={<Mindset />} />
//             <Route path="/contact" element={<Contact />} />
//             <Route path="/search" element={<Search />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/register" element={<Register />} />
//              <Route path="/navbar" element={<Navbar />} />
//           </Routes>
//         </main>

//         {/* Footer */}
//         <Footer />
//       </div>
//     </Router>
//   );
// }

// export default App;



import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Blogs from "./pages/Blogs";
import Workout from "./pages/Workout";
import Nutrition from "./pages/Nutrition";
import Mindset from "./pages/Mindset";
import Contact from "./pages/Contact";
import Search from "./pages/Search";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BlogDetail from "./pages/BlogDetail";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";
import { AuthProvider } from "./context/AuthContext";
import "./styles/App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/blogs/:id" element={<BlogDetail />} />
              <Route path="/workout" element={<Workout />} />
              <Route path="/nutrition" element={<Nutrition />} />
              <Route path="/mindset" element={<Mindset />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/search" element={<Search />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} /> {/* ✅ */}
              <Route path="/navbar" element={<Navbar />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;