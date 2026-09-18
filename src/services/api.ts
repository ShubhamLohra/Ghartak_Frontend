import { ServiceCategory, ServiceItem, Booking, RawMaterialProduct, ServiceLead, Review, User } from '../types';

// Live Render Spring Boot Backend URL
const PRODUCTION_BACKEND_URL = 'https://ghartak-backend-p38q.onrender.com/api';

const API_BASE = import.meta.env.VITE_API_URL || PRODUCTION_BACKEND_URL;

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

  // Admin Stats & Reviews
  async getAdminStats(): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/stats`);
    if (!res.ok) throw new Error('Failed to fetch admin stats');
    return res.json();
  },

  async getReviews(): Promise<Review[]> {
    const res = await fetch(`${API_BASE}/admin/reviews`);
    if (!res.ok) throw new Error('Failed to fetch reviews');
    return res.json();
  }
};
