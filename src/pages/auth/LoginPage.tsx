/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import api from "@/api/axiosInstance";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type LoginForm = {
  username: string;
  password: string;
};

const schema = yup.object({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),
});

export default function LoginPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginForm>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      const res = await api.post("/login", data);
      localStorage.setItem("access_token", res.data.access_token);
      localStorage.setItem("refresh_token", res.data.refresh_token);
      navigate("/stores");
    } catch (err: any) {
      setError("username", { message: "Invalid credentials" });
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-neutral-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-96 p-6 bg-white rounded-xl shadow space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Login</h1>

        <div>
          <Input placeholder="Username" {...register("username")} />
          {errors.username && (
            <p className="text-red-500 text-sm">{errors.username.message}</p>
          )}
        </div>

        <div>
          <Input
            placeholder="Password"
            type="password"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        <Button className="w-full" type="submit">
          Login
        </Button>
        <p className="text-sm text-center text-neutral-500 mt-2">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
