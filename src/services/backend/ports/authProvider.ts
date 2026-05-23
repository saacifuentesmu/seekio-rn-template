// Backend-neutral auth contract (a "port" in ports-and-adapters).
//
// Screens and hooks depend on THIS interface, never on axios, Firebase, or any
// vendor SDK. Each backend (REST, Firebase, Cognito, ...) ships an adapter that
// implements it. Swapping backends = swapping the adapter selected in
// services/backend/index.ts, with no change to consumers.
//
// MUST NOT import axios or any vendor SDK.

import {SessionUser} from '@/store/sessionStore';

export type {SessionUser};

export interface AuthProvider {
  /** Email/password sign-in. Establishes the session and returns the user. */
  signIn(input: {email: string; password: string}): Promise<SessionUser>;

  /** Register a new account. Establishes the session and returns the user. */
  signUp(input: {email: string; password: string}): Promise<SessionUser>;

  /** Federated Google sign-in. Resolves to null when the user cancels. */
  signInWithGoogle(): Promise<SessionUser | null>;

  /** Trigger a password-reset flow for the given email. */
  forgotPassword(input: {email: string}): Promise<void>;

  /** Cold-start restore. Returns the user if a valid session exists, else null. */
  restoreSession(): Promise<SessionUser | null>;

  /** Fetch the current authenticated user (the `/me` equivalent). */
  getCurrentUser(): Promise<SessionUser>;

  /** Clear the session locally and remotely where applicable. */
  signOut(): Promise<void>;
}
