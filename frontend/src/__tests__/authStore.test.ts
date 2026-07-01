import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuthStore } from '../../src/stores/authStore';

describe('Auth Store', () => {
  beforeEach(() => {
    // Clear store before each test
    useAuthStore.setState({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    });
  });

  it('should initialize with empty state', () => {
    const { result } = renderHook(() => useAuthStore());
    
    expect(result.current.user).toBeNull();
    expect(result.current.accessToken).toBeNull();
    expect(result.current.refreshToken).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should login user successfully', () => {
    const { result } = renderHook(() => useAuthStore());
    
    const mockUser = {
      id: 1,
      nombre: 'Test User',
      email: 'test@example.com',
      rol: 'ADMIN',
      empresa_id: 1,
    };

    act(() => {
      result.current.login(mockUser, 'access-token', 'refresh-token');
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.accessToken).toBe('access-token');
    expect(result.current.refreshToken).toBe('refresh-token');
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should logout user', () => {
    const { result } = renderHook(() => useAuthStore());
    
    const mockUser = {
      id: 1,
      nombre: 'Test User',
      email: 'test@example.com',
      rol: 'ADMIN',
      empresa_id: 1,
    };

    act(() => {
      result.current.login(mockUser, 'access-token', 'refresh-token');
    });

    expect(result.current.isAuthenticated).toBe(true);

    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.accessToken).toBeNull();
    expect(result.current.refreshToken).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should get auth header', () => {
    const { result } = renderHook(() => useAuthStore());
    
    const mockUser = {
      id: 1,
      nombre: 'Test User',
      email: 'test@example.com',
      rol: 'ADMIN',
      empresa_id: 1,
    };

    act(() => {
      result.current.login(mockUser, 'test-token', 'refresh-token');
    });

    const header = result.current.getAuthHeader();
    expect(header).toHaveProperty('Authorization');
    expect(header.Authorization).toContain('Bearer');
  });

  it('should return empty header when not authenticated', () => {
    const { result } = renderHook(() => useAuthStore());
    
    const header = result.current.getAuthHeader();
    expect(header).toEqual({});
  });

  it('should update tokens', () => {
    const { result } = renderHook(() => useAuthStore());
    
    const mockUser = {
      id: 1,
      nombre: 'Test User',
      email: 'test@example.com',
      rol: 'ADMIN',
      empresa_id: 1,
    };

    act(() => {
      result.current.login(mockUser, 'old-token', 'old-refresh');
    });

    act(() => {
      result.current.setTokens('new-token', 'new-refresh');
    });

    expect(result.current.accessToken).toBe('new-token');
    expect(result.current.refreshToken).toBe('new-refresh');
  });
});
