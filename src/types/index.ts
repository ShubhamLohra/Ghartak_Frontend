export type Role = 'CUSTOMER' | 'SERVICE_PROVIDER' | 'SUPPLIER' | 'ADMIN';

export interface User {
  id: number;
  email: string;
  fullName: string;
  phone: string;
  address?: string;
  city?: string;
  pincode?: string;
  role: Role;
  profession?: string;
  rating?: number;
  completedJobs?: number;
  totalEarnings?: number;
  dailyLeadsRemaining?: number;
  createdAt?: string;
}

export interface ServiceItem {
  id: number;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  duration: string;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  unitType: string;
  isPopular: boolean;
  category?: ServiceCategory;
}

export interface ServiceCategory {
  id: number;
  name: string;
  code: string;
  description: string;
  iconName?: string;
  badgeText?: string;
  categoryGroup?: string;
  bgGradient?: string;
  baseCharge?: number;
  commissionRate?: number;
  commissionType?: 'PERCENTAGE' | 'FIXED';
  services: ServiceItem[];
}

export interface BookingItem {
  id?: number;
  title: string;
  price: number;
  quantity: number;
}

export interface Booking {
  id: number;
  bookingCode: string;
  customer?: User;
  provider?: User;
  serviceCategoryName: string;
  scheduledDate: string;
  scheduledTimeSlot: string;
  address: string;
  city: string;
  pincode: string;
  contactPhone: string;
  instructions?: string;
  totalAmount: number;
  taxesAndFee: number;
  commissionAmount?: number;
  providerPayout?: number;
  paymentMethod: string;
  paymentStatus: string;
  cancelStage?: string;
  cancellationReason?: string;
  cancelledBy?: string;
  status: 'BOOKED' | 'PROVIDER_ASSIGNED' | 'EN_ROUTE' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  items: BookingItem[];
  createdAt?: string;
}

export interface AdminNotification {
  id: number;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  bookingId?: number;
  createdAt: string;
}

export interface RawMaterialProduct {
  id: number;
  name: string;
  category: string;
  supplierName: string;
  price: number;
  unit: string;
  rating: number;
  isBulkAvailable: boolean;
  minimumOrder: number;
  description: string;
  imageUrl: string;
}

export interface ServiceLead {
  id: number;
  leadCode: string;
  serviceCategory: string;
  customerName: string;
  customerPhone: string;
  location: string;
  distance: string;
  estimatedPayout: number;
  timeSlot: string;
  requirementDetails: string;
  leadStatus: 'AVAILABLE' | 'ACCEPTED' | 'EXPIRED';
  assignedWorker?: User;
}

export interface Review {
  id: number;
  userName: string;
  userCity: string;
  rating: number;
  serviceCategory: string;
  comment: string;
  verifiedBooking: boolean;
  date?: string;
}
