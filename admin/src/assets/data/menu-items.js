export const MENU_ITEMS = [{
  key: 'general',
  label: 'GENERAL',
  isTitle: true
}, {
  key: 'dashboard-analytics',
  icon: 'iconamoon:home-duotone',
  label: 'Dashboard',
  url: '/dashboard/analytics',
  pageKey: 'dashboard.analytics'
}, {
  key: 'gtaes-management',
  label: 'GTA Electric Services',
  isTitle: true
}, {
  key: 'team',
  icon: 'iconamoon:shield-duotone',
  label: 'Team',
  children: [{
    key: 'team-invitations',
    label: 'Team Invitations',
    url: '/management/invitations',
    parentKey: 'team',
    pageKey: 'management.invitations'
  }, {
    key: 'team-users',
    label: 'User Management',
    url: '/management/users',
    parentKey: 'team',
    pageKey: 'management.users'
  }, {
    key: 'team-page-access',
    label: 'Page Access',
    url: '/management/page-access',
    parentKey: 'team',
    superAdminOnly: true
  }]
}, {
  key: 'customers',
  icon: 'iconamoon:profile-circle-duotone',
  label: 'Online Customers',
  url: '/management/customers',
  pageKey: 'management.customers'
}, {
  key: 'services',
  icon: 'iconamoon:lightning-1-duotone',
  label: 'Services',
  children: [{
    key: 'services-categories',
    label: 'Service Categories',
    url: '/management/service-categories',
    parentKey: 'services',
    pageKey: 'management.service-categories'
  }, {
    key: 'services-catalog',
    label: 'Services',
    url: '/management/services',
    parentKey: 'services',
    pageKey: 'management.services'
  }, {
    key: 'services-materials',
    label: 'Materials',
    url: '/management/materials',
    parentKey: 'services',
    pageKey: 'management.materials'
  }]
}, {
  key: 'service-locations',
  icon: 'iconamoon:location-pin-duotone',
  label: 'Service Locations',
  url: '/management/service-locations',
  pageKey: 'management.service-locations'
}, {
  key: 'bookings',
  icon: 'iconamoon:calendar-1-duotone',
  label: 'Bookings',
  children: [{
    key: 'bookings-list',
    label: 'Bookings',
    url: '/management/bookings',
    parentKey: 'bookings',
    pageKey: 'management.bookings'
  }, {
    key: 'bookings-settings',
    label: 'Booking Settings',
    url: '/management/booking-settings',
    parentKey: 'bookings',
    pageKey: 'management.booking-settings'
  }]
}, {
  key: 'technician-jobs',
  icon: 'iconamoon:tools-duotone',
  label: 'My Jobs',
  url: '/technician/jobs',
  technicianOnly: true,
  pageKey: 'technician.jobs'
}];
