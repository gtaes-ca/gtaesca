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
  key: 'people',
  label: 'PEOPLE',
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
  label: 'SERVICES',
  isTitle: true
}, {
  key: 'services-menu',
  icon: 'iconamoon:lightning-1-duotone',
  label: 'Services',
  children: [{
    key: 'services-categories',
    label: 'Service Categories',
    url: '/management/service-categories',
    parentKey: 'services-menu',
    pageKey: 'management.service-categories'
  }, {
    key: 'services-catalog',
    label: 'Services',
    url: '/management/services',
    parentKey: 'services-menu',
    pageKey: 'management.services'
  }, {
    key: 'services-materials',
    label: 'Materials',
    url: '/management/materials',
    parentKey: 'services-menu',
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
  label: 'BOOKINGS',
  isTitle: true
}, {
  key: 'bookings-menu',
  icon: 'iconamoon:calendar-1-duotone',
  label: 'Bookings',
  children: [{
    key: 'bookings-list',
    label: 'Bookings',
    url: '/management/bookings',
    parentKey: 'bookings-menu',
    pageKey: 'management.bookings'
  }, {
    key: 'bookings-settings',
    label: 'Booking Settings',
    url: '/management/booking-settings',
    parentKey: 'bookings-menu',
    pageKey: 'management.booking-settings'
  }]
}, {
  key: 'website',
  label: 'WEBSITE',
  isTitle: true
}, {
  key: 'website-cms',
  icon: 'iconamoon:file-document-duotone',
  label: 'Website CMS',
  children: [{
    key: 'cms-homepage',
    label: 'Homepage',
    url: '/management/cms/homepage',
    parentKey: 'website-cms',
    pageKey: 'management.cms'
  }, {
    key: 'cms-about',
    label: 'About Us Page',
    url: '/management/cms/about',
    parentKey: 'website-cms',
    pageKey: 'management.cms.about'
  }, {
    key: 'cms-team',
    label: 'Team Page',
    url: '/management/cms/team',
    parentKey: 'website-cms',
    pageKey: 'management.cms.team'
  }, {
    key: 'cms-projects',
    label: 'Projects Page',
    url: '/management/cms/projects',
    parentKey: 'website-cms',
    pageKey: 'management.cms.projects'
  }, {
    key: 'cms-services',
    label: 'Services Page',
    url: '/management/cms/services',
    parentKey: 'website-cms',
    pageKey: 'management.cms.services'
  }, {
    key: 'cms-contact',
    label: 'Contact Page',
    url: '/management/cms/contact',
    parentKey: 'website-cms',
    pageKey: 'management.cms.contact'
  }, {
    key: 'cms-faq',
    label: 'FAQ Page',
    url: '/management/cms/faq',
    parentKey: 'website-cms',
    pageKey: 'management.cms.faq'
  }, {
    key: 'cms-legal',
    label: 'Legal Pages',
    url: '/management/cms/legal',
    parentKey: 'website-cms',
    pageKey: 'management.cms.legal'
  }]
}, {
  key: 'technician',
  label: 'TECHNICIAN',
  isTitle: true,
  technicianOnly: true
}, {
  key: 'technician-jobs',
  icon: 'iconamoon:tools-duotone',
  label: 'My Jobs',
  url: '/technician/jobs',
  technicianOnly: true,
  pageKey: 'technician.jobs'
}];
