import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Blogs from "./pages/Blogs";
import Navbar from "./components/Navbar";
import BlogDetail from "./pages/BlogDetail";
import Workout from "./pages/Workout";
import Nutrition from "./pages/Nutrition";
import Mindset from "./pages/Mindset";
import Contact from "./pages/Contact";
import Membership from "./pages/Membership.jsx";
import Checkout from "./pages/Checkout.jsx";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthProvider } from "./context/AuthContext";
import "./styles/App.css";

//*updated by Okile: import VerifyEmailPage
import VerifyEmailPage from "./pages/VerifyEmailPage"; //*updated by Okile

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app-container">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/navbar" element={<Navbar />} />
              <Route path="/blogs/:id" element={<BlogDetail />} />
              <Route path="/workout" element={<Workout />} />
              <Route path="/nutrition" element={<Nutrition />} />
              <Route path="/mindset" element={<Mindset />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/membership" element={<Membership />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/search" element={<Search />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />    
              <Route path="/verify-email" element={<VerifyEmailPage />} /> {/* updated by Okile */}
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;