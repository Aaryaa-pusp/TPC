import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import DashboardShell from './components/DashboardShell';
import StudentDashboard from './components/StudentDashboard';
import CompanyDashboard from './components/CompanyDashboard';
import AdminDashboard from './components/AdminDashboard';
import ManageAnnouncements from './components/ManageAnnouncements';
import CompanyVerificationQueue from './components/CompanyVerificationQueue';
import StudentCalendarUpdate from './components/StudentCalendarUpdate';
import AdminPowerAssignment from './components/AdminPowerAssignment';
import UserManagement from './components/UserManagement';
import ProtectedRoute from './components/ProtectedRoute';
import StudentVerificationForm from './components/StudentVerificationForm';
import StudentVerificationQueue from './components/StudentVerificationQueue';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardShell />
            </ProtectedRoute>
          }>
            <Route path="student" element={<StudentDashboard />} />
            <Route path="student/verify" element={<StudentVerificationForm />} />
            <Route path="company" element={<CompanyDashboard />} />
            <Route path="admin" element={<AdminDashboard />}>
              <Route path="announcements" element={<ManageAnnouncements />} />
              <Route path="companies" element={<CompanyVerificationQueue />} />
              <Route path="students/verify" element={<StudentVerificationQueue />} />
              <Route path="calendar" element={<StudentCalendarUpdate />} />
              <Route path="assign-powers" element={<AdminPowerAssignment />} />
              <Route path="users" element={<UserManagement />} />
              <Route index element={<Navigate to="announcements" replace />} />
            </Route>
            {/* Redirect /dashboard to the correct sub-route based on role, handled in DashboardShell */}
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
