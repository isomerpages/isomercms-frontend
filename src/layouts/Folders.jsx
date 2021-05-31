import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery, useMutation } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Link } from 'react-router-dom';
import _ from 'lodash';

// Import components
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import FolderCreationModal from '../components/FolderCreationModal'
import FolderOptionButton from '../components/folders/FolderOptionButton';
import FolderReorderingModal from '../components/FolderReorderingModal';
import { FolderContent } from '../components/folders/FolderContent';
import FolderModal from '../components/FolderModal';
import PageSettingsModal from '../components/PageSettingsModal'
import DeleteWarningModal from '../components/DeleteWarningModal'
import GenericWarningModal from '../components/GenericWarningModal'

import { errorToast, successToast } from '../utils/toasts';

import useRedirectHook from '../hooks/useRedirectHook';
import {
  PAGE_CONTENT_KEY,
  FOLDERS_CONTENT_KEY,
  DIR_CONTENT_KEY,
} from '../constants'
import {
  DEFAULT_RETRY_MSG,
  parseDirectoryFile,
  convertFolderOrderToArray,
  retrieveSubfolderContents,
  deslugifyDirectory,
} from '../utils'

// Import API
import { getDirectoryFile, getEditPageData, deleteSubfolder, deletePageData, moveFile, getAllCategories } from '../api';

// Import styles
import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import contentStyles from '../styles/isomer-cms/pages/Content.module.scss';

