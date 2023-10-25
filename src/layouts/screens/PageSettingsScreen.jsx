import PropTypes from "prop-types"

import { PageSettingsModal } from "components/PageSettingsModal"
import { ResourcePageSettingsModal } from "components/PageSettingsModal/ResourcePageSettingsModal"

import { useGetDirectoryHook } from "hooks/directoryHooks"
import {
  useCreatePageHook,
  useGetPageHook,
  useUpdatePageHook,
} from "hooks/pageHooks"
import { useGetSiteUrl } from "hooks/siteDashboardHooks"

export const PageSettingsScreen = ({ match, onClose }) => {
  const { params, decodedParams } = match
  const { siteName } = params

  const { fileName, resourceRoomName } = params
  const { data: pageData } = useGetPageHook(params, { enabled: !!fileName })
  const { mutateAsync: updateHandler } = useUpdatePageHook(params, {
    onSuccess: () => onClose(),
  })
  const { mutateAsync: createHandler } = useCreatePageHook(params)
  const { data: dirData } = useGetDirectoryHook(
    {
      ...params,
      isUnlinked: !params.collectionName && !params.resourceRoomName,
    },
    { initialData: [] }
  )
  const { data: siteUrl } = useGetSiteUrl(siteName)

  return resourceRoomName ? (
    <ResourcePageSettingsModal
      params={decodedParams}
      onClose={onClose}
      pageData={pageData}
      onProceed={fileName ? updateHandler : createHandler}
      pagesData={dirData ? dirData.filter((item) => item.type === "file") : []}
      siteUrl={siteUrl}
      showEditorToggle={!fileName}
    />
  ) : (
    <PageSettingsModal
      params={decodedParams}
      onClose={onClose}
      pageData={pageData}
      onProceed={fileName ? updateHandler : createHandler}
      pagesData={dirData ? dirData.filter((item) => item.type === "file") : []}
      siteUrl={siteUrl}
      showEditorToggle={!!fileName}
    />
  )
}

PageSettingsScreen.propTypes = {
  onClose: PropTypes.func.isRequired,
}
