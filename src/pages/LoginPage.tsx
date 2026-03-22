
import { loginSchema, type LoginData } from '../schemas/auth.schema'
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { login } from '../services/auth.service';
import { useNavigate } from 'react-router-dom';

export const LoginPage = () => {
  const navgate = useNavigate();
  const { register, handleSubmit } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginData) => {
    try {
      await login(data.email, data.password);
      navgate("/");
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <main>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="email" placeholder="E-mail" {...register("email")} />
        <input type="password" placeholder="Senha" {...register("password")} />
        <button type="submit">Entrar</button>
      </form>
    </main>
  )
}
