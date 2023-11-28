import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

// utilities routing
const UtilsTypography = Loadable(lazy(() => import('views/utilities/Typography')));
const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')));
const UtilsShadow = Loadable(lazy(() => import('views/utilities/Shadow')));
const UtilsMaterialIcons = Loadable(lazy(() => import('views/utilities/MaterialIcons')));
const UtilsTablerIcons = Loadable(lazy(() => import('views/utilities/TablerIcons')));

// sample page routing
const SamplePage = Loadable(lazy(() => import('views/sample-page')));
//Our Views
const PatientPage = Loadable(lazy(() => import('views/dashboard/Default/PatientView')));
const WalletPage = Loadable(lazy(() => import('views/dashboard/Default/Wallet')));
const DevicePage = Loadable(lazy(() => import('views/dashboard/Default/DevicesView')));
const TimeSlotPage = Loadable(lazy(() => import('views/dashboard/Default/TimeSlot')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    //our view
    {
      path: 'continuous_monitoring',
      children: [
        {
          path: 'all',
          element: <PatientPage />
        }
      ]
    },

    {
      path: 'wallet',
      children: [
        {
          path: 'view',
          element: <WalletPage />
        }
      ]
    },

    {
      path: 'device',
      children: [
        {
          path: 'all',
          element: <DevicePage />
        }
      ]
    },
    {
      path: 'timeslot',
      children: [
        {
          path: 'all',
          element: <TimeSlotPage />
        }
      ]
    },

    // ends here
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'utils',
      children: [
        {
          path: 'util-typography',
          element: <UtilsTypography />
        }
      ]
    },
    {
      path: 'utils',
      children: [
        {
          path: 'util-color',
          element: <UtilsColor />
        }
      ]
    },
    {
      path: 'utils',
      children: [
        {
          path: 'util-shadow',
          element: <UtilsShadow />
        }
      ]
    },
    {
      path: 'icons',
      children: [
        {
          path: 'tabler-icons',
          element: <UtilsTablerIcons />
        }
      ]
    },
    {
      path: 'icons',
      children: [
        {
          path: 'material-icons',
          element: <UtilsMaterialIcons />
        }
      ]
    },
    {
      path: 'sample-page',
      element: <SamplePage />
    }
  ]
};

export default MainRoutes;
