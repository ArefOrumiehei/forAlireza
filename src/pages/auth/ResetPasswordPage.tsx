import { useSearchParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "react-toastify";


type ResetForm = {
  password: string;
  confirmPassword: string;
};

const schema = yup.object({
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
});

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const resetPassword = useAuthStore((state) => state.resetPassword);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetForm>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: ResetForm) => {
    if (!token) return toast.error("Invalid or missing token.");
    const success = await resetPassword(token, data.password);
    if (success) navigate("/login");
  };

  return (
    <div className="flex h-screen items-center justify-center bg-neutral-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-96 p-6 bg-white rounded-xl shadow space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Reset Password</h1>

        <div>
          <Input
            placeholder="New Password"
            type="password"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        <div>
          <Input
            placeholder="Confirm Password"
            type="password"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button className="w-full" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Resetting..." : "Reset Password"}
        </Button>

      </form>
    </div>
  );
}
