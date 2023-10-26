import { useFeatureIsOn } from "@growthbook/growthbook-react"

import LegacyEditPage from "layouts/LegacyEditPage"

import { EditPage } from "./EditPage"

interface FeatureFlaggedEditPageProps {
  match: {
    params: Record<string, unknown>
    decodedParams: Record<string, unknown>
  }
}
export const FeatureFlaggedEditPage = ({
  match,
}: FeatureFlaggedEditPageProps) => {
  // NOTE: flag so that it shows up in the UI
  // only if `is-tiptap-enabled`
  const isNewEditorEnabled = useFeatureIsOn("is-tiptap-enabled")
  return isNewEditorEnabled ? <EditPage /> : <LegacyEditPage match={match} />
}
