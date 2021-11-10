import PropTypes from "prop-types"
import React from "react"

import { PageSettingsModal } from "components/PageSettingsModal"

import { useGetDirectoryHook } from "hooks/directoryHooks"
import {
  useCreatePageHook,
  useGetPageHook,
  useUpdatePageHook,
} from "hooks/pageHooks"
import { useSiteUrlHook } from "hooks/settingsHooks"

export const PageSettingsScreen = ({ match, onClose }) => {
  const { params, decodedParams } = match

  const { fileName } = params
  const { data: pageData } = useGetPageHook(params, { enabled: !!fileName })
  const { mutateAsync: updateHandler } = useUpdatePageHook(params, {
    onSuccess: () => onClose(),
  })
  const { mutateAsync: createHandler } = useCreatePageHook(params)
  const { data: dirData } = useGetDirectoryHook(
    { ...params, isUnlinked: !params.collectionName },
    { initialData: [] }
  )
  const { data: siteUrl } = useSiteUrlHook(params)

  return (
    <PageSettingsModal
      params={decodedParams}
      onClose={onClose}
      pageData={pageData}
      onProceed={fileName ? updateHandler : createHandler}
      pagesData={dirData ? dirData.filter((item) => item.type === "file") : []}
      siteUrl={siteUrl}
    />
  )
}

PageSettingsScreen.propTypes = {
  onClose: PropTypes.func.isRequired,
}
