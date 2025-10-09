import { Route, Routes } from 'react-router-dom'
import './App.css'
import DashboardLayout from './layouts/DashboardLayout';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProtectedRoute from './protecting/ProtectedRoute';
import StoreDetails from './components/tables/StoreDetails';
import StoreTagsDetails from './components/tables/StoreTagsDetails';
import Stores from './pages/dashboard/Stores';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import Home from './pages/Home';
import Items from './pages/dashboard/Items';


function TagsPage() {
  return <div>Tags page</div>;
}

function App() {

  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<Home />} />
          <Route path="stores" element={<Stores />} />
          <Route path="stores/:id" element={<StoreDetails />} />
          <Route path="stores/:id/tags" element={<StoreTagsDetails />} />
          <Route path="items" element={<Items />} />
          <Route path="tags" element={<TagsPage />} />
        </Route>
        <Route path="login" />
      </Routes>
    </>
  )
}

export default App
