import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from '../components/ProtectedRoute.jsx'
import AdminDashboard from '../pages/AdminDashboard.jsx'
import AdminProfileReview from '../pages/AdminProfileReview.jsx'
import AdminProfiles from '../pages/AdminProfiles.jsx'
import AdminUsers from '../pages/AdminUsers.jsx'
import CreateProfile from '../pages/CreateProfile.jsx'
import Dashboard from '../pages/Dashboard.jsx'
import ForgotPassword from '../pages/ForgotPassword.jsx'
import Home from '../pages/Home.jsx'
import Login from '../pages/Login.jsx'
import ProfilePreview from '../pages/ProfilePreview.jsx'
import PublicProfile from '../pages/PublicProfile.jsx'
import Profiles from '../pages/Profiles.jsx'
import Register from '../pages/Register.jsx'

export default function AppRoutes() {
  return <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/register" element={<Register />} />
    <Route path="/login" element={<Login />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/profiles" element={<Profiles />} />
    <Route path="/profile/:username" element={<PublicProfile />} />
    <Route path="/u/:username" element={<PublicProfile />} />
    <Route element={<ProtectedRoute />}>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile/create" element={<CreateProfile />} />
      <Route path="/profile/edit" element={<CreateProfile />} />
      <Route path="/preview" element={<ProfilePreview />} />
    </Route>
    <Route element={<ProtectedRoute admin />}>
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/profiles/:status" element={<AdminProfiles />} />
      <Route path="/admin/profiles/review/:id" element={<AdminProfileReview />} />
      <Route path="/admin/users" element={<AdminUsers />} />
    </Route>
    <Route path="*" element={<main className="route-page"><h1>Page not found</h1><a href="/">Return home</a></main>} />
  </Routes>
}
