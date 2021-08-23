import cx from "classnames"
import React, { useContext, useState } from "react"
import elementStyles from "../styles/isomer-cms/Elements.module.scss"
import { getOtp, verifyOtp } from "../api"
import { LoginContext } from "../contexts/LoginContext"
import useRedirectHook from "../hooks/useRedirectHook"

const VerificationStep = {
  GET_EMAIL_OTP: "GET_EMAIL_OTP",
  VERIFY_EMAIL_OTP: "VERIFY_EMAIL_OTP",
}

const VerifyEmailModal = () => {
  const {
    userId,
    email: userEmail,
    verifyLoginAndSetLocalStorage,
  } = useContext(LoginContext)
  const { setRedirectToLogout } = useRedirectHook()

  const [verificationStep, setVerificationStep] = useState(
    VerificationStep.GET_EMAIL_OTP
  )
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")

  async function handleGetEmailOtp(e) {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    try {
      await getOtp(email)
      setVerificationStep(VerificationStep.VERIFY_EMAIL_OTP)
    } catch (err) {
      setError("Unable to request for an OTP")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleVerifyEmailOtp(e) {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    try {
      await verifyOtp(email, otp)
      await verifyLoginAndSetLocalStorage()
      // Reset inputs
      setEmail("")
      setOtp("")
    } catch (err) {
      setError("Invalid OTP. Failed to verify OTP.")
    } finally {
      setIsLoading(false)
    }
  }
  function renderVerificationStep() {
    switch (verificationStep) {
      case VerificationStep.VERIFY_EMAIL_OTP:
        return (
          <>
            <form onSubmit={handleVerifyEmailOtp}>
              <div className={elementStyles.formInputWithButton}>
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
              </div>
            </form>
            <div className={elementStyles.error}>{error}</div>
          </>
        )
      case VerificationStep.GET_EMAIL_OTP:
      default:
        return (
          <>
            <form onSubmit={handleGetEmailOtp}>
              <div className={elementStyles.formInputWithButton}>
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
                  {isLoading ? "Sending..." : "Get OTP"}
                </button>
              </div>
            </form>
            <div className={elementStyles.error}>{error}</div>
          </>
        )
    }
  }
  return userId && !userEmail ? (
    <div className={elementStyles.overlay}>
      <div className={elementStyles["modal-verify-email"]}>
        <div className={elementStyles.modalHeader}>
          <h1>Verify your email</h1>
        </div>
        <div className={elementStyles.modalContent}>
          <div>
            In order to improve security, a verified email is now required for
            all users of Isomer CMS. Only .gov.sg or whitelisted email addresses
            will be accepted.
          </div>
          <div>{renderVerificationStep()}</div>
        </div>
        <div className={elementStyles.footer}>
          <button onClick={setRedirectToLogout} type="button">
            Logout
          </button>
        </div>
      </div>
    </div>
  ) : null
}

export default VerifyEmailModal
