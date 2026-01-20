export class EmailVo {
  private readonly email: string;

  constructor(email: string) {
    const normalized = email.trim().toLowerCase();
    if (!this.isValidEmail(normalized)) {
      throw new Error('Invalid email format.');
    }
    this.email = normalized;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  getValue(): string {
    return this.email;
  }
}
