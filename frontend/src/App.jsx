import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Events from './pages/Events.jsx'
import EventDetails from './pages/EventDetails.jsx'
import MyRegistrations from './pages/MyRegistrations.jsx'
import AdminLogin from './pages/admin/AdminLogin.jsx'
import AdminSignup from './pages/admin/AdminSignup.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import AdminEvents from './pages/admin/AdminEvents.jsx'
import AdminAttendees from './pages/admin/AdminAttendees.jsx'
import NotFound from './pages/NotFound.jsx'
import ProtectedAdminRoute from './components/ProtectedAdminRoute.jsx'

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/my-registrations" element={<MyRegistrations />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/signup" element={<AdminSignup />} />
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/events"
            element={
              <ProtectedAdminRoute>
                <AdminEvents />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/attendees"
            element={
              <ProtectedAdminRoute>
                <AdminAttendees />
              </ProtectedAdminRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
