import cx from "classnames"
import React, { useContext, useState } from "react"
import elementStyles from "../styles/isomer-cms/Elements.module.scss"
import { getOtp, verifyOtp } from "../api"
import { LoginContext } from "../contexts/LoginContext"
import useRedirectHook from "../hooks/useRedirectHook"

const LoginStep = {
  GET_OTP: "GET_OTP",
  VERIFY_OTP: "VERIFY_OTP",
}

const VerifyEmailModal = () => {
  const {
    userId,
    email: userEmail,
    verifyLoginAndSetLocalStorage,
  } = useContext(LoginContext)
  const { setRedirectToLogout } = useRedirectHook()

  const [loginStep, setLoginStep] = useState(LoginStep.GET_OTP)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")

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
      await verifyOtp(email, otp)
      await verifyLoginAndSetLocalStorage()
      // Reset inputs
      setEmail("")
      setOtp("")
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
            <form onSubmit={handleVerifyOtp}>
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
      case LoginStep.GET_OTP:
      default:
        return (
          <>
            <form onSubmit={handleGetOtp}>
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
          <div>{renderLoginStep()}</div>
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
