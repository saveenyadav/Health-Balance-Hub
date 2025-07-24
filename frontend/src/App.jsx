import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
//import Footer from './components/Footer';
import Blogs from './pages/Blogs';
import Yoga from './pages/Yoga';
import Nutrition from './pages/Nutrition';
import Workout from './pages/Workout';
import Contact from './pages/Contact';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
//import Profile from './pages/Profile';
//import Home from './pages/Home';
//import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
   // <AuthProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          {/*<Route path="/" element={<Home />} /> */}
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/yoga" element={<Yoga />} />
          <Route path="/nutrition" element={<Nutrition />} />
          <Route path="/workout" element={<Workout />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/*<Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />*/}
        </Routes>
        {/* <Footer /> */} 
      </BrowserRouter>
    // </AuthProvider>
  );
}

export default App;