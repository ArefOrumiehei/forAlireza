import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";

type ForgotPasswordForm = {
  email: string;
};

const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
});

export default function ForgotPasswordPage() {
  const {forgotPassword} = useAuthStore()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordForm>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    const res = await forgotPassword(data.email);
    console.log("Reset link sent to:", data.email);
    console.log("Result:", res);
  };

  return (
    <div className="flex h-screen items-center justify-center bg-neutral-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-96 p-6 bg-white rounded-xl shadow space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Forgot Password</h1>

        <div>
          <Input placeholder="Email" {...register("email")} />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        <Button className="w-full" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Send Reset Link"}
        </Button>

        <p className="text-sm text-center text-neutral-500 mt-2">
          Remembered your password?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
