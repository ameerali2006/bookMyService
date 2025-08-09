import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ErrorToast, SuccessToast } from "./Toaster";
import {authService} from '@/api/AuthService'
 // Update path if needed

interface ResetPasswordFormProps {
  role: "user" | "worker";
  token?: string;
  onBack?: () => void;
  onSuccess?: () => void;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  role,
  token,
  onBack,
  onSuccess,
}) => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      ErrorToast("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      ErrorToast("Passwords do not match.");
      return;
    }

    if (!token) {
      ErrorToast("Token not found.");
      return;
    }

    setLoading(true);
    try {
      await (role === "user" ? authService.userResetPassword : authService.workerResetPassword)({
        token,
        password,
        confirmPassword,
      });

      SuccessToast("Password reset successful!");
      setResetSuccess(true);
      if (onSuccess) onSuccess();
    } catch (error: any) {
      ErrorToast(error?.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateToLogin = () => {
    navigate(role === "user" ? "/login" : "/worker/login");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full">
      <div className="text-center mb-4">
        <h2 className="text-xl font-semibold">
          Reset Password for{" "}
          <span className="capitalize">{role === "user" ? "user" : "worker"}</span>{" "}
          Account
        </h2>
      </div>

      {!resetSuccess ? (
        <>
          <div>
            <Label htmlFor="password">New Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
              />
              <span
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
              />
              <span
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-600"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            {onBack && (
              <Button type="button" variant="ghost" onClick={onBack}>
                Back
              </Button>
            )}
            <Button type="submit" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </Button>
          </div>
        </>
      ) : (
        <div className="text-center space-y-4">
          <p className="text-green-600 font-medium">Password has been reset successfully!</p>
          <Button onClick={handleNavigateToLogin}>Continue to Login</Button>
        </div>
      )}
    </form>
  );
};

export default ResetPasswordForm;
