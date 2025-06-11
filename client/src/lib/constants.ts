export const USER_ROLES = {
  ADMIN: "admin",
  ADVOCATE: "advocate",
  STAFF: "staff",
  CLIENT: "client"
} as const;

export const CASE_TYPES = {
  CIVIL: "civil",
  CRIMINAL: "criminal",
  CORPORATE: "corporate",
  FAMILY: "family"
} as const;

export const CASE_STATUS = {
  ACTIVE: "active",
  PENDING: "pending",
  COMPLETED: "completed",
  ON_HOLD: "on-hold"
} as const;

export const CASE_PRIORITY = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  URGENT: "urgent"
} as const;

export const CLIENT_TYPES = {
  INDIVIDUAL: "individual",
  CORPORATE: "corporate",
  GOVERNMENT: "government"
} as const;

export const CLIENT_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  PROSPECT: "prospect"
} as const;

export const ROLE_PERMISSIONS = {
  [USER_ROLES.ADMIN]: ["all"],
  [USER_ROLES.ADVOCATE]: ["cases", "clients", "documents", "hearings"],
  [USER_ROLES.STAFF]: ["cases", "clients", "documents"],
  [USER_ROLES.CLIENT]: ["view_own_cases", "view_own_documents"]
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case CASE_STATUS.ACTIVE:
      return "bg-green-100 text-green-800";
    case CASE_STATUS.PENDING:
      return "bg-amber-100 text-amber-800";
    case CASE_STATUS.COMPLETED:
      return "bg-blue-100 text-blue-800";
    case CASE_STATUS.ON_HOLD:
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case CASE_PRIORITY.LOW:
      return "bg-blue-100 text-blue-800";
    case CASE_PRIORITY.MEDIUM:
      return "bg-amber-100 text-amber-800";
    case CASE_PRIORITY.HIGH:
      return "bg-orange-100 text-orange-800";
    case CASE_PRIORITY.URGENT:
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
