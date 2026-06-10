import type { PremiumUpgradeRequest } from "@/lib/app-store";

export const seedPremiumUpgradeRequests: PremiumUpgradeRequest[] = [
  {
    id: "ur-u2-seed",
    userId: "u2",
    userName: "Carlos Mendoza",
    userEmail: "carlos.m@outlook.com",
    userPhone: "+51 912 345 678",
    userDni: "45678901",
    totalInvested: 8200,
    submittedAt: "2026-06-08T09:15:00",
    status: "pending",
  },
  {
    id: "ur-u6-seed",
    userId: "u6",
    userName: "Diego Ramírez",
    userEmail: "diego.r@gmail.com",
    userPhone: "+51 934 567 890",
    userDni: "78901234",
    totalInvested: 6000,
    submittedAt: "2026-06-09T14:42:00",
    status: "pending",
  },
  {
    id: "ur-u4-seed",
    userId: "u4",
    userName: "Roberto Silva",
    userEmail: "r.silva@gmail.com",
    userPhone: "+51 945 123 789",
    userDni: "56789012",
    totalInvested: 3500,
    submittedAt: "2026-06-07T11:30:00",
    status: "pending",
  },
];