const Folders = ({ match, location }) => {
    const { siteName, folderName, subfolderName } = match.params;

    // set Move-To dropdown to start from current location of file
    const initialMoveDropdownQueryState = `${folderName}${subfolderName ? `/${subfolderName}` : ''}`

    const { setRedirectToPage } = useRedirectHook()

    const [isRearrangeActive, setIsRearrangeActive] = useState(false)
    const [isPageSettingsActive, setIsPageSettingsActive] = useState(false)
    const [directoryFileSha, setDirectoryFileSha] = useState('')
    const [folderOrderArray, setFolderOrderArray] = useState([])
    const [parsedFolderContents, setParsedFolderContents] = useState([])
    const [isFolderLive, setIsFolderLive] = useState(true)
    const [isFolderCreationActive, setIsFolderCreationActive] = useState(false)
    const [isDeleteModalActive, setIsDeleteModalActive] = useState(false)
    const [isMoveModalActive, setIsMoveModalActive] = useState(false)
    const [isFolderModalOpen, setIsFolderModalOpen] = useState(false)
    const [selectedPage, setSelectedPage] = useState('')
    const [selectedPath, setSelectedPath] = useState('')
    const [isSelectedItemPage, setIsSelectedItemPage] = useState(false)
    const [moveDropdownQuery, setMoveDropdownQuery] = useState('')

    const { data: folderContents, error: queryError, isLoading: isLoadingDirectory, refetch: refetchFolderContents } = useQuery(
      [DIR_CONTENT_KEY, siteName, folderName, subfolderName],
      () => getDirectoryFile(siteName, folderName),
      { 
        retry: false,
        enabled: !isRearrangeActive,
        onError: (err) => {
          if (err.response && err.response.status === 404) {
            setRedirectToPage(`/sites/${siteName}/workspace`)
          } else {
            errorToast()
          }
        },
      },
    )

    // re-initialize query whenever we navigate between folders and subfolder pages
    useEffect(() => {
      setMoveDropdownQuery(initialMoveDropdownQueryState)
    }, [folderName, subfolderName])

    // parse contents of current folder directory
    useEffect(() => {
      if (folderContents && folderContents.sha) {
        const { order: directoryFileOrder, output: directoryFileOutput } = parseDirectoryFile(folderContents.content)
        setDirectoryFileSha(folderContents.sha)
        setParsedFolderContents(directoryFileOrder)
        setIsFolderLive(directoryFileOutput)

        if (subfolderName) {
          const subfolderFiles = retrieveSubfolderContents(directoryFileOrder, subfolderName)
          if (subfolderFiles.length > 0) {
            setFolderOrderArray(subfolderFiles.filter(item => item.fileName !== '.keep'))
          } else {
            // if subfolderName prop does not match directory file, it's not a valid subfolder
            setRedirectToPage(`/sites/${siteName}/workspace`)
          }
        } else {
          setFolderOrderArray(convertFolderOrderToArray(directoryFileOrder))
        }
      }

    }, [folderContents, subfolderName])

    // set selected item type
    useEffect(() => {
      if (selectedPage) {
        const selectedItem = folderOrderArray.find((item) => item.fileName === selectedPage)
        setIsSelectedItemPage(selectedItem.type === 'file' ? true : false)
      }
    }, [selectedPage])

    // get page settings details when page is selected (used for editing page settings and deleting)
    const { data: pageData } = useQuery(
      [PAGE_CONTENT_KEY, { siteName, folderName, subfolderName, fileName: selectedPage }],
      () => getEditPageData({ siteName, folderName, subfolderName, fileName: selectedPage }),
      {
        enabled: selectedPage.length > 0 && isSelectedItemPage,
        retry: false,
        onError: () => {
          setSelectedPage('')
          errorToast(`The page data could not be retrieved. ${DEFAULT_RETRY_MSG}`)
        },
      },
    )

    // delete file
    const { mutateAsync: deleteHandler } = useMutation(
      async () => {
       if (isSelectedItemPage && pageData) await deletePageData({ siteName, folderName, subfolderName, fileName: selectedPage }, pageData.pageSha)
       else if (!isSelectedItemPage) await deleteSubfolder({ siteName, folderName, subfolderName: selectedPage })
       else return
      },
      {
        onError: () => errorToast(`Your ${isSelectedItemPage ? 'file' : 'subfolder'} could not be deleted successfully. ${DEFAULT_RETRY_MSG}`),
        onSuccess: () => {
          successToast(`Successfully deleted ${isSelectedItemPage ? 'file' : 'subfolder'}`)
          refetchFolderContents()
        },
        onSettled: () => {
          setIsDeleteModalActive((prevState) => !prevState)
          setSelectedPage('')
        },
      }
    )

    // move file
    const { mutateAsync: moveHandler } = useMutation(
      async () => {
        if (`${folderName ? folderName : ''}${subfolderName ? `/${subfolderName}` : ''}` === selectedPath) return true
        await moveFile({siteName, selectedFile: selectedPage, folderName, subfolderName, newPath: selectedPath})
      },
      {
        onError: () => errorToast(`Your file could not be moved successfully. ${DEFAULT_RETRY_MSG}`),
        onSuccess: (noChange) => {
          if (noChange) return successToast('Page is already in this folder') 
          successToast('Successfully moved file') 
          refetchFolderContents()
        },
        onSettled: () => {
          setIsMoveModalActive((prevState) => !prevState)
          setSelectedPage('')
          setSelectedPath('')
          setMoveDropdownQuery(initialMoveDropdownQueryState)
        },
      }
    )

    // MOVE-TO Dropdown
    // get all folders for move-to dropdown
    const { data: allFolders } = useQuery(
      [FOLDERS_CONTENT_KEY, { siteName, isResource: false }],
      async () => getAllCategories({ siteName }),
      {
        enabled: selectedPage.length > 0 && isSelectedItemPage,
        onError: () => errorToast(`The folders data could not be retrieved. ${DEFAULT_RETRY_MSG}`)
      },
    )

    // MOVE-TO Dropdown
    // get subfolders of selected folder for move-to dropdown
    const { data: querySubfolders } = useQuery(
      [DIR_CONTENT_KEY, siteName, moveDropdownQuery.split('/')[0]],  // moveDropdownQuery has format {folderName} or {folderName}/{subfolderName}
      async () => getDirectoryFile(siteName, moveDropdownQuery.split('/')[0]),
      {
        enabled: selectedPage.length > 0 && moveDropdownQuery.split('/')[0].length > 0 && isSelectedItemPage,
        onError: () => errorToast(`The folders data could not be retrieved. ${DEFAULT_RETRY_MSG}`)
      },
    )

    // MOVE-TO Dropdown utils
    // parse responses from move-to queries
    const getCategories = (moveDropdownQuery, allFolders, querySubfolders) => {
      const [ folderName, subfolderName ] = moveDropdownQuery.split('/') 
      if (!!subfolderName) { // inside subfolder, show empty 
        return []
      }
      if (!!folderName && querySubfolders) { // inside folder, show all subfolders
        const { order: parsedFolderContents } = parseDirectoryFile(querySubfolders.content)
        const parsedFolderArray = convertFolderOrderToArray(parsedFolderContents)
        return parsedFolderArray.filter(file => file.type === 'dir').map(file => file.fileName)
      }
      if (!folderName && !subfolderName && allFolders) { // inside workspace, show all folders
        return allFolders.collections
      }
      return null
    }

    return (
        <>
          {
            isFolderCreationActive &&
            <FolderCreationModal
              parentFolder={folderName}
              existingSubfolders={folderOrderArray.filter(item => item.type === 'dir').map(item => item.fileName)}
              pagesData={folderOrderArray.filter(item => item.type === 'file')}
              siteName={siteName}
              setIsFolderCreationActive={setIsFolderCreationActive}
            />
          }
          {
            isPageSettingsActive && (!selectedPage || pageData)
            && (
              <PageSettingsModal
                folderName={folderName}
                subfolderName={subfolderName}
                pagesData={folderOrderArray.filter(item => item.type === 'file').map(page => page.fileName)}
                pageData={pageData}
                siteName={siteName}
                originalPageName={selectedPage || ''}
                isNewPage={!selectedPage}
                setIsPageSettingsActive={setIsPageSettingsActive}
                setSelectedPage={setSelectedPage}
              />
            )
          }
          { isFolderModalOpen &&
            (
              <FolderModal
                displayTitle="Rename subfolder"
                displayText="Subfolder name"
                onClose={() => setIsFolderModalOpen(false)}
                folderOrCategoryName={folderName}
                subfolderName={selectedPage}
                siteName={siteName}
                folderType="page"
                existingFolders={folderOrderArray.filter(item => item.type === 'dir').map(item => item.fileName)}
              />
            )
          }
          {
            isDeleteModalActive
            && (
              <DeleteWarningModal
                onCancel={() => setIsDeleteModalActive(false)}
                onDelete={deleteHandler}
                type={isSelectedItemPage ? "page" : "subfolder"}
              />
            )
          }
          {
            isMoveModalActive
            && (
              <GenericWarningModal
                displayTitle="Warning"
                displayText="Moving a page to a different folder might lead to user confusion. You may wish to change the permalink for this page afterwards."
                onProceed={moveHandler}
                onCancel={() => {
                setIsMoveModalActive(false)
                }}
                proceedText="Continue"
                cancelText="Cancel"
              />
            )
          }
          {
            isRearrangeActive
            && (
              <FolderReorderingModal
                siteName={siteName}
                folderName={folderName}
                subfolderName={subfolderName}
                folderOrderArray={folderOrderArray}
                setIsRearrangeActive={setIsRearrangeActive}
                directoryFileSha={directoryFileSha}
                parsedFolderContents={parsedFolderContents}
                isFolderLive={isFolderLive}
              />
            )
          }
          <Header
            siteName={siteName}
            backButtonText={`Back to ${subfolderName ? folderName : 'Workspace'}`}
            backButtonUrl={`/sites/${siteName}/${subfolderName ? `folder/${folderName}` : 'workspace'}`}
            shouldAllowEditPageBackNav={!isRearrangeActive}
            isEditPage={true}
          />
          {/* main bottom section */}
          <div className={elementStyles.wrapper}>
            <Sidebar siteName={siteName} currPath={location.pathname} />
            {/* main section starts here */}
            <div className={contentStyles.mainSection}>
              {/* Page title */}
              <div className={contentStyles.sectionHeader}>
                <h1 className={contentStyles.sectionTitle}>{deslugifyDirectory(folderName)}</h1>
              </div>
              {/* Info segment */}
              <div className={contentStyles.segment}>
                <i className="bx bx-sm bx-bulb text-dark" />
                <span><strong className="ml-1">Pro tip:</strong> You can make a new section by creating subfolders</span>
              </div>
              {/* Segment divider  */}
              <div className={contentStyles.segmentDividerContainer}>
                <hr className="w-100 mt-3 mb-5" />
              </div>
              {/* Collections title */}
              <div className={contentStyles.segment}>
                <span>
                    <Link to={`/sites/${siteName}/workspace`}><strong>Workspace</strong></Link> > 
                    {
                        folderName
                        ? (
                          subfolderName
                          ? <Link to={`/sites/${siteName}/folder/${folderName}`}><strong className="ml-1"> {deslugifyDirectory(folderName)}</strong></Link>
                          : <strong className="ml-1"> {deslugifyDirectory(folderName)}</strong>
                        )
                        : null
                    }
                    {
                        folderName && subfolderName
                        ? (
                            <span> ><strong className="ml-1"> {deslugifyDirectory(subfolderName)}</strong></span>
                        )
                        : null
                    }
                </span>
              </div>
              {/* Options */}
              <div className={contentStyles.contentContainerFolderRowMargin}>
                <FolderOptionButton title="Rearrange items" isSelected={isRearrangeActive} onClick={() => setIsRearrangeActive(true)} option="rearrange" isDisabled={folderOrderArray.length <= 1 || !folderContents}/>
                <FolderOptionButton title="Create new page" option="create-page" id="pageSettings-new" onClick={() => setIsPageSettingsActive((prevState) => !prevState)}/>
                <FolderOptionButton title="Create new subfolder" option="create-sub" isDisabled={subfolderName || isLoadingDirectory ? true : false} onClick={() => setIsFolderCreationActive(true)}/>
              </div>
              {/* Collections content */}
              {
                !isLoadingDirectory && !queryError && folderOrderArray.length === 0 && <span>There are no pages in this {subfolderName ? `subfolder` : `folder`}.</span>
              }
              {
                  queryError && <span>There was an error retrieving your content. Please refresh the page.</span>
              }
              {
                !queryError
                && folderContents 
                && <FolderContent 
                    folderOrderArray={folderOrderArray} 
                    setFolderOrderArray={setFolderOrderArray} 
                    allCategories={getCategories(moveDropdownQuery, allFolders, querySubfolders)}
                    siteName={siteName} 
                    folderName={folderName}
                    setIsPageSettingsActive={setIsPageSettingsActive}
                    setIsFolderModalOpen={setIsFolderModalOpen}
                    setIsDeleteModalActive={setIsDeleteModalActive}
                    setIsMoveModalActive={setIsMoveModalActive}
                    setSelectedPage={setSelectedPage}
                    setSelectedPath={setSelectedPath}
                    moveDropdownQuery={moveDropdownQuery}
                    setMoveDropdownQuery={setMoveDropdownQuery}
                    clearMoveDropdownQueryState={() => setMoveDropdownQuery(initialMoveDropdownQueryState)}
                  />
              }
            </div>
            {/* main section ends here */}
            {
                process.env.REACT_APP_ENV === 'LOCAL_DEV' && <ReactQueryDevtools initialIsOpen={false} />
            }
          </div>
        </>
    );
}


export default Folders

Folders.propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        siteName: PropTypes.string,
      }),
    }).isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
    }).isRequired,
};
  