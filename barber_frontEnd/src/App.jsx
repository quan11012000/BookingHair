import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import FeedbackPage from "./pages/FeedbackPage.jsx";
import ServicesPage from "./pages/ServicesPage.jsx";
import BarbersPage from "./pages/BarbersPage.jsx";
import BookingPage from "./pages/BookingPage.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminLoginPage from "./components/AdminLoginPage.jsx";
import ServiceManager from "./pages/admin/ServiceManager.jsx";
import BarberManager from "./pages/admin/BarberManager.jsx";
import BookingManager from "./pages/admin/BookingManager.jsx";
import StaffChatPage from "./pages/admin/StaffChatPage.jsx";

function App() {
  const [count, setCount] = useState(0)

  return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/barbers" element={<BarbersPage />} />
                <Route path="/booking" element={<BookingPage />} />
                <Route path="/admin/services" element={<ServiceManager />} />
                <Route path="/admin/bookings" element={<BookingManager />} />
                <Route path="/admin/barbers" element={<BarberManager />} />
                <Route path="/admin/chat" element={<StaffChatPage />} />

                <Route path="/feedback" element={<FeedbackPage />} />
            </Routes>
        </Router>
  );
}

export default App
