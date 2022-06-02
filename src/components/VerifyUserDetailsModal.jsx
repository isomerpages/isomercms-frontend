import { Link } from "@chakra-ui/react"
import { Button } from "@opengovsg/design-system-react"
import { useContext, useEffect, useState } from "react"

import {
  getEmailOtp,
  verifyEmailOtp,
  getMobileNumberOtp,
  verifyMobileNumberOtp,
} from "../api"
import { LoginContext } from "../contexts/LoginContext"
import useRedirectHook from "../hooks/useRedirectHook"
import elementStyles from "../styles/isomer-cms/Elements.module.scss"

import InputWithButton from "./InputWithButton"

const VerificationStep = {
  GET_EMAIL_OTP: "GET_EMAIL_OTP",
  VERIFY_EMAIL_OTP: "VERIFY_EMAIL_OTP",
  GET_MOBILE_NUMBER_OTP: "GET_MOBILE_NUMBER_OTP",
  VERIFY_MOBILE_NUMBER_OTP: "VERIFY_MOBILE_NUMBER_OTP",
}

const VerifyUserDetailsModal = () => {
  const {
    userId,
    email: loggedInEmail,
    contactNumber: loggedInContactNumber,
    verifyLoginAndSetLocalStorage,
  } = useContext(LoginContext)
  const { setRedirectToLogout } = useRedirectHook()

  const [verificationStep, setVerificationStep] = useState(
    VerificationStep.GET_EMAIL_OTP
  )
  useEffect(() => {
    if (!loggedInEmail) setVerificationStep(VerificationStep.GET_EMAIL_OTP)
    if (loggedInEmail && !loggedInContactNumber)
      setVerificationStep(VerificationStep.GET_MOBILE_NUMBER_OTP)
  }, [loggedInEmail, loggedInContactNumber])

  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const [email, setEmail] = useState("")
  const [mobileNumber, setMobileNumber] = useState("")
  const [otp, setOtp] = useState("")

  async function handleGetEmailOtp(e) {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    try {
      await getEmailOtp(email)
      setVerificationStep(VerificationStep.VERIFY_EMAIL_OTP)
    } catch (err) {
      setError(
        err.response?.data?.error?.message || "Unable to request for an OTP"
      )
    } finally {
      setIsLoading(false)
    }
  }

  async function handleVerifyEmailOtp(e) {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    try {
      await verifyEmailOtp(email, otp)
      // Reset inputs
      setEmail("")
      setOtp("")

      setVerificationStep(VerificationStep.GET_MOBILE_NUMBER_OTP)
    } catch (err) {
      setError("Invalid OTP. Failed to verify OTP.")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleGetMobileNumberOtp(e) {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    try {
      await getMobileNumberOtp(mobileNumber)
      setVerificationStep(VerificationStep.VERIFY_MOBILE_NUMBER_OTP)
    } catch (err) {
      setError("Unable to request for an OTP")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleVerifyMobileNumberOtp(e) {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    try {
      await verifyMobileNumberOtp(mobileNumber, otp)
      // Reset inputs
      setMobileNumber("")
      setOtp("")

      await verifyLoginAndSetLocalStorage()
    } catch (err) {
      setError("Invalid OTP. Failed to verify OTP.")
    } finally {
      setIsLoading(false)
    }
  }

  function isEmailStep() {
    return (
      verificationStep === VerificationStep.GET_EMAIL_OTP ||
      verificationStep === VerificationStep.VERIFY_EMAIL_OTP
    )
  }

  function renderVerificationStep() {
    switch (verificationStep) {
      case VerificationStep.VERIFY_MOBILE_NUMBER_OTP:
        return (
          <>
            <div>Please enter the OTP sent to {mobileNumber}.</div>
            <form onSubmit={handleVerifyMobileNumberOtp}>
              <InputWithButton
                type="text"
                placeholder="e.g. 123456"
                value={otp}
                onChange={({ target: { value } }) => setOtp(value)}
                isDisabled={!otp}
                isLoading={isLoading}
                buttonText="Submit"
                loadingText="Verifying..."
              />
            </form>
            <div className={elementStyles.error}>{error}</div>
          </>
        )
      case VerificationStep.GET_MOBILE_NUMBER_OTP:
        return (
          <>
            <div>
              In the event that there is an issue with your Isomer site, please
              provide your mobile phone number for us to contact you with.
            </div>
            <form onSubmit={handleGetMobileNumberOtp}>
              <InputWithButton
                type="text"
                placeholder="e.g. 91234567"
                value={mobileNumber}
                onChange={({ target: { value } }) => setMobileNumber(value)}
                isDisabled={!mobileNumber}
                isLoading={isLoading}
                buttonText="Get OTP"
                loadingText="Sending..."
              />
            </form>
            <div className={elementStyles.error}>{error}</div>
          </>
        )
      case VerificationStep.VERIFY_EMAIL_OTP:
        return (
          <>
            <div>Please enter the OTP sent to {email}.</div>
            <form onSubmit={handleVerifyEmailOtp}>
              <InputWithButton
                type="text"
                placeholder="e.g. 123456"
                value={otp}
                onChange={({ target: { value } }) => setOtp(value)}
                isDisabled={!otp}
                isLoading={isLoading}
                buttonText="Submit"
                loadingText="Verifying..."
              />
            </form>
            <div className={elementStyles.error}>{error}</div>
          </>
        )
      case VerificationStep.GET_EMAIL_OTP:
      default:
        return (
          <>
            <div>
              In order to improve security, a verified email is now required for
              all users of Isomer CMS. Only <b>.gov.sg</b> or{" "}
              <b>whitelisted email addresses</b> will be accepted. You must
              verify your email before proceeding.{" "}
              <Link isExternal href="https://go.gov.sg/isomer-identity">
                Read more.
              </Link>
            </div>
            <form onSubmit={handleGetEmailOtp}>
              <InputWithButton
                type="email"
                placeholder="e.g. jane@open.gov.sg"
                value={email}
                onChange={({ target: { value } }) => setEmail(value)}
                isDisabled={!email}
                isLoading={isLoading}
                buttonText="Get OTP"
                loadingText="Sending..."
              />
            </form>
            <div className={elementStyles.error}>{error}</div>
          </>
        )
    }
  }

  return userId && (!loggedInEmail || !loggedInContactNumber) ? (
    <div className={elementStyles.overlay}>
      <div className={elementStyles["modal-verify-user-details"]}>
        <div className={elementStyles.modalHeader}>
          <h1>Verify your {isEmailStep() ? "email" : "mobile number"}</h1>
        </div>
        <div className={elementStyles.modalContent}>
          {renderVerificationStep()}
        </div>
        <div className={elementStyles.footer}>
          <Button onClick={setRedirectToLogout} variant="outline">
            Logout
          </Button>
        </div>
      </div>
    </div>
  ) : null
}

export default VerifyUserDetailsModal
