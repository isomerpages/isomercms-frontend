import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery, useMutation } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Link, Redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import _ from 'lodash';

// Import components
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import FolderCreationModal from '../components/FolderCreationModal'
import FolderOptionButton from '../components/folders/FolderOptionButton';
import FolderContent from '../components/folders/FolderContent';
import Toast from '../components/Toast';


import {
  DEFAULT_ERROR_TOAST_MSG,
  parseDirectoryFile,
  updateDirectoryFile,
  convertFolderOrderToArray,
  convertArrayToFolderOrder,
  retrieveSubfolderContents,
  convertSubfolderArray,
} from '../utils'

// Import API
import { getDirectoryFile, setDirectoryFile } from '../api';

// Import styles
import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import contentStyles from '../styles/isomer-cms/pages/Content.module.scss';

// Constants
const FOLDER_CONTENTS_KEY = 'folder-contents'

const Folders = ({ match, location }) => {
    const { siteName, folderName, subfolderName } = match.params;

    const [isRearrangeActive, setIsRearrangeActive] = useState(false)
    const [directoryFileSha, setDirectoryFileSha] = useState('')
    const [folderOrderArray, setFolderOrderArray] = useState([])
    const [parsedFolderContents, setParsedFolderContents] = useState([])
    const [folderOrder, setFolderOrder] = useState([])
    const [isFolderCreationActive, setIsFolderCreationActive] = useState(false)
    const [shouldRedirect, setShouldRedirect] = useState(false)

    const { data: folderContents, error: queryError } = useQuery(
      FOLDER_CONTENTS_KEY,
      () => getDirectoryFile(siteName, folderName),
      { 
        retry: false,
        enabled: !isRearrangeActive,
      },
    );

    const { mutate, error: mutateError } = useMutation(
      payload => setDirectoryFile(siteName, folderName, payload),
      { onSettled: () => setIsRearrangeActive((prevState) => !prevState) }
    )

    useEffect(() => {
      let _isMounted = true;
      if (queryError) {
        if (queryError.status === 404) {
          // redirect if collection/folder cannot be found
          if (!shouldRedirect && _isMounted) setShouldRedirect(true)
        } else {
          toast(
            <Toast notificationType='error' text={`There was a problem retrieving data from your repo. ${DEFAULT_ERROR_TOAST_MSG}`}/>,
            {className: `${elementStyles.toastError} ${elementStyles.toastLong}`},
          );
        }
      }

      return () => {
        _isMounted = false
      }
    }, [queryError])

    useEffect(() => {
      if (mutateError) {
        toast(
          <Toast notificationType='error' text={`Your file reordering could not be saved. Please try again. ${DEFAULT_ERROR_TOAST_MSG}`}/>,
          {className: `${elementStyles.toastError} ${elementStyles.toastLong}`},
        );
      }
    }, [mutateError])

    useEffect(() => {
        if (folderContents && folderContents.data) {
          const parsedFolderContents = parseDirectoryFile(folderContents.data.content)
          setDirectoryFileSha(folderContents.data.sha)
          setParsedFolderContents(parsedFolderContents)

          if (subfolderName) {
            const subfolderFiles = retrieveSubfolderContents(parsedFolderContents, subfolderName)
            if (subfolderFiles.length > 0) {
              setFolderOrderArray(subfolderFiles)
            } else {
              // if subfolderName prop does not match directory file, it's not a valid subfolder
              if (!shouldRedirect) setShouldRedirect(true)
            }
          } else {
            setFolderOrderArray(convertFolderOrderToArray(parsedFolderContents))
          }
        }
    }, [folderContents, subfolderName])

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
        mutate(payload) // setIsRearrangeActive(false) handled by mutate
      } else {
        setIsRearrangeActive((prevState) => !prevState) 
      }
    }

    return (
        <>
          {
            shouldRedirect &&
            <Redirect to={{pathname: `/sites/${siteName}/workspace`}} />
          }
          {
            isFolderCreationActive &&
            <FolderCreationModal
              parentFolder={folderName}
              existingSubfolders={[]}
              pagesData={folderOrder.filter(item => item.type === 'file')}
              siteName={siteName}
              setIsFolderCreationActive={setIsFolderCreationActive}
            />
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
                <FolderOptionButton title="Create new page" option="create-page" />
                <FolderOptionButton title="Create new sub-folder" option="create-sub" isSubfolder={subfolderName || folderOrder.length === 0 ? true : false} onClick={() => setIsFolderCreationActive(true)}/>
              </div>
              {/* Collections content */}
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
  