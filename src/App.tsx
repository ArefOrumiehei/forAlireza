import { Route, Routes } from 'react-router-dom'
import './App.css'
import DashboardLayout from './layouts/DashboardLayout';
import StoreTable from './components/tables/StoreTable';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProtectedRoute from './protecting/ProtectedRoute';
import StoreDetails from './components/tables/StoreDetails';
import ItemsTable from './components/tables/ItemsTable';


function StoresPage() {
  return (
    <div>
      <StoreTable />
    </div>
  );
}

function TagsPage() {
  return <div>Tags page</div>;
}

function ItemsPage() {
  return (
    <div>
      <ItemsTable />
    </div>
  );
}

function App() {

  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route path="stores" element={<StoresPage />} />
          <Route path="/stores/:id" element={<StoreDetails />} />
          <Route path="tags" element={<TagsPage />} />
          <Route path="items" element={<ItemsPage />} />
        </Route>
        <Route path="login" />
      </Routes>
    </>
  )
}

export default App
