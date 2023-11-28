// assets
import { IconMan, IconPalette, IconShadow,IconVideo,IconDeviceTv,IconWallet,IconDevices } from '@tabler/icons';

// constant
const icons = {
  IconMan,
  IconPalette,
  IconShadow,
  IconDevices,
  IconVideo,
  IconDeviceTv,
  IconWallet
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const utilities = {
  id: 'utilities',
  title: 'Utilities',
  type: 'group',
  children: [
    {
      id: 'util-patient',
      title: 'Continuous Monitoring ',
      type: 'item',
      url: 'continuous_monitoring/all',
      icon: icons.IconDeviceTv,
      breadcrumbs: false
    },
    {
      id: 'util-TeleCall',
      title: 'Tele Consultation',
      type: 'item',
      url: 'TeleCall/view',
      icon: icons.IconVideo,
      breadcrumbs: false
    },
    {
      id: 'util-timeslot',
      title: 'Time Slot',
      type: 'item',
      url: 'TimeSlot/all',
      icon: icons.IconVideo,
      breadcrumbs: false
    },
    {
      id: 'util-wallet',
      title: 'Wallet',
      type: 'item',
      url: '/wallet/view',
      icon: icons.IconWallet,
      breadcrumbs: false
    },
    {
      id: 'util-devices',
      title: 'Devices',
      type: 'item',
      url: '/Device/all',
      icon: icons.IconDevices,
      breadcrumbs: false
    },
    // {
    //   id: 'icons',
    //   title: 'Icons',
    //   type: 'collapse',
    //   icon: icons.IconWindmill,
    //   children: [
    //     {
    //       id: 'tabler-icons',
    //       title: 'Tabler Icons',
    //       type: 'item',
    //       url: '/icons/tabler-icons',
    //       breadcrumbs: false
    //     },
    //     {
    //       id: 'material-icons',
    //       title: 'Material Icons',
    //       type: 'item',
    //       external: true,
    //       target: '_blank',
    //       url: 'https://mui.com/material-ui/material-icons/',
    //       breadcrumbs: false
    //     }
    //   ]
    // }
  
  ]
};

export default utilities;
