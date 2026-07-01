import { MENU_ITEMS } from '@/assets/data/menu-items';
import { canAccessPage, isSuperAdmin, isTechnician } from '@/helpers/auth';

function filterMenuItems(items, user) {
  return items
    .filter((item) => {
      if (item.superAdminOnly && !isSuperAdmin(user)) return false;
      if (item.technicianOnly && !isTechnician(user)) return false;
      if (item.pageKey && !canAccessPage(user, item.pageKey)) return false;
      return true;
    })
    .map((item) => {
      if (item.children) {
        return { ...item, children: filterMenuItems(item.children, user) };
      }
      return item;
    })
    .filter((item) => !item.children || item.children.length > 0 || item.url);
}

function removeEmptySectionTitles(items) {
  return items.filter((item, index, arr) => {
    if (!item.isTitle) return true;

    for (let i = index + 1; i < arr.length; i += 1) {
      if (arr[i].isTitle) break;
      return true;
    }

    return false;
  });
}

export const getMenuItems = (user) => {
  return removeEmptySectionTitles(filterMenuItems(MENU_ITEMS, user));
};

const QUICK_LAUNCH_ORDER = [
  '/dashboard/analytics',
  '/management/bookings',
  '/management/customers',
  '/management/services',
  '/management/users',
  '/management/invitations',
  '/management/service-locations',
  '/technician/jobs',
  '/management/booking-settings',
  '/management/materials',
  '/management/service-categories',
];

function collectPageLinks(items, user, links = []) {
  for (const item of items) {
    if (item.isTitle) continue;
    if (item.superAdminOnly && !isSuperAdmin(user)) continue;
    if (item.technicianOnly && !isTechnician(user)) continue;
    if (item.pageKey && !canAccessPage(user, item.pageKey)) continue;

    if (item.url) {
      links.push({
        label: item.label,
        url: item.url,
        icon: item.icon || 'iconamoon:file-duotone',
      });
    }

    if (item.children) {
      collectPageLinks(item.children, user, links);
    }
  }

  return links;
}

export function getQuickLaunchPages(user) {
  const all = collectPageLinks(MENU_ITEMS, user);
  const byUrl = new Map(all.map((page) => [page.url, page]));
  const ordered = [];

  for (const url of QUICK_LAUNCH_ORDER) {
    if (byUrl.has(url)) {
      ordered.push(byUrl.get(url));
    }
  }

  return ordered.slice(0, 8);
}

export const findAllParent = (menuItems, menuItem) => {
  let parents = [];
  const parent = findMenuItem(menuItems, menuItem.parentKey);
  if (parent) {
    parents.push(parent.key);
    if (parent.parentKey) {
      parents = [...parents, ...findAllParent(menuItems, parent)];
    }
  }
  return parents;
};

export const getMenuItemFromURL = (items, url) => {
  if (items instanceof Array) {
    for (const item of items) {
      const foundItem = getMenuItemFromURL(item, url);
      if (foundItem) {
        return foundItem;
      }
    }
  } else {
    if (items.url == url) return items;
    if (items.children != null) {
      for (const item of items.children) {
        if (item.url == url) return item;
      }
    }
  }
};

export const findMenuItem = (menuItems, menuItemKey) => {
  if (menuItems && menuItemKey) {
    for (const item of menuItems) {
      if (item.key === menuItemKey) {
        return item;
      }
      const found = findMenuItem(item.children, menuItemKey);
      if (found) return found;
    }
  }
  return null;
};
