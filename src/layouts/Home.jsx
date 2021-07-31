import cx from "classnames"
import React, { useState } from "react"
import elementStyles from "../styles/isomer-cms/Elements.module.scss"
import { getOtp, verifyOtp } from "../api"

const LoginStep = {
  GET_OTP: "GET_OTP",
  VERIFY_OTP: "VERIFY_OTP",
  OTP_VERIFIED: "OTP_VERIFIED",
}

export default function Home() {
  const [loginStep, setLoginStep] = useState(LoginStep.GET_OTP)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [redirectUrl, setRedirectUrl] = useState("")

  async function handleGetOtp(e) {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    try {
      await getOtp(email)
      setLoginStep(LoginStep.VERIFY_OTP)
    } catch (err) {
      setError("Unable to request for an OTP")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleVerifyOtp(e) {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    try {
      const { githubAuthUrl } = await verifyOtp(email, otp)
      setRedirectUrl(githubAuthUrl)

      // Reset inputs
      setEmail("")
      setOtp("")
      setLoginStep(LoginStep.OTP_VERIFIED)

      setTimeout(() => {
        window.location.href = githubAuthUrl
      }, 3000)
    } catch (err) {
      setError("Unable to login. Failed to verify OTP.")
    } finally {
      setIsLoading(false)
    }
  }

  function renderLoginStep() {
    switch (loginStep) {
      case LoginStep.VERIFY_OTP:
        return (
          <>
            <p>One-time password</p>
            <form className={elementStyles.controls} onSubmit={handleVerifyOtp}>
              <input
                type="text"
                placeholder="e.g. 123456"
                value={otp}
                onChange={({ target: { value } }) => setOtp(value)}
              />
              <button
                type="submit"
                className={cx(elementStyles.green, {
                  [elementStyles.disabled]: !otp,
                })}
                disabled={!otp}
              >
                {isLoading ? "Verifying..." : "Submit"}
              </button>
            </form>
            <div className={elementStyles.error}>{error}</div>
          </>
        )
      case LoginStep.OTP_VERIFIED:
        return (
          <div className={elementStyles.verified}>
            <div className={elementStyles.spinner}>
              <div
                className={cx("spinner-border", "text-primary")}
                role="status"
              />
            </div>
            <div>
              <p>OTP verified. Redirecting to GitHub for authentication...</p>
              <div className={elementStyles.redirectMsg}>
                If your browser does not redirect you automatically, click{" "}
                <a href={redirectUrl}>here</a>.
              </div>
            </div>
          </div>
        )
      case LoginStep.GET_OTP:
      default:
        return (
          <>
            <p>Sign in with your .gov.sg email</p>
            <form className={elementStyles.controls} onSubmit={handleGetOtp}>
              <input
                type="email"
                placeholder="e.g. jane@open.gov.sg"
                value={email}
                onChange={({ target: { value } }) => setEmail(value)}
              />
              <button
                type="submit"
                className={cx(elementStyles.green, {
                  [elementStyles.disabled]: !email,
                })}
                disabled={!email}
              >
                {isLoading ? "Sending..." : "Sign in"}
              </button>
            </form>
            <div className={elementStyles.error}>{error}</div>
          </>
        )
    }
  }

  return (
    <div className={elementStyles.loginDiv}>
      <div>
        <img
          className={elementStyles.loginImage}
          src={`${process.env.PUBLIC_URL}/img/logo.svg`}
          alt="Isomer CMS logo"
        />
        <div className={elementStyles.otpDiv}>{renderLoginStep()}</div>
      </div>
    </div>
  )
}
