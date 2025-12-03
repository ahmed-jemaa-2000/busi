import { cookies } from 'next/headers';
import type { User, AuthResponse } from '@busi/types';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

/**
 * Login user with email and password
 */
export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${STRAPI_URL}/api/auth/local`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      identifier: email,
      password,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Invalid credentials');
  }

  return response.json();
}

/**
 * Get current user from JWT token (server-side)
 */
export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = cookies();
  const token = cookieStore.get('auth_token');

  if (!token) {
    return null;
  }

  try {
    const response = await fetch(`${STRAPI_URL}/api/users/me?populate=role`, {
      headers: {
        'Authorization': `Bearer ${token.value}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
}

/**
 * Get auth token from cookies (server-side)
 */
export function getAuthToken(): string | undefined {
  const cookieStore = cookies();
  const token = cookieStore.get('auth_token');
  return token?.value;
}

/**
 * Verify if user is authenticated (server-side)
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return user !== null;
}

/**
 * Get user's shop ID (server-side)
 */
export async function getUserShopId(token: string): Promise<number | null> {
  try {
    const response = await fetch(`${STRAPI_URL}/api/shops?populate=owner`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (data.data && data.data.length > 0) {
      return data.data[0].id;
    }

    return null;
  } catch (error) {
    console.error('Error fetching user shop:', error);
    return null;
  }
}
