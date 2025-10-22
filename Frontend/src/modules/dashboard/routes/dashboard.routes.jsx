import { Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import DashboardPage from '../pages/DashboardPage.jsx';

const DashboardRoutes = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
      </Routes>
    </Layout>
  );
};

export default DashboardRoutes;
