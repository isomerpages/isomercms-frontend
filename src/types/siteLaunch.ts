export interface DNSRecord {
  source: string
  type: string
  target: string
}

const SiteLaunchFrontEndStatusOptions = {
  Launched: "LAUNCHED",
  NotLaunched: "NOT_LAUNCHED",
  Launching: "LAUNCHING",
  ChecklistTasksPending: "CHECKLIST_TASKS_PENDING", // not to be confused with with Infra level launching step
  Loading: "LOADING",
} as const

export type SiteLaunchFrontEndStatus = typeof SiteLaunchFrontEndStatusOptions[keyof typeof SiteLaunchFrontEndStatusOptions]

export interface SiteLaunchStatusProps {
  siteLaunchStatus: SiteLaunchFrontEndStatus
  stepNumber: SiteLaunchTaskTypeIndex
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
  NOT_STARTED: 0,
  SET_DNS_TTL: 1,
  APPROVE_FIRST_REVIEW_REQUEST: 2,
  DROP_CLOUDFRONT: 3,
  DELETE_EXISTING_DNS_RECORDS: 4,
  WAIT_1_HOUR: 5,
  GENERATE_NEW_DNS_RECORDS: 6,
} as const

export type SiteLaunchTaskTypeIndex = typeof SITE_LAUNCH_TASKS[keyof typeof SITE_LAUNCH_TASKS]

export const SITE_LAUNCH_TASKS_LENGTH = (Object.keys(SITE_LAUNCH_TASKS).length -
  1) as SiteLaunchTaskTypeIndex // we minus one here since step 0 is not counted as a step done

export const SITE_LAUNCH_PAGES = {
  DISCLAIMER: 1,
  INFO_GATHERING: 2,
  RISK_ACCEPTANCE: 3,
  CHECKLIST: 4,
}
