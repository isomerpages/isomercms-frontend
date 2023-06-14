export interface DNSRecord {
  source: string
  type: string
  target: string
}

export type SiteLaunchFrontEndStatus =
  | "LAUNCHED"
  | "NOT_LAUNCHED"
  | "LAUNCHING"
  | "CHECKLIST_TASKS_PENDING" // not to be confused with with Infra level launching step
  | "LOADING"

export interface SiteLaunchStatusProps {
  siteLaunchStatus: SiteLaunchFrontEndStatus
  stepNumber: number
  dnsRecords?: DNSRecord[]
}

export interface SiteLaunchDto {
  /**
   * Transition will be
   * "NOT_LAUNCHED" -> User presses the Generate DNS button
   * -> "LAUNCHING" -> wait for 90 seconds -> "LAUNCHED"
   */
  siteStatus: "LAUNCHED" | "NOT_LAUNCHED" | "LAUNCHING"
  dnsRecords?: DNSRecord[] // only present iff siteStatus is LAUNCHED
}

export const SITE_LAUNCH_TASKS = {
  SET_DNS_TTL: 1,
  APPROVE_FIRST_REVIEW_REQUEST: 2,
  DROP_CLOUDFRONT: 3,
  DELETE_EXISTING_DNS_RECORDS: 4,
  WAIT_1_HOUR: 5,
  GENERATE_NEW_DNS_RECORDS: 6,
}

export const SITE_LAUNCH_TASKS_LENGTH = Object.keys(SITE_LAUNCH_TASKS).length

export const SITE_LAUNCH_PAGES = {
  DISCLAIMER: 1,
  INFO_GATHERING: 2,
  RISK_ACCEPTANCE: 3,
  CHECKLIST: 4,
}
