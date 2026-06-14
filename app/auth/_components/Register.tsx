"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Mail,
  Lock,
  User,
  Eye as EyeIcon,
  EyeOff,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

interface RegisterProps {
  onSwitchToLogin: () => void;
}

export default function Register({ onSwitchToLogin }: RegisterProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const { register } = useAuth();

  const formik = useFormik({
    initialValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      role: "FARMER",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      username: Yup.string().required("Required"),
      password: Yup.string()
        .min(4, "Must be at least 4 characters")
        .required("Required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), undefined], 'Passwords must match')
        .required('Required'),
      firstName: Yup.string().required("Required"),
      lastName: Yup.string().required("Required"),
      role: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      setServerError(null);
      try {
        await register(values);
        toast.success("Account created successfully!");
      } catch (error: any) {
        setServerError(
          error?.message || "An unexpected error occurred. Please try again."
        );
      }
    },
  });

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center lg:text-left">
        <h1 className="text-3xl lg:text-4xl font-bold text-on-surface font-clash-display">
          Create Account
        </h1>
        <p className="mt-2 text-on-surface-variant">
          Join us today and find your perfect boarding place.
        </p>
      </div>

      <form onSubmit={formik.handleSubmit} className="mt-8 space-y-5">
        {serverError && (
          <div className="p-3 rounded-xl bg-error-container border border-error-container/20 flex items-center gap-3 text-on-error-container text-sm">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            {serverError}
          </div>
        )}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1.5">
              Email
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-variant group-focus-within:text-primary transition-colors">
                <Mail className="h-5 w-5" />
              </div>
              <input
                type="email"
                {...formik.getFieldProps("email")}
                className={`block w-full pl-10 pr-3 py-3 border rounded-xl bg-surface-container text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${formik.touched.email && formik.errors.email
                    ? "border-error"
                    : "border-outline-variant"
                  }`}
                placeholder="you@example.com"
              />
            </div>
            {formik.touched.email && formik.errors.email ? (
              <div className="text-error text-xs mt-1">
                {formik.errors.email}
              </div>
            ) : null}
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1.5">
              User Name
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-variant group-focus-within:text-primary transition-colors">
                <User className="h-5 w-5" />
              </div>
              <input
                type="text"
                {...formik.getFieldProps("username")}
                className={`block w-full pl-10 pr-3 py-3 border rounded-xl bg-surface-container text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${formik.touched.username && formik.errors.username
                    ? "border-error"
                    : "border-outline-variant"
                  }`}
                placeholder="Enter username"
              />
            </div>
            {formik.touched.username && formik.errors.username ? (
              <div className="text-error text-xs mt-1">
                {formik.errors.username}
              </div>
            ) : null}
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1.5">
              Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-variant group-focus-within:text-primary transition-colors">
                <Lock className="h-5 w-5" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                {...formik.getFieldProps("password")}
                className={`block w-full pl-10 pr-12 py-3 border rounded-xl bg-surface-container text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${formik.touched.password && formik.errors.password
                    ? "border-error"
                    : "border-outline-variant"
                  }`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-on-surface-variant hover:text-on-surface transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            {formik.touched.password && formik.errors.password ? (
              <div className="text-error text-xs mt-1">
                {formik.errors.password}
              </div>
            ) : null}
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1.5">
              Role
            </label>
            <div className="relative group">
              <select
                {...formik.getFieldProps("role")}
                className={`block w-full pl-3 pr-10 py-3 border rounded-xl bg-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${formik.touched.role && formik.errors.role
                    ? "border-error"
                    : "border-outline-variant"
                  }`}
              >
                <option value="FARMER">Farmer</option>
                <option value="SYSTEM_ADMIN">System Admin</option>
                <option value="GOVERNMENT_ADMIN">Government Admin</option>
                <option value="AGRARIAN_SERVICE_OFFICER">Agrarian Service Officer</option>
                <option value="PRIVATE_AGRO_DEALER">Private Agro Dealer</option>
                <option value="ORGANIC_FERTILIZER_PRODUCER">Organic Fertilizer Producer</option>
              </select>
            </div>
            {formik.touched.role && formik.errors.role ? (
              <div className="text-error text-xs mt-1">
                {formik.errors.role}
              </div>
            ) : null}
          </div>
        </div>

        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl text-sm font-semibold text-on-primary bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {formik.isSubmitting ? "Creating Account..." : "Register"}
        </button>

        <div className="text-center mt-4">
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Already have an account? Sign in
          </button>
        </div>
      </form>
    </div>
  );
}
