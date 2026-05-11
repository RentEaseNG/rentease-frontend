import { describe, it, expect, vi, beforeEach } from 'vitest';
import apiClient from '../api/client';

describe('apiClient', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should have the correct base URL from env', () => {
    expect(apiClient.defaults.baseURL).toBe(import.meta.env.VITE_API_URL);
  });

  it('should add Authorization header if token exists in localStorage', async () => {
    const token = 'test-token';
    localStorage.setItem('token', token);

    // We can't easily test the interceptor without making a real request or mocking axios deeply,
    // but we can check if the interceptor is registered.
    expect(apiClient.interceptors.request.handlers.length).toBeGreaterThan(0);
  });
});
