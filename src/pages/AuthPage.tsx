import { useForm } from "react-hook-form";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import {
  loginSchema,
  registerSchema,
  type LoginData,
  type RegisterData,
} from "../schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { login, register } from "../services/auth.service";
import { ThemeToggle } from "../components/ThemeToggle";
import { FormInput } from "../components/FormInput";
import { Eye, Mail, User } from "lucide-react";

export const AuthPage = () => {
  const { mode } = useParams();
  const navigate = useNavigate();

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

  const onLoginSubmit = (data: LoginData) => {
    try {
      login(data.email, data.password);
      navigate("/timeline");
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const onRegisterSubmit = (data: RegisterData) => {
    try {
      register(data.name, data.email, data.password);
      navigate("/auth/login");
    } catch (error) {
      console.error("Registration failed", error);
    }
  };

  return (
    <main
      className=" min-h-screen bg-(--bg) text-(--text) flex flex-col items-center justify-start"
      style={{ backgroundImage: "var(--bg-gradient)" }}
    >
      <ThemeToggle />
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
            {isLogin ? "Olá, de novo!" : "Olá, vamos começar?"}
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            {isLogin
              ? "Por favor, insira os seus dados para fazer login."
              : "Por favor, insira os dados solicitados para fazer cadastro."}
          </p>
        </div>
        {isLogin ? (
          <form action="" className="w-100" onSubmit={loginForm.handleSubmit(onLoginSubmit)}>
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
              className="w-full bg-(--blue) text-white py-4 px-4 rounded-full transition-all duration-200 ease-in-out hover:bg-blue-500 focus:outline-none "
            >
              Continuar
            </button>
          </form>
        ) : (
          <form
            className="w-100"
            action=""
            onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
          >
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
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Continuar
            </button>
          </form>
        )}
      </section>
    </main>
  );
};
