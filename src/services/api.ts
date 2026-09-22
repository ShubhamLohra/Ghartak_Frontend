import { ServiceCategory, ServiceItem, Booking, RawMaterialProduct, ServiceLead, Review, User, AdminNotification } from '../types';

const LOCAL_BACKEND_URL = 'http://localhost:8080/api';
const API_BASE = import.meta.env.VITE_API_URL || LOCAL_BACKEND_URL;

export const api = {
  // Auth
  async login(email: string, password: string) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async register(data: any) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  // Categories & Services
  async getCategories(): Promise<ServiceCategory[]> {
    const res = await fetch(`${API_BASE}/categories`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
  },

  async getServicesByCategory(catId: number): Promise<ServiceItem[]> {
    const res = await fetch(`${API_BASE}/services/category/${catId}`);
    if (!res.ok) throw new Error('Failed to fetch services');
    return res.json();
  },

  async getPopularServices(): Promise<ServiceItem[]> {
    const res = await fetch(`${API_BASE}/services/popular`);
    if (!res.ok) throw new Error('Failed to fetch popular services');
    return res.json();
  },

  async searchServices(query: string): Promise<ServiceItem[]> {
    const res = await fetch(`${API_BASE}/services/search?q=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error('Failed to search services');
    return res.json();
  },

  // Bookings
  async createBooking(bookingData: any): Promise<Booking> {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    });
    if (!res.ok) throw new Error('Failed to create booking');
    return res.json();
  },

  async getUserBookings(userId: number): Promise<Booking[]> {
    const res = await fetch(`${API_BASE}/bookings/user/${userId}`);
    if (!res.ok) throw new Error('Failed to fetch user bookings');
    return res.json();
  },

  async updateBookingStatus(bookingId: number, status: string): Promise<Booking> {
    const res = await fetch(`${API_BASE}/bookings/${bookingId}/status?status=${status}`, {
      method: 'PATCH'
    });
    if (!res.ok) throw new Error('Failed to update status');
    return res.json();
  },

  // Raw Materials
  async getRawMaterials(): Promise<RawMaterialProduct[]> {
    const res = await fetch(`${API_BASE}/raw-materials`);
    if (!res.ok) throw new Error('Failed to fetch raw materials');
    return res.json();
  },

  // Partner Leads
  async getAvailableLeads(): Promise<ServiceLead[]> {
    const res = await fetch(`${API_BASE}/leads`);
    if (!res.ok) throw new Error('Failed to fetch partner leads');
    return res.json();
  },

  async acceptLead(leadId: number, workerId: number): Promise<ServiceLead> {
    const res = await fetch(`${API_BASE}/leads/${leadId}/accept?workerId=${workerId}`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  // Admin Portal API
  async getAdminStats(): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/stats`);
    if (!res.ok) throw new Error('Failed to fetch admin stats');
    return res.json();
  },

  async getFinancialAnalytics(range: string = 'MONTHLY'): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/analytics?range=${range}`);
    if (!res.ok) throw new Error('Failed to fetch analytics');
    return res.json();
  },

  async getLeastBookedInsights(): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/least-booked`);
    if (!res.ok) throw new Error('Failed to fetch least booked insights');
    return res.json();
  },

  async getCancellationAnalysis(): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/cancellations`);
    if (!res.ok) throw new Error('Failed to fetch cancellation analysis');
    return res.json();
  },

  async getAllAdminBookings(): Promise<Booking[]> {
    const res = await fetch(`${API_BASE}/admin/bookings`);
    if (!res.ok) throw new Error('Failed to fetch all bookings');
    return res.json();
  },

  async updateAdminBookingStatus(bookingId: number, status: string, providerId?: number): Promise<Booking> {
    let url = `${API_BASE}/admin/bookings/${bookingId}/status?status=${status}`;
    if (providerId) url += `&providerId=${providerId}`;
    const res = await fetch(url, { method: 'PUT' });
    if (!res.ok) throw new Error('Failed to update status');
    return res.json();
  },

  async reassignBooking(bookingId: number, newProviderId: number, reason?: string): Promise<Booking> {
    let url = `${API_BASE}/admin/bookings/${bookingId}/reassign?newProviderId=${newProviderId}`;
    if (reason) url += `&reason=${encodeURIComponent(reason)}`;
    const res = await fetch(url, { method: 'PUT' });
    if (!res.ok) throw new Error('Failed to reassign booking');
    return res.json();
  },

  async getAllAdminProviders(): Promise<User[]> {
    const res = await fetch(`${API_BASE}/admin/providers`);
    if (!res.ok) throw new Error('Failed to fetch admin providers');
    return res.json();
  },

  async getProvidersByService(profession: string): Promise<User[]> {
    const res = await fetch(`${API_BASE}/admin/providers/by-service?profession=${encodeURIComponent(profession)}`);
    if (!res.ok) throw new Error('Failed to fetch service providers');
    return res.json();
  },

  async onboardProvider(providerData: any): Promise<User> {
    const res = await fetch(`${API_BASE}/admin/providers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(providerData)
    });
    if (!res.ok) throw new Error('Failed to onboard provider');
    return res.json();
  },

  async saveCategory(categoryData: any): Promise<ServiceCategory> {
    const res = await fetch(`${API_BASE}/admin/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(categoryData)
    });
    if (!res.ok) throw new Error('Failed to save category');
    return res.json();
  },

  async updateCategory(id: number, categoryData: any): Promise<ServiceCategory> {
    const res = await fetch(`${API_BASE}/admin/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(categoryData)
    });
    if (!res.ok) throw new Error('Failed to update category');
    return res.json();
  },

  async deleteCategory(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/admin/categories/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete category');
  },

  async getAdminNotifications(): Promise<AdminNotification[]> {
    const res = await fetch(`${API_BASE}/admin/notifications`);
    if (!res.ok) throw new Error('Failed to fetch notifications');
    return res.json();
  },

  async markNotificationRead(id: number): Promise<void> {
    await fetch(`${API_BASE}/admin/notifications/${id}/read`, { method: 'PUT' });
  },

  async getReviews(): Promise<Review[]> {
    const res = await fetch(`${API_BASE}/admin/reviews`);
    if (!res.ok) throw new Error('Failed to fetch reviews');
    return res.json();
  }
};
