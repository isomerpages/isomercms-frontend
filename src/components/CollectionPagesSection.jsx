import React, { useState } from 'react';
import axios from 'axios';
import { useQuery, useMutation } from 'react-query';
import PropTypes from 'prop-types';
import _ from 'lodash';

import {
    PAGE_CONTENT_KEY,
    FOLDERS_CONTENT_KEY,
    DIR_CONTENT_KEY,
} from '../constants'

import { getEditPageData, deletePageData, getAllCategories, moveFile, getDirectoryFile } from '../api'

import { DEFAULT_RETRY_MSG, parseDirectoryFile, convertFolderOrderToArray } from '../utils'

// Import components
import OverviewCard from '../components/OverviewCard';
import ComponentSettingsModal from './ComponentSettingsModal'
import PageSettingsModal from './PageSettingsModal'
import { errorToast, successToast } from '../utils/toasts';
import DeleteWarningModal from '../components/DeleteWarningModal'
import GenericWarningModal from '../components/GenericWarningModal'

// Import styles
import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import contentStyles from '../styles/isomer-cms/pages/Content.module.scss';


// axios settings
axios.defaults.withCredentials = true

// Clean up note: Should be renamed, only used for resource pages and unlinked pages sections
const CollectionPagesSection = ({ collectionName, pages, siteName, isResource }) => {
    const [isComponentSettingsActive, setIsComponentSettingsActive] = useState(false)
    const [selectedFile, setSelectedFile] = useState('')
    const [selectedPath, setSelectedPath] = useState('')
    const [createNewPage, setCreateNewPage] = useState(false)
    const [canShowDeleteWarningModal, setCanShowDeleteWarningModal] = useState(false)
    const [canShowMoveModal, setCanShowMoveModal] = useState(false)
    const [queryFolderName, setQueryFolderName] = useState('')

    const { data: pageData } = useQuery(
        [PAGE_CONTENT_KEY, { siteName, fileName: selectedFile, resourceName: collectionName }],
        () => getEditPageData({ siteName, fileName: selectedFile, resourceName: collectionName }),
        {
          enabled: selectedFile.length > 0,
          retry: false,
          onError: () => {
            setSelectedFile('')
            errorToast(`The page data could not be retrieved. ${DEFAULT_RETRY_MSG}`)
          },
        },
    )

    // MOVE-TO Dropdown
    // get all folders for move-to dropdown
    const { data: allCategories } = useQuery(
        [FOLDERS_CONTENT_KEY, { siteName, isResource }],
        async () => getAllCategories({ siteName, isResource }),
        {
            enabled: selectedFile.length > 0,
            onError: () => errorToast(`The folders data could not be retrieved. ${DEFAULT_RETRY_MSG}`),
        },
    )

    // MOVE-TO Dropdown
    // get subfolders of selected folder for move-to dropdown
    const { data: querySubfolders } = useQuery(
        [DIR_CONTENT_KEY, siteName, queryFolderName],
        async () => getDirectoryFile(siteName, queryFolderName),
        {   
            enabled: selectedFile.length > 0 && queryFolderName.length > 0,
            onError: () => errorToast(`The folders data could not be retrieved. ${DEFAULT_RETRY_MSG}`),
        },
    )

    // MOVE-TO Dropdown utils
    // parse responses from move-to queries
    const getCategories = (queryFolderName, allCategories, querySubfolders) => {
        if (isResource && allCategories) {
            return allCategories.resources.map(resource => resource.dirName).filter(dirName => dirName !== collectionName)
        }
        if (queryFolderName && querySubfolders) {
            const parsedFolderContents = parseDirectoryFile(querySubfolders.data.content)
            const parsedFolderArray = convertFolderOrderToArray(parsedFolderContents)
            return parsedFolderArray.filter(file => file.type === 'dir').map(file => file.name)
        }
        if (!queryFolderName && allCategories) {
            return allCategories.collections
        }
        return null
    }

    const { mutateAsync: deleteHandler } = useMutation(
        async () => deletePageData({ siteName, fileName: selectedFile, resourceName: collectionName }, pageData.pageSha),
        {
          onError: () => errorToast(`Your file could not be deleted successfully. ${DEFAULT_RETRY_MSG}`),
          onSuccess: () => {successToast('Successfully deleted file'); window.location.reload();},
          onSettled: () => setCanShowDeleteWarningModal((prevState) => !prevState),
        }
    )

    const { mutateAsync: moveHandler } = useMutation(
        () => moveFile({siteName, selectedFile, newPath: selectedPath, resourceName: collectionName}),
        {
          onError: () => errorToast(`Your file could not be moved successfully. ${DEFAULT_RETRY_MSG}`),
          onSuccess: () => {successToast('Successfully moved file'); window.location.reload();},
          onSettled: () => setCanShowMoveModal(prevState => !prevState),
        }
    )

    return (
        <>
            {
                isComponentSettingsActive 
                && ( isResource 
                    ? <ComponentSettingsModal
                        category={collectionName}
                        siteName={siteName}
                        fileName={selectedFile || ''}
                        isNewFile={!selectedFile}
                        pageData={pageData}
                        pageFileNames={pages?.map(page => page.name) || []}
                        setSelectedFile={setSelectedFile}
                        setIsComponentSettingsActive={setIsComponentSettingsActive}
                    /> 
                    : (pageData || createNewPage) 
                    && <PageSettingsModal
                        pagesData={pages}
                        pageData={pageData}
                        siteName={siteName}
                        originalPageName={selectedFile || ''}
                        isNewPage={!selectedFile}
                        setSelectedPage={setSelectedFile}
                        setIsPageSettingsActive={setIsComponentSettingsActive}
                    />
                )
            }
            {
                canShowDeleteWarningModal
                && (
                <DeleteWarningModal
                    onCancel={() => setCanShowDeleteWarningModal(false)}
                    onDelete={deleteHandler}
                    type={"page"}
                />
                )
            } 
            {
                canShowMoveModal
                && (
                    <GenericWarningModal
                        displayTitle="Warning"
                        displayText="Moving a page to a different collection might lead to user confusion. You may wish to change the permalink for this page afterwards."
                        onProceed={moveHandler}
                        onCancel={() => {
                            setCanShowMoveModal(false)
                        }}
                        proceedText="Continue"
                        cancelText="Cancel"
                    />
                )
            }
            <div className={contentStyles.contentContainerBoxes}>
                {
                    <div className={contentStyles.boxesContainer}>
                        <button
                            type="button"
                            id="settings-NEW"
                            onClick={() => {
                                setIsComponentSettingsActive(true)
                                setSelectedFile('')
                                setCreateNewPage(true)
                            }}
                            className={`${elementStyles.card} ${contentStyles.card} ${elementStyles.addNew}`}
                        >
                            <i id="settingsIcon-NEW" className={`bx bx-plus-circle ${elementStyles.bxPlusCircle}`} />
                            <h2 id="settingsText-NEW">Create new page</h2>
                        </button>
                        { pages ?
                            pages.map((page, pageIdx) => (
                                <OverviewCard
                                    key={page.fileName}
                                    itemIndex={pageIdx}
                                    category={collectionName}
                                    siteName={siteName}
                                    fileName={page.fileName || page.name} // temporary fix
                                    resourceType={isResource ? page.type : ''}
                                    date={page.date}
                                    isResource={isResource}
                                    allCategories={getCategories(queryFolderName, allCategories, querySubfolders)}
                                    setIsComponentSettingsActive={setIsComponentSettingsActive}
                                    setSelectedFile={setSelectedFile}
                                    setCanShowDeleteWarningModal={setCanShowDeleteWarningModal}
                                    setCanShowMoveModal={setCanShowMoveModal}
                                    setSelectedPath={setSelectedPath}
                                    queryFolderName={queryFolderName}
                                    setQueryFolderName={setQueryFolderName}
                                />
                            ))
                            /* Display loader if pages have not been retrieved from API call */
                            : 'Loading Pages...'  
                        }
                    </div>
                }
            </div>
        </>
    )
}

export default CollectionPagesSection

CollectionPagesSection.propTypes = {
    pages: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            path: PropTypes.string.isRequired,
            sha: PropTypes.string.isRequired,
        }),
    ),
    siteName: PropTypes.string.isRequired,
};
