import { Injectable, signal } from '@angular/core';

/**
 * Fully mocked auth flow. Any email/password combination "succeeds" after a
 * short simulated delay so the UI (loading states, transitions) feels real.
 * Nothing here calls a network — replace `delay()` calls with real HTTP
 * requests when a backend exists.
 */
@Injectable({ providedIn: 'root' })
export class MockAuthService {
  readonly isAuthenticated = signal(false);

  private delay(ms = 900): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async login(email: string, _password: string): Promise<{ success: boolean; message?: string }> {
    await this.delay();
    if (!email.includes('@')) {
      return { success: false, message: 'Enter a valid email address.' };
    }
    this.isAuthenticated.set(true);
    return { success: true };
  }

  async signup(name: string, email: string, _password: string): Promise<{ success: boolean; message?: string }> {
    await this.delay();
    if (!name.trim()) {
      return { success: false, message: 'Please enter your name.' };
    }
    if (!email.includes('@')) {
      return { success: false, message: 'Enter a valid email address.' };
    }
    this.isAuthenticated.set(true);
    return { success: true };
  }

  async sendResetLink(email: string): Promise<{ success: boolean; message?: string }> {
    await this.delay(700);
    if (!email.includes('@')) {
      return { success: false, message: 'Enter a valid email address.' };
    }
    return { success: true };
  }

  async resetPassword(_password: string): Promise<{ success: boolean }> {
    await this.delay(700);
    return { success: true };
  }

  logout(): void {
    this.isAuthenticated.set(false);
  }
}
