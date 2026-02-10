import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import ModelInferenceDashboard from './ModelInferenceDashboard';
import InventoryManagementDashboard from './InventoryManagementDashboard';
import OperationsComplianceDashboard from './OperationsComplianceDashboard';
import WarehouseConfigDashboard from './WarehouseConfigDashboard';
import NotificationReportingDashboard from './NotificationReportingDashboard';

const DashboardPage = () => {
  const { user } = useAuth();

  // Route to the appropriate dashboard based on user role
  switch (user?.role) {
    case 'model_inference':
      return <ModelInferenceDashboard />;
    case 'inventory_management':
      return <InventoryManagementDashboard />;
    case 'operations_compliance':
      return <OperationsComplianceDashboard />;
    case 'warehouse_config':
      return <WarehouseConfigDashboard />;
    case 'notification_reporting':
      return <NotificationReportingDashboard />;
    default:
      return <ModelInferenceDashboard />; // Default dashboard
  }
};

export default DashboardPage;
