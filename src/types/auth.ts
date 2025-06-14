import { UserPayload } from "@/lib/auth";

export interface AuthContextType {
  user: UserPayload | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}
