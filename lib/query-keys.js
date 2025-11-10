/**
 * Centralized Query Keys Factory
 * Following React Query best practices for key management
 */

export const queryKeys = {
  // Auth keys
  auth: {
    all: ['auth'],
    currentUser: () => [...queryKeys.auth.all, 'currentUser'],
  },

  // Events keys
  events: {
    all: ['events'],
    lists: () => [...queryKeys.events.all, 'list'],
    list: (filters) => [...queryKeys.events.lists(), { filters }],
    details: () => [...queryKeys.events.all, 'detail'],
    detail: (id) => [...queryKeys.events.details(), id],
  },

  // Programs keys
  programs: {
    all: ['programs'],
    lists: () => [...queryKeys.programs.all, 'list'],
    list: (filters) => [...queryKeys.programs.lists(), { filters }],
    details: () => [...queryKeys.programs.all, 'detail'],
    detail: (id) => [...queryKeys.programs.details(), id],
  },

  // Blog keys
  blogs: {
    all: ['blogs'],
    lists: () => [...queryKeys.blogs.all, 'list'],
    list: (filters) => [...queryKeys.blogs.lists(), { filters }],
    details: () => [...queryKeys.blogs.all, 'detail'],
    detail: (id) => [...queryKeys.blogs.details(), id],
  },

  // Admin keys
  admin: {
    all: ['admin'],
    stats: () => [...queryKeys.admin.all, 'stats'],
    events: {
      all: () => [...queryKeys.admin.all, 'events'],
      lists: () => [...queryKeys.admin.events.all(), 'list'],
      list: (filters) => [...queryKeys.admin.events.lists(), { filters }],
    },
  },
};
