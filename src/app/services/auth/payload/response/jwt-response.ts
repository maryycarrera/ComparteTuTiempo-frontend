export interface JwtResponse {
  token: string;
  type: string;
  username: string;
  id: number;
  authorities: string[];
}