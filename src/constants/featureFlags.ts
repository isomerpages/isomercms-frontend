export const FEATURE_FLAGS = {
  REPO_PRIVATISATION: "repo_privatisation",
  BANNER: "banner",
  NPS_FORM: "nps_form",
  HOMEPAGE_ENABLED_BLOCKS: "homepage_enabled_blocks",
  RTE_ENABLED_BLOCKS: "rte_enabled_blocks",
  TIPTAP_EDITOR: "is-tiptap-enabled",
  IS_SHOW_STAGING_BUILD_STATUS_ENABLED: "is_show_staging_build_status_enabled",
  IS_BROKEN_LINKS_REPORT_ENABLED: "is_broken_links_report_enabled",
} as const

export type FeatureFlagsType = typeof FEATURE_FLAGS[keyof typeof FEATURE_FLAGS]
// NOTE: Only have 4 default blocks:
// hero/infobar/infopic/resources
export const NUM_DEFAULT_HOMEPAGE_BLOCKS = 4
