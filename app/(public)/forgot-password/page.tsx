"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Mail, Lock, KeyRound, CheckCircle2, ArrowRight, ArrowLeft, RefreshCw, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/context/AuthContext";

type Step = "email" | "verify" | "reset" | "complete";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { resetPassword } = useAuth();

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1: Send reset code to email
  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !email.includes("@")) {
      setError("Please provide a valid email address.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep("verify");
      toast({
        title: "Reset Code Sent",
        message: `A 6-digit verification code has been dispatched to ${email}.`,
        type: "success",
      });
    }, 600);
  };

  // Step 2: Verify code
  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (code.trim().length < 6) {
      setError("Please enter the 6-digit verification code.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep("reset");
      toast({
        title: "Code Verified",
        message: "Your identity has been confirmed. You may now set a new password.",
        type: "success",
      });
    }, 600);
  };

  // Step 3: Set new password
  const handleSetNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 8) {
      setError("New password must contain at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await resetPassword(email, newPassword);
      if (!res.success) {
        // Even if user not found in mock store, succeed for simulated frontend UX
        console.warn(res.error);
      }

      setIsSubmitting(false);
      setStep("complete");
      toast({
        title: "Password Reset Completed",
        message: "Your password has been updated securely.",
        type: "success",
      });
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
      setStep("complete");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block group">
            <span className="font-editorial text-3xl font-normal tracking-[0.2em] text-[#1C1C1C] group-hover:text-[#8B3A4A] transition-colors">
              FASHIONHUB
            </span>
          </Link>
          <p className="text-xs text-[#737373] tracking-wider uppercase font-light">
            Account Security & Recovery
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 text-xs">
          {(["email", "verify", "reset", "complete"] as Step[]).map((s, idx) => (
            <div key={s} className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-mono font-medium ${
                  step === s
                    ? "bg-[#1C1C1C] text-white"
                    : idx < ["email", "verify", "reset", "complete"].indexOf(step)
                    ? "bg-[#8B3A4A] text-white"
                    : "bg-[#E5E1DC] text-[#737373]"
                }`}
              >
                {idx + 1}
              </span>
              {idx < 3 && <span className="w-4 h-0.5 bg-[#E5E1DC]" />}
            </div>
          ))}
        </div>

        {/* Step 1: Request Email */}
        {step === "email" && (
          <Card className="border-[#E5E1DC] shadow-sm">
            <form onSubmit={handleSendCode}>
              <CardHeader className="space-y-1">
                <CardTitle className="font-editorial text-2xl font-normal text-[#1C1C1C]">
                  Forgot Your Password?
                </CardTitle>
                <CardDescription className="text-xs text-[#737373]">
                  Enter your registered email address and we will send a 6-digit verification code.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {error && (
                  <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                    {error}
                  </div>
                )}

                <Input
                  label="Registered Email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. elena.rostova@example.com"
                  leftIcon={<Mail className="w-4 h-4 text-[#737373]" />}
                />
              </CardContent>

              <CardFooter className="flex flex-col gap-3 pt-2">
                <Button
                  type="submit"
                  variant="default"
                  size="lg"
                  className="w-full gap-2"
                  disabled={isSubmitting}
                >
                  <span>{isSubmitting ? "Dispatching Code..." : "Send Verification Code"}</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>

                <Link
                  href="/login"
                  className="text-xs text-[#737373] hover:text-[#1C1C1C] inline-flex items-center gap-1.5 justify-center transition-colors pt-2"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </Link>
              </CardFooter>
            </form>
          </Card>
        )}

        {/* Step 2: Verification Code */}
        {step === "verify" && (
          <Card className="border-[#E5E1DC] shadow-sm">
            <form onSubmit={handleVerifyCode}>
              <CardHeader className="space-y-1">
                <CardTitle className="font-editorial text-2xl font-normal text-[#1C1C1C]">
                  Enter Verification Code
                </CardTitle>
                <CardDescription className="text-xs text-[#737373]">
                  We sent a 6-digit code to <strong className="text-[#1C1C1C]">{email}</strong>.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {error && (
                  <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                    {error}
                  </div>
                )}

                <Input
                  label="6-Digit Code"
                  type="text"
                  required
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="123456"
                  className="font-mono text-center tracking-[0.5em] text-lg font-semibold"
                  leftIcon={<KeyRound className="w-4 h-4 text-[#737373]" />}
                />

                {/* Quick prefill helper */}
                <div className="flex items-center justify-between text-xs text-[#737373] pt-1">
                  <button
                    type="button"
                    onClick={() => setCode("123456")}
                    className="text-[#8B3A4A] hover:underline"
                  >
                    Quick-fill Demo Code (123456)
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      toast({
                        title: "Code Re-sent",
                        message: "A fresh verification code has been dispatched.",
                        type: "info",
                      });
                    }}
                    className="hover:text-[#1C1C1C] inline-flex items-center gap-1 transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Resend Code</span>
                  </button>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col gap-3 pt-2">
                <Button
                  type="submit"
                  variant="default"
                  size="lg"
                  className="w-full gap-2"
                  disabled={isSubmitting}
                >
                  <span>{isSubmitting ? "Verifying..." : "Verify & Continue"}</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>

                <button
                  type="button"
                  onClick={() => setStep("email")}
                  className="text-xs text-[#737373] hover:text-[#1C1C1C] inline-flex items-center gap-1.5 justify-center transition-colors pt-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Change Email Address</span>
                </button>
              </CardFooter>
            </form>
          </Card>
        )}

        {/* Step 3: New Password */}
        {step === "reset" && (
          <Card className="border-[#E5E1DC] shadow-sm">
            <form onSubmit={handleSetNewPassword}>
              <CardHeader className="space-y-1">
                <CardTitle className="font-editorial text-2xl font-normal text-[#1C1C1C]">
                  Create New Password
                </CardTitle>
                <CardDescription className="text-xs text-[#737373]">
                  Your new password must be at least 8 characters long.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {error && (
                  <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                    {error}
                  </div>
                )}

                <div className="relative">
                  <Input
                    label="New Password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 8 characters"
                    leftIcon={<Lock className="w-4 h-4 text-[#737373]" />}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-[34px] text-[#737373] hover:text-[#242424] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <Input
                  label="Confirm New Password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type new password"
                  leftIcon={<Lock className="w-4 h-4 text-[#737373]" />}
                />
              </CardContent>

              <CardFooter className="flex flex-col gap-3 pt-2">
                <Button
                  type="submit"
                  variant="default"
                  size="lg"
                  className="w-full gap-2"
                  disabled={isSubmitting}
                >
                  <span>{isSubmitting ? "Updating Password..." : "Update Password"}</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </CardFooter>
            </form>
          </Card>
        )}

        {/* Step 4: Confirmation */}
        {step === "complete" && (
          <Card className="border-[#E5E1DC] shadow-sm text-center p-6">
            <CardContent className="pt-6 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 stroke-[1.75]" />
              </div>

              <div className="space-y-1.5">
                <h2 className="font-editorial text-2xl text-[#1C1C1C]">
                  Password Successfully Reset
                </h2>
                <p className="text-xs text-[#737373] max-w-xs mx-auto leading-relaxed">
                  Your credentials have been securely updated. You can now sign in with your new password.
                </p>
              </div>

              <div className="pt-4">
                <Button
                  type="button"
                  variant="default"
                  size="lg"
                  className="w-full gap-2"
                  onClick={() => router.push("/login")}
                >
                  <span>Proceed to Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
