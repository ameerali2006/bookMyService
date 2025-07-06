export interface IJwtService {
  generateAccessToken(_id: string,role:"user"|"admin"|"worker"): string;
  generateRefreshToken(_id: string,role:"user"|"admin"|"worker"): string;
  verifyToken(token: string, type: "access" | "refresh"): any;
}