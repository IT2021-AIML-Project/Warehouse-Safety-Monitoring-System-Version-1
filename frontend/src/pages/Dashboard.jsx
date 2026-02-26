import React from 'react';
import { useAuth } from '../context/AuthContext';
import ModelInferenceDashboard from './ModelInference/ModelInferenceDashboard';
import InventoryManagementDashboard from './InventoryManagement/InventoryManagementDashboard';
import OperationsComplianceDashboard from './OperationsCompliance/OperationsComplianceDashboard';
import WarehouseConfigDashboard from './warehouseConfig/WarehouseConfigDashboard';
import NotificationReportingDashboard from './NotificationReporting/NotificationReportingDashboard';
import EmployeeManagementDashboard from './EmployeeManagement/EmployeeManagementDashboard';

const DashboardPage = () => {
  const { user } = useAuth();

  // Route to the appropriate dashboard based on user role
  switch (user?.role) {
    case 'user':
      return <EmployeeManagementDashboard />;
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
      return <EmployeeManagementDashboard />; // Default for regular users
  }
};

export default DashboardPage;
