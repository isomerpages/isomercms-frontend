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
import FolderContent from '../components/folders/FolderContent';
import FolderModal from '../components/FolderModal';
import PageSettingsModal from '../components/PageSettingsModal'
import DeleteWarningModal from '../components/DeleteWarningModal'

import { errorToast, successToast } from '../utils/toasts';

import useRedirectHook from '../hooks/useRedirectHook';
import {
  PAGE_CONTENT_KEY,
} from '../constants'
import {
  DEFAULT_RETRY_MSG,
  parseDirectoryFile,
  updateDirectoryFile,
  convertFolderOrderToArray,
  convertArrayToFolderOrder,
  retrieveSubfolderContents,
  convertSubfolderArray,
} from '../utils'
import { DIR_CONTENT_KEY } from '../constants'

// Import API
import { getDirectoryFile, setDirectoryFile, getEditPageData, deletePageData, deleteSubfolder, } from '../api';

// Import styles
import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import contentStyles from '../styles/isomer-cms/pages/Content.module.scss';

const Folders = ({ match, location }) => {
    const { siteName, folderName, subfolderName } = match.params;

    const { setRedirectToPage } = useRedirectHook()

    const [isRearrangeActive, setIsRearrangeActive] = useState(false)
    const [isPageSettingsActive, setIsPageSettingsActive] = useState(false)
    const [directoryFileSha, setDirectoryFileSha] = useState('')
    const [folderOrderArray, setFolderOrderArray] = useState([])
    const [parsedFolderContents, setParsedFolderContents] = useState([])
    const [isFolderCreationActive, setIsFolderCreationActive] = useState(false)
    const [isDeleteModalActive, setIsDeleteModalActive] = useState(false)
    const [isFolderModalOpen, setIsFolderModalOpen] = useState(false)
    const [selectedPage, setSelectedPage] = useState('')
    const [isSelectedItemPage, setIsSelectedItemPage] = useState(false)

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
        }
      },
    );

    const { data: pageData } = useQuery(
      [PAGE_CONTENT_KEY, { siteName, folderName, subfolderName, fileName: selectedPage }],
      () => getEditPageData({ siteName, folderName, subfolderName, fileName: selectedPage }),
      {
        enabled: selectedPage.length > 0,
        retry: false,
        onError: () => {
          setSelectedPage('')
          errorToast(`The page data could not be retrieved. ${DEFAULT_RETRY_MSG}`)
        },
      },
    );

    const { mutate: rearrangeFolder } = useMutation(
      payload => setDirectoryFile(siteName, folderName, payload),
      {
        onError: () => errorToast(`Your file reordering could not be saved. Please try again. ${DEFAULT_RETRY_MSG}`),
        onSuccess: () => {
          successToast('Successfully updated page order')
          refetchFolderContents()
        },
        onSettled: () => setIsRearrangeActive((prevState) => !prevState),
      }
    )


    const { mutateAsync: deleteHandler } = useMutation(
      async () => {
       if (isSelectedItemPage) await deletePageData('collection', folderName, subfolderName, selectedPage)
       else await deleteSubfolder({ siteName, folderName, subfolderName: selectedPage })
      },
      {
        onError: () => errorToast(`Your file could not be deleted successfully. ${DEFAULT_RETRY_MSG}`),
        onSuccess: () => {
          successToast(`Successfully deleted ${isSelectedItemPage ? 'file' : 'subfolder'}`)
          refetchFolderContents()
        },
        onSettled: () => setIsDeleteModalActive((prevState) => !prevState),
      }
    )

    useEffect(() => {
        if (folderContents && folderContents.data) {
          const parsedFolderContents = parseDirectoryFile(folderContents.data.content)
          setDirectoryFileSha(folderContents.data.sha)
          setParsedFolderContents(parsedFolderContents)

          if (subfolderName) {
            const subfolderFiles = retrieveSubfolderContents(parsedFolderContents, subfolderName)
            if (subfolderFiles.length > 0) {
              setFolderOrderArray(subfolderFiles.filter(item => item.name !== '.keep'))
            } else {
              // if subfolderName prop does not match directory file, it's not a valid subfolder
              setRedirectToPage(`/sites/${siteName}/workspace`)
            }
          } else {
            setFolderOrderArray(convertFolderOrderToArray(parsedFolderContents))
          }
        }
    }, [folderContents, subfolderName])

    useEffect(() => {
      if (selectedPage) {
        const selectedItem = folderOrderArray.find((item) => item.name === selectedPage)
        setIsSelectedItemPage(selectedItem.type === 'file' ? true : false)
      }
    }, [selectedPage])

    const toggleRearrange = () => { 
      if (isRearrangeActive) { 
        // drag and drop complete, save new order 
        let newFolderOrder
        if (subfolderName) {
          newFolderOrder = convertSubfolderArray(folderOrderArray, parsedFolderContents, subfolderName)
        } else {
          newFolderOrder = convertArrayToFolderOrder(folderOrderArray)
        }
        if (JSON.stringify(newFolderOrder) === JSON.stringify(parsedFolderContents)) { 
          // no change in file order
          setIsRearrangeActive((prevState) => !prevState)
          return
        }
        const updatedDirectoryFile = updateDirectoryFile(folderContents.data.content, newFolderOrder)

        const payload = {
          content: updatedDirectoryFile,
          sha: directoryFileSha,
        } 
        rearrangeFolder(payload) // setIsRearrangeActive(false) handled by mutate
      } else {
        setIsRearrangeActive((prevState) => !prevState) 
      }
    }

    return (
        <>
          {
            isFolderCreationActive &&
            <FolderCreationModal
              parentFolder={folderName}
              existingSubfolders={folderOrderArray.filter(item => item.type === 'dir').map(item => item.name)}
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
                pagesData={folderOrderArray.filter(item => item.type === 'file')}
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
                isCollection
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
          <Header
            backButtonText={`Back to ${subfolderName ? folderName : 'Workspace'}`}
            backButtonUrl={`/sites/${siteName}/${subfolderName ? `folder/${folderName}` : 'workspace'}`}
            shouldAllowEditPageBackNav={!isRearrangeActive}
            isEditPage="true"
          />
          {/* main bottom section */}
          <div className={elementStyles.wrapper}>
            <Sidebar siteName={siteName} currPath={location.pathname} />
            {/* main section starts here */}
            <div className={contentStyles.mainSection}>
              {/* Page title */}
              <div className={contentStyles.sectionHeader}>
                <h1 className={contentStyles.sectionTitle}>{folderName}</h1>
              </div>
              {/* Info segment */}
              <div className={contentStyles.segment}>
                <i className="bx bx-sm bx-bulb text-dark" />
                <span><strong className="ml-1">Pro tip:</strong> You can make a new section by creating sub folders</span>
              </div>
              {/* Segment divider  */}
              <div className={contentStyles.segmentDividerContainer}>
                <hr className="w-100 mt-3 mb-5" />
              </div>
              {/* Collections title */}
              <div className={contentStyles.segment}>
                <span>
                    My workspace >
                    {
                        folderName
                        ? (
                          subfolderName
                          ? <Link to={`/sites/${siteName}/folder/${folderName}`}><strong className="ml-1"> {folderName}</strong></Link>
                          : <strong className="ml-1"> {folderName}</strong>
                        )
                        : null
                    }
                    {
                        folderName && subfolderName
                        ? (
                            <span> ><strong className="ml-1"> {subfolderName}</strong></span>
                        )
                        : null
                    }
                </span>
              </div>
              {/* Options */}
              <div className={contentStyles.contentContainerFolderRowMargin}>
                <FolderOptionButton title="Rearrange items" isSelected={isRearrangeActive} onClick={toggleRearrange} option="rearrange" isDisabled={folderOrderArray.length <= 1 || !folderContents}/>
                <FolderOptionButton title="Create new page" option="create-page" id="pageSettings-new" onClick={() => setIsPageSettingsActive((prevState) => !prevState)}/>
                <FolderOptionButton title="Create new sub-folder" option="create-sub" isDisabled={subfolderName || isLoadingDirectory ? true : false} onClick={() => setIsFolderCreationActive(true)}/>
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
                    siteName={siteName} 
                    folderName={folderName} 
                    enableDragDrop={isRearrangeActive}
                    setIsPageSettingsActive={setIsPageSettingsActive}
                    setIsFolderModalOpen={setIsFolderModalOpen}
                    setIsDeleteModalActive={setIsDeleteModalActive}
                    setSelectedPage={setSelectedPage}
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
  