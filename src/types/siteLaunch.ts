import _ from "lodash"

export interface DNSRecord {
  source: string
  type: string
  target: string
}

export const SiteLaunchFEStatus = {
  Launched: "LAUNCHED",
  NotLaunched: "NOT_LAUNCHED",
  Launching: "LAUNCHING",
  ChecklistTasksPending: "CHECKLIST_TASKS_PENDING", // not to be confused with with Infra level launching step
  Loading: "LOADING",
  Failed: "FAILED",
} as const

export type SiteLaunchFEStatusType = typeof SiteLaunchFEStatus[keyof typeof SiteLaunchFEStatus]

export const NEW_DOMAIN_SITE_LAUNCH_TASKS = {
  NOT_STARTED: 0,
  APPROVE_FIRST_REVIEW_REQUEST: 1,
  GENERATE_NEW_DNS_RECORDS: 2,
} as const

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

export const SITE_LAUNCH_PAGES = {
  DISCLAIMER: 1,
  INFO_GATHERING: 2,
  RISK_ACCEPTANCE: 3,
  CHECKLIST: 4,
  FINAL_STATE: 5,
} as const

export type SiteLaunchPageIndex = typeof SITE_LAUNCH_PAGES[keyof typeof SITE_LAUNCH_PAGES]

export interface SiteLaunchStatusProps {
  siteLaunchStatus: SiteLaunchFEStatusType
  stepNumber: SiteLaunchTaskTypeIndex
  dnsRecords?: DNSRecord[]
  siteUrl?: string
  isNewDomain?: boolean
  useWwwSubdomain?: boolean
}

export const SiteLaunchBEStatus = {
  NotLaunched: "NOT_LAUNCHED",
  Launching: "LAUNCHING",
  Launched: "LAUNCHED",
  Failed: "FAILED",
} as const
export interface SiteLaunchDto {
  /**
   * Transition will be
   * "NOT_LAUNCHED" -> User presses the Generate DNS button
   * -> "LAUNCHING" -> wait for 90 seconds -> "LAUNCHED"
   */
  siteLaunchStatus: typeof SiteLaunchBEStatus[keyof typeof SiteLaunchBEStatus]
  dnsRecords?: DNSRecord[] // only present iff siteStatus is LAUNCHED
  siteUrl?: string
}

export const SITE_LAUNCH_TASKS_LENGTH = (Object.keys(SITE_LAUNCH_TASKS).length -
  1) as SiteLaunchTaskTypeIndex // we minus one here since step 0 is not counted as a step done

export const NEW_DOMAIN_SITE_LAUNCH_TASKS_LENGTH = (Object.keys(
  NEW_DOMAIN_SITE_LAUNCH_TASKS
).length - 1) as SiteLaunchTaskTypeIndex

type OldDomainSiteLaunchTaskTitles = Exclude<
  keyof typeof SITE_LAUNCH_TASKS,
  // There are no title texts for these two domains
  "NOT_STARTED" | "GENERATE_NEW_DNS_RECORDS"
>

export const TITLE_TEXTS_OLD_DOMAIN: Record<
  OldDomainSiteLaunchTaskTitles,
  string
> = {
  SET_DNS_TTL:
    "Set your DNS Time To Live(TTL) to 5 mins at least 24 hours before launching",
  APPROVE_FIRST_REVIEW_REQUEST: "Approve and publish your first review request",
  DROP_CLOUDFRONT: "Drop existing domains on CloudFront",
  DELETE_EXISTING_DNS_RECORDS:
    "Delete existing DNS records from your nameserver",
  WAIT_1_HOUR: "Wait 1 hour to flush existing records",
} as const

type NewDomainSiteLaunchTaskTitles = Extract<
  OldDomainSiteLaunchTaskTitles,
  "APPROVE_FIRST_REVIEW_REQUEST"
>

export const TITLE_TEXTS_NEW_DOMAIN: Record<
  NewDomainSiteLaunchTaskTitles,
  string
> = _.pick(TITLE_TEXTS_OLD_DOMAIN, ["APPROVE_FIRST_REVIEW_REQUEST"])

export const getNewDomainTaskFrmIdx = (): NewDomainSiteLaunchTaskTitles => {
  // for now only one checklist task for new domain
  return "APPROVE_FIRST_REVIEW_REQUEST"
}

export const getOldDomainTaskFrmIdx = (
  task: number
): OldDomainSiteLaunchTaskTitles => {
  switch (task + 1) {
    case SITE_LAUNCH_TASKS.SET_DNS_TTL:
      return "SET_DNS_TTL"
    case SITE_LAUNCH_TASKS.APPROVE_FIRST_REVIEW_REQUEST:
      return "APPROVE_FIRST_REVIEW_REQUEST"
    case SITE_LAUNCH_TASKS.DROP_CLOUDFRONT:
      return "DROP_CLOUDFRONT"
    case SITE_LAUNCH_TASKS.DELETE_EXISTING_DNS_RECORDS:
      return "DELETE_EXISTING_DNS_RECORDS"
    case SITE_LAUNCH_TASKS.WAIT_1_HOUR:
      return "WAIT_1_HOUR"
    default:
      return "SET_DNS_TTL"
  }
}
