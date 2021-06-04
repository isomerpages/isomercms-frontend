import React, { createContext, useEffect, useState, useContext } from 'react'
import axios from 'axios'
import update from 'immutability-helper'
import { useQuery, useMutation } from 'react-query'

// Import constants
import { CollectionCreationSteps } from '../constants'

// Import API service calls
import { getDirectoryFile, moveFiles } from '../api'

const CollectionContext = createContext(null)

const CollectionConsumer = ({ children }) => {
  const collectionContextData = useContext(FolderContext)
  if (!collectionContextData) throw new Error('CollectionConsumer must be used within CollectionProvider')

  return <FolderContext.Consumer>{children}</FolderContext.Consumer>
}

const CollectionProvider = ({ siteName, folderName, subfolderName, children }) => {
  // ===============================
  // General collection state
  // ===============================
  const [collectionSubfolders, setCollectionSubfolders] = useState([])
  const [collectionFolderOrderArray, setCollectionFolderOrderArray] = useState([])

  // ===============================
  // State for creating new collection folder/subfolder
  // ===============================
  const [collectionFolderCreationState, setCollectionFolderCreationState] = useState(CollectionCreationSteps.INACTIVE)
  const [collectionFolderCreationTitle, setCollectionFolderCreationTitle] = useState('')
  const [collectionFolderCreationErrors, setCollectionFolderCreationErrors] = useState('')
  const [collectionFolderMovePages, setCollectionFolderMovePages] = useState({}) // pages to be moved into new collection folder/subfolder

  // ===============================
  // Primary data fetch for collections context
  // ===============================
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
          setCollectionFolderOrderArray(subfolderFiles.filter(item => item.fileName !== '.keep'))
        } else {
          // if subfolderName prop does not match directory file, it's not a valid subfolder
          setRedirectToPage(`/sites/${siteName}/workspace`)
        }
      } else {
        setCollectionFolderOrderArray(convertFolderOrderToArray(directoryFileOrder))
      }
    }

  }, [folderContents, subfolderName])

  // ===============================
  // Functions for creating new collection folder/subfolder
  // ===============================
  // Handler for when user updates the name of a new collection folder/subfolder
  const collectionFolderCreationNameChangeHandler = (event) => {
    const { value } = event.target
    let errorMessage = validateCategoryName(value, 'page', collectionSubfolders)
    setCollectionFolderCreationTitle(value)
    setCollectionFolderCreationErrors(errorMessage)
  }

  // Handler for when user selects pages to add to new collection folder/subfolder
  const collectionFolderCreationPageSelectChangeHandler = (name) => {
    let newSelectedFiles
    if (name in collectionFolderMovePages) {
      newSelectedFiles = update(collectionFolderMovePages, {
        $unset: [name]
      })
      Object.keys(newSelectedFiles).forEach((fileName, idx) => newSelectedFiles = update(newSelectedFiles, {
        [fileName]: {$set: idx + 1}
      }))
    } else {
      newSelectedFiles = update(collectionFolderMovePages, {
        [name]: {$set: Object.keys(collectionFolderMovePages).length + 1}
      })
    }
    setCollectionFolderMovePages(newSelectedFiles)
  }

  // ===============================
  // API calls for creating new collection folder/subfolder
  // ===============================
  const { mutateAsync: createNewCollectionFolderApiCall } = useMutation(
    () => moveFiles(siteName, Object.keys(selectedFiles), slugifyCategory(title), parentFolder),
    { onSuccess: () => {
        const redirectUrl = `/sites/${siteName}/folder/${parentFolder ? `${parentFolder}/subfolder/${slugifyCategory(title)}` : slugifyCategory(title)}`
        setRedirectToPage(redirectUrl)
        setIsFolderCreationActive(false)
      },
      onError: (error) => {
        if (error.response.status === 409) {
          errorToast(`The name chosen is a protected folder name. Please choose a different name.`)
        } else {
          errorToast(`There was a problem trying to create your new folder. ${DEFAULT_RETRY_MSG}`)
        }
      }
    }
  )

  const collectionContextData = {
    // General collection data
    siteName,
    folderName,
    subfolderName,
    collectionFolderOrderArray,

    // Collection folder/subfolder creation data
    collectionFolderCreationState,
    setCollectionFolderCreationState,
    collectionFolderCreationTitle,
    collectionFolderCreationErrors,
    collectionFolderCreationNameChangeHandler,
    collectionFolderCreationPageSelectChangeHandler,

    // API calls
    createNewCollectionFolderApiCall
  }

  return <CollectionContext.Provider value={collectionContextData}>{children}</CollectionContext.Provider>
}

export {
  CollectionContext,
  CollectionConsumer,
  CollectionProvider
}