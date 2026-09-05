export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  memberTier: "Bronze" | "Silver" | "Gold" | "Diamond";
  rewardPoints: number;
}

export interface ShippingAddress {
  id: string;
  fullName: string;
  phone: string;
  city: string;
  district: string;
  ward: string;
  streetAddress: string;
  isDefault: boolean;
}
