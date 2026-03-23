import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, Mail, User } from "lucide-react";
import {
  loginSchema,
  registerSchema,
  type LoginData,
  type RegisterData,
} from "../schemas/auth.schema";
import { login, register } from "../services/auth.service";
import { ThemeToggle } from "../components/ThemeToggle";
import { FormInput } from "../components/FormInput";
import { AppToast } from "../components/AppToast";

export const AuthPage = () => {
  const { mode } = useParams();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState<string | null>(null);

  const isLogin = mode === "login";
  const loginForm = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  if (mode !== "login" && mode !== "register") {
    return <Navigate to="/auth/login" replace />;
  }

  const onLoginSubmit = async (data: LoginData) => {
    try {
      setAuthError(null);
      await login(data.email, data.password);
      navigate("/timeline");
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "Falha no login.");
    }
  };

  const onRegisterSubmit = async (data: RegisterData) => {
    try {
      setAuthError(null);
      await register(data.name, data.email, data.password);
      navigate("/auth/login");
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "Falha no cadastro.");
    }
  };

  return (
    <main
      className=" min-h-screen bg-(--bg) text-(--text) flex flex-col items-center justify-start"
      style={{ backgroundImage: "var(--bg-gradient)" }}
    >
      <div className="fixed right-4 top-4">
        <ThemeToggle />
      </div>
      <AppToast
        open={Boolean(authError)}
        message={authError}
        variant="error"
        onClose={() => setAuthError(null)}
      />
      <section className="flex h-screen w-100 flex-col items-center justify-center gap-4">
        <h1 className="text-3xl font-semibold">Mini Twitter</h1>

        <div className="flex ">
          <Link
            to="/auth/login"
            className={`pb-4 text-md border-b-3 w-48 text-center text-(--blue) dark:text-(--text) ${isLogin ? "border-b-3 border-(--blue)" : "border-gray-300 dark:border-gray-600"}`}
          >
            Login
          </Link>
          <Link
            to="/auth/register"
            className={`pb-4 text-md border-b-3 w-48 text-center text-(--blue) dark:text-(--text) ${!isLogin ? "border-b-3 border-(--blue)" : "border-gray-300 dark:border-gray-600"}`}
          >
            Register
          </Link>
        </div>
        <div className="w-100">
          <h2 className="text-2xl font-medium text-(--blue) dark:text-gray-300">
            {isLogin ? "Ola, de novo!" : "Ola, vamos comecar?"}
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            {isLogin
              ? "Por favor, insira os seus dados para fazer login."
              : "Por favor, insira os dados solicitados para fazer cadastro."}
          </p>
        </div>
        {isLogin ? (
          <form className="w-100" onSubmit={loginForm.handleSubmit(onLoginSubmit)}>
            <div className="mb-4">
              <FormInput
                id="email"
                type="email"
                label="Email"
                registration={loginForm.register("email")}
                placeholder="Insira o seu email"
                icon={<Mail size={16} />}
              />
            </div>
            <div className="mb-4">
              <FormInput
                id="password"
                type="password"
                label="Password"
                registration={loginForm.register("password")}
                placeholder="Insira sua senha"
                icon={<Eye size={16} />}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-(--blue) text-white py-4 px-4 rounded-full transition-all duration-200 ease-in-out hover:bg-blue-500 focus:outline-none disabled:opacity-60"
              disabled={loginForm.formState.isSubmitting}
            >
              {loginForm.formState.isSubmitting ? "Entrando..." : "Continuar"}
            </button>
          </form>
        ) : (
          <form className="w-100" onSubmit={registerForm.handleSubmit(onRegisterSubmit)}>
            <div className="mb-4">
              <FormInput
                id="name"
                type="text"
                label="Name"
                registration={registerForm.register("name")}
                placeholder="Insira o seu nome"
                icon={<User size={16} />}
              />
            </div>
            <div className="mb-4">
              <FormInput
                id="email"
                type="email"
                label="Email"
                registration={registerForm.register("email")}
                placeholder="Insira o seu email"
                icon={<Mail size={16} />}
              />
            </div>
            <div className="mb-4">
              <FormInput
                id="password"
                type="password"
                label="Password"
                registration={registerForm.register("password")}
                placeholder="Insira sua senha"
                icon={<Eye size={16} />}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60"
              disabled={registerForm.formState.isSubmitting}
            >
              {registerForm.formState.isSubmitting ? "Enviando..." : "Continuar"}
            </button>
          </form>
        )}
      </section>
    </main>
  );
};
