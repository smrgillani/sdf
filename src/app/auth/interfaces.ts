export interface AuthStrategy {
  login(options?: any);
  logout();
  isLoggedIn(): boolean;
}
