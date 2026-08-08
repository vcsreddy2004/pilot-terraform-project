export interface userResponceDTO {
  name: string;
  email: string;
  role: "customer" | "admin";
  isVerified: boolean;
}