// types/JwtPayload.ts
export interface HMSJwtPayload {
  id: number;
  role: string; // ADMIN | PATIENT | DOCTOR
  email: string;
  name: string;
  exp?: number;
}
