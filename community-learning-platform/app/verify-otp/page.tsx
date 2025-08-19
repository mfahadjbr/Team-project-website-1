"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Leaf, ArrowLeft, Mail, Clock, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

export default function VerifyOTPPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [timeLeft, setTimeLeft] = useState(180) // 3 minutes in seconds
  const [isLoading, setIsLoading] = useState(false)
  const [canResend, setCanResend] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || "user@example.com"

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCanResend(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const otpCode = otp.join("")
    if (otpCode.length !== 6) {
      alert("Please enter the complete OTP")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("http://localhost:5000/api/v1/auth/verify-otp", {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp: otpCode })
      })
      const data = await response.json().catch((e) => {
        console.log(e)
        return { status: false, message: "Verification failed. Please try again." }
      })

      if (!response.ok || !data?.status) {
        const errorMessage = data?.message || "Invalid or expired OTP"
        throw new Error(errorMessage)
      }

      setIsVerified(true)
      setTimeout(() => {
        router.push("/login")
      }, 1500)
    } catch (error: any) {
      alert(error?.message || "Verification failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOTP = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/v1/auth/resend-otp", {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email })
      })
      const data = await response.json().catch((e) => {
        console.log(e)
        return { status: false, message: "Failed to resend code." }
      })

      if (!response.ok || !data?.status) {
        const errorMessage = data?.message || "Failed to resend code."
        throw new Error(errorMessage)
      }

      setTimeLeft(180)
      setCanResend(false)
      setOtp(["", "", "", "", "", ""])
      inputRefs.current[0]?.focus()
      alert("A new verification code has been sent to your email.")
    } catch (error: any) {
      alert(error?.message || "Failed to resend code. Please try again.")
    }
  }

  if (isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <CheckCircle className="h-20 w-20 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-sans font-bold text-foreground mb-2">Verification Successful!</h1>
          <p className="text-muted-foreground mb-4">Your account has been verified successfully.</p>
          <p className="text-sm text-muted-foreground">Redirecting to dashboard...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          {/* Back to Home */}
          {/* <div className="absolute top-4 left-4">
              <Link
                href="/"
              className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </div> */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-3xl font-sans font-bold text-foreground mb-2">Verify Your Email</h1>
            <p className="text-muted-foreground">We've sent a verification code to your email</p>
          </motion.div>
        </div>

        {/* OTP Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="shadow-lg border-0 bg-card/50 backdrop-blur">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-2xl font-sans font-semibold text-center">Enter Verification Code</CardTitle>
              <CardDescription className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Mail className="h-4 w-4" />
                  <span className="font-medium">{email}</span>
                </div>
                Enter the 6-digit code sent to your email
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* OTP Input */}
                <div className="flex justify-center space-x-2">
                  {otp.map((digit, index) => (
                    <Input
                      key={index}
                      ref={(el) => {
                        if (el) {
                          inputRefs.current[index] = el
                        }
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-12 text-center text-lg font-semibold"
                      placeholder="0"
                    />
                  ))}
                </div>

                {/* Timer */}
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span
                      className={`font-mono text-lg ${timeLeft <= 30 ? "text-destructive" : "text-muted-foreground"}`}
                    >
                      {formatTime(timeLeft)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {timeLeft > 0 ? "Time remaining to enter code" : "Code expired"}
                  </p>
                </div>

                {/* Submit Button */}
                <Button type="submit" className="w-full" size="lg" disabled={isLoading || otp.join("").length !== 6}>
                  {isLoading ? "Verifying..." : "Verify Code"}
                </Button>

                {/* Resend Button */}
                <div className="text-center">
                  {canResend ? (
                    <Button type="button" variant="outline" onClick={handleResendOTP} className="w-full bg-transparent">
                      Resend OTP
                    </Button>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Didn't receive the code?{" "}
                      <span className="text-primary">Resend available in {formatTime(timeLeft)}</span>
                    </p>
                  )}
                </div>
              </form>

              <div className="mt-6 text-center">
                <p className="text-muted-foreground text-sm">
                  Wrong email?{" "}
                  <Link href="/signup" className="text-primary hover:underline font-medium">
                    Go back to signup
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Back to Home */}
        {/* <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div> */}
      </div>
    </div>
  )
}
