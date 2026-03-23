import { z } from "zod";

export const loginSchema = z.object({
  email: z.email({ message: "E-mail inválido" }),
  password: z.string().min(1, { message: "A senha é obrigatória" }),
});

export type LoginData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().min(2, { message: "O nome deve conter no mínimo 2 caracteres" }),
  email: z.email({ message: "E-mail inválido" }),
  password: z.string().min(6, { message: "A senha deve conter no mínimo 6 caracteres" }),
});

export type RegisterData = z.infer<typeof registerSchema>;
