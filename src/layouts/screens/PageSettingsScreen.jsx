import React from "react"
import PropTypes from "prop-types"
import PageSettingsModalV2 from "../../components/PageSettingsModalV2"

import {
  useCreatePageHook,
  useGetPageHook,
  useUpdatePageHook,
} from "../../hooks/pageHooks"
import { useSiteUrlHook } from "../../hooks/settingsHooks"
import { useGetDirectoryHook } from "../../hooks/directoryHooks"

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
    <PageSettingsModalV2
      params={decodedParams}
      onClose={onClose}
      pageData={pageData}
      onProceed={fileName ? updateHandler : createHandler}
      dirData={dirData ? dirData.filter((page) => page.name !== fileName) : []}
      siteUrl={siteUrl}
    />
  )
}

PageSettingsScreen.propTypes = {
  onClose: PropTypes.func.isRequired,
}
