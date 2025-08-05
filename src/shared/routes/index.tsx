import React from 'react';
import { Routes as RoutesDOM, Route } from 'react-router-dom';

import LoginPage from '../../modules/auth/pages/LoginPage';
import OrdersListPage from '../../modules/orders/page/ListPage';
import OrdersRegisterPage from '../../modules/orders/page/RegisterPage';
import ProductsListPage from '../../modules/products/pages/ListPage';
import LayoutPanel from '../components/Layout/LayoutPanel';
import Dashboard from '../pages/Dashboard';

const Routes: React.FC = () => (
  <RoutesDOM>
    <Route path="/" element={<LayoutPanel component={<LoginPage />} />} />
    <Route path="/login" element={<LayoutPanel component={<LoginPage />} />} />
    <Route
      path="/dashboard"
      element={<LayoutPanel component={<Dashboard />} />}
    />

    <Route
      path="/produtos"
      element={<LayoutPanel component={<ProductsListPage />} />}
    />

    <Route
      path="/vendas"
      element={<LayoutPanel component={<OrdersListPage />} />}
    />

    <Route
      path="/vendas/nova"
      element={<LayoutPanel component={<OrdersRegisterPage />} />}
    />
  </RoutesDOM>
);

export default Routes;
