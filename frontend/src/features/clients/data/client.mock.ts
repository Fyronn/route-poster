import type { Client } from "../types/client.types";

export const clientsMockData: Client[] = [
  {
    id: "CLT-001",
    name: "TechCorp Inc.",
    type: "Corporate",
    routeCount: 3,
    riderCount: 85,
    contactPerson: "Jane Wilson",
    contactEmail: "jane.wilson@techcorp.com",
    status: "active",
  },
  {
    id: "CLT-002",
    name: "State University",
    type: "Educational",
    routeCount: 5,
    riderCount: 152,
    contactPerson: "Dr. Robert Brown",
    contactEmail: "r.brown@stateuni.edu",
    status: "active",
  },
  {
    id: "CLT-003",
    name: "RetailGroup LLC",
    type: "Commercial",
    routeCount: 2,
    riderCount: 64,
    contactPerson: "Michael Torres",
    contactEmail: "m.torres@retailgroup.com",
    status: "active",
  },
  {
    id: "CLT-004",
    name: "Lincoln School District",
    type: "Educational",
    routeCount: 8,
    riderCount: 245,
    contactPerson: "Patricia Moore",
    contactEmail: "p.moore@lincolnschools.org",
    status: "active",
  },
];