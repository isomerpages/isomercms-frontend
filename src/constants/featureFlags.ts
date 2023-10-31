export const FEATURE_FLAGS = {
  REPO_PRIVATISATION: "repo_privatisation",
  BANNER: "banner",
  NPS_FORM: "nps_form",
  HOMEPAGE_ENABLED_BLOCKS: "homepage_enabled_blocks",
} as const

// NOTE: Only have 4 default blocks:
// hero/infobar/infopic/resources
export const NUM_DEFAULT_HOMEPAGE_BLOCKS = 4
