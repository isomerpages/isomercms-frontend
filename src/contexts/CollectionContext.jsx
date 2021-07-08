import React, { createContext, useEffect, useState, useContext } from "react"
import axios from "axios"
import update from "immutability-helper"
import { useQuery, useMutation } from "react-query"

// Import constants
import {
  CollectionCreationSteps,
  DIR_CONTENT_KEY,
  FOLDERS_CONTENT_KEY,
  PAGE_CONTENT_KEY,
} from "../constants"

// Import validators and utils
import { validateCategoryName } from "../utils/validators"
import {
  DEFAULT_RETRY_MSG, // TO-DO: Why is this in utils? Move it somewhere else
  parseDirectoryFile,
  convertFolderOrderToArray,
  retrieveSubfolderContents,
  slugifyCategory,
  convertSubfolderArray,
  updateDirectoryFile,
  convertArrayToFolderOrder,
} from "../utils"
import { errorToast, successToast } from "../utils/toasts"

// Hooks
import useRedirectHook from "../hooks/useRedirectHook"

// Import API service calls
import {
  getDirectoryFile,
  moveFiles,
  setDirectoryFile,
  deletePageData,
  getEditPageData,
  deleteSubfolder,
} from "../api"

const CollectionContext = createContext(null)

const CollectionConsumer = ({ children }) => {
  const collectionContextData = useContext(CollectionContext)
  if (!collectionContextData)
    throw new Error("CollectionConsumer must be used within CollectionProvider")

  return <CollectionContext.Consumer>{children}</CollectionContext.Consumer>
}

const CollectionProvider = ({
  siteName,
  collectionName,
  subcollectionName,
  children,
}) => {
  // Hooks
  const { setRedirectToPage } = useRedirectHook()

  // ===============================
  // General collection state
  // ===============================
  const [collectionSubfolders, setCollectionSubfolders] = useState([])
  const [collectionFolderOrderArray, setCollectionFolderOrderArray] = useState(
    []
  )
  const [directoryFileSha, setDirectoryFileSha] = useState("")
  const [parsedFolderContents, setParsedFolderContents] = useState([])
  const [isFolderLive, setIsFolderLive] = useState(true)
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false)

  // TO-DO: clarify what these are
  // selectedPage refers to the page that is about to be edited or deleted.
  const [selectedPage, setSelectedPage] = useState("")
  const [selectedPath, setSelectedPath] = useState("")

  // TO-DO: Rename this? At first glance, this is a variable that is true if a selected item is a page
  // and false if selected item is not a page. Or can we combine this state variable with selectedPage?
  const [isSelectedItemPage, setIsSelectedItemPage] = useState(false)

  // ===============================
  // State for rearranging collection/subcollection
  // ===============================
  const [isRearrangeActive, setIsRearrangeActive] = useState(false)

  // ===============================
  // State for modifying collection page settings
  // ===============================
  const [isPageSettingsActive, setIsPageSettingsActive] = useState(false)

  // ===============================
  // State for deleting collection/subcollection page
  // ===============================
  const [isDeleteModalActive, setIsDeleteModalActive] = useState(false)

  // ===============================
  // State for creating new collection/subcollection
  // ===============================
  const [
    collectionFolderCreationState,
    setCollectionFolderCreationState,
  ] = useState(CollectionCreationSteps.INACTIVE)
  const [
    collectionFolderCreationTitle,
    setCollectionFolderCreationTitle,
  ] = useState("")
  const [
    collectionFolderCreationErrors,
    setCollectionFolderCreationErrors,
  ] = useState("")
  const [collectionFolderMovePages, setCollectionFolderMovePages] = useState({}) // pages to be moved into new collection folder/subfolder

  // ===============================
  // State for moving collection/subcollection page
  // ===============================
  // set Move-To dropdown to start from current location of file
  const initialMoveDropdownQueryState = `${collectionName}${
    subcollectionName ? `/${subcollectionName}` : ""
  }`
  const [isMoveModalActive, setIsMoveModalActive] = useState(false)
  const [moveDropdownQuery, setMoveDropdownQuery] = useState("")

  // ===============================
  // Primary data fetch for collections context
  // ===============================
  const {
    data: folderContents,
    error: queryError,
    isLoading: isLoadingDirectory,
    refetch: refetchFolderContents,
  } = useQuery(
    [DIR_CONTENT_KEY, siteName, collectionName, subcollectionName],
    () => getDirectoryFile(siteName, collectionName),
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
    }
  )

  // parse contents of current folder directory
  useEffect(() => {
    // We want to regenerate the folder order if isRearrangeActive is false,
    // i.e. user has clicked out of the rearrange modal
    if (isRearrangeActive) return

    if (folderContents && folderContents.sha) {
      const {
        order: directoryFileOrder,
        output: directoryFileOutput,
      } = parseDirectoryFile(folderContents.content)
      setDirectoryFileSha(folderContents.sha)
      setParsedFolderContents(directoryFileOrder)
      setIsFolderLive(directoryFileOutput)

      if (subcollectionName) {
        const subcollectionFiles = retrieveSubfolderContents(
          directoryFileOrder,
          subcollectionName
        )
        if (subcollectionFiles.length > 0) {
          setCollectionFolderOrderArray(
            subcollectionFiles.filter((item) => item.fileName !== ".keep")
          )
        } else {
          // if subcollectionName prop does not match directory file, it's not a valid subcollectionfolder
          setRedirectToPage(`/sites/${siteName}/workspace`)
        }
      } else {
        setCollectionFolderOrderArray(
          convertFolderOrderToArray(directoryFileOrder)
        )
      }
    }
  }, [folderContents, subcollectionName, isRearrangeActive])

  useEffect(() => {
    setMoveDropdownQuery(initialMoveDropdownQueryState)
  }, [collectionName, subcollectionName])

  // set selected item type
  useEffect(() => {
    if (selectedPage) {
      const selectedItem = collectionFolderOrderArray.find(
        (item) => item.fileName === selectedPage
      )
      setIsSelectedItemPage(selectedItem.type === "file")
    }
  }, [selectedPage])

  // Reset the folder creation title, errors, and pages to be moved if the state is inactive
  useEffect(() => {
    if (collectionFolderCreationState === CollectionCreationSteps.INACTIVE) {
      setCollectionFolderCreationTitle("")
      setCollectionFolderCreationErrors("")
      setCollectionFolderMovePages({})
    }
  }, [collectionFolderCreationState])

  // ===============================
  // Functions for moving collection/subcollection page
  // ===============================

  // MOVE-TO Dropdown
  // get all folders for move-to dropdown
  const { data: allFolders } = useQuery(
    [FOLDERS_CONTENT_KEY, { siteName, isResource: false }],
    async () => getAllCategories({ siteName }),
    {
      enabled: selectedPage.length > 0 && isSelectedItemPage,
      onError: () =>
        errorToast(
          `The folders data could not be retrieved. ${DEFAULT_RETRY_MSG}`
        ),
    }
  )

  // MOVE-TO Dropdown
  // get subfolders of selected folder for move-to dropdown
  const { data: querySubfolders } = useQuery(
    [DIR_CONTENT_KEY, siteName, moveDropdownQuery.split("/")[0]], // moveDropdownQuery has format {folderName} or {folderName}/{subfolderName}
    async () => getDirectoryFile(siteName, moveDropdownQuery.split("/")[0]),
    {
      enabled:
        selectedPage.length > 0 &&
        moveDropdownQuery.split("/")[0].length > 0 &&
        isSelectedItemPage,
      onError: () =>
        errorToast(
          `The folders data could not be retrieved. ${DEFAULT_RETRY_MSG}`
        ),
    }
  )

  // MOVE-TO Dropdown utils
  // parse responses from move-to queries
  const getCategories = (moveDropdownQuery, allFolders, querySubfolders) => {
    const [folderName, subfolderName] = moveDropdownQuery.split("/")
    if (subfolderName) {
      // inside subfolder, show empty
      return []
    }
    if (!!folderName && querySubfolders) {
      // inside folder, show all subfolders
      const { order: parsedFolderContents } = parseDirectoryFile(
        querySubfolders.content
      )
      const parsedFolderArray = convertFolderOrderToArray(parsedFolderContents)
      return parsedFolderArray
        .filter((file) => file.type === "dir")
        .map((file) => file.fileName)
    }
    if (!folderName && !subfolderName && allFolders) {
      // inside workspace, show all folders
      return allFolders.collections
    }
    return null
  }

  // ===============================
  // API calls for creating new collection/subcollection
  // ===============================
  const { mutateAsync: updateCollectionFolderOrderApiCall } = useMutation(
    (payload) => setDirectoryFile(siteName, collectionName, payload),
    {
      onError: () =>
        errorToast(
          `Your file reordering could not be saved. ${DEFAULT_RETRY_MSG}`
        ),
      onSuccess: () => successToast("Successfully updated collection order"),
      onSettled: () => setIsRearrangeActive((prevState) => !prevState),
    }
  )

  // ===============================
  // Functions for reordering collection/subcollection
  // ===============================
  // REORDERING utils
  const rearrangeFolder = async () => {
    // drag and drop complete, save new order
    let newFolderOrder
    if (subcollectionName) {
      newFolderOrder = convertSubfolderArray(
        collectionFolderOrderArray,
        parsedFolderContents,
        subcollectionName
      )
    } else {
      newFolderOrder = convertArrayToFolderOrder(collectionFolderOrderArray)
    }
    if (
      JSON.stringify(newFolderOrder) === JSON.stringify(parsedFolderContents)
    ) {
      // no change in file order
      setIsRearrangeActive((prevState) => !prevState)
      return
    }

    const updatedDirectoryFile = updateDirectoryFile(
      collectionName,
      isFolderLive,
      newFolderOrder
    )

    const payload = {
      content: updatedDirectoryFile,
      sha: directoryFileSha,
    }
    await updateCollectionFolderOrderApiCall(payload) // setIsRearrangeActive(false) handled by mutate
  }

  // ===============================
  // Functions for creating new collection folder/subfolder
  // ===============================
  // Handler for when user updates the name of a new collection folder/subfolder
  const collectionFolderCreationNameChangeHandler = (event) => {
    const { value } = event.target
    const errorMessage = validateCategoryName(
      value,
      "page",
      collectionSubfolders
    )
    setCollectionFolderCreationTitle(value)
    setCollectionFolderCreationErrors(errorMessage)
  }

  // Handler for when user selects pages to add to new collection folder/subfolder
  const collectionFolderCreationPageSelectChangeHandler = (name) => {
    let newSelectedFiles
    if (name in collectionFolderMovePages) {
      newSelectedFiles = update(collectionFolderMovePages, {
        $unset: [name],
      })
      Object.keys(newSelectedFiles).forEach(
        (fileName, idx) =>
          (newSelectedFiles = update(newSelectedFiles, {
            [fileName]: { $set: idx + 1 },
          }))
      )
    } else {
      newSelectedFiles = update(collectionFolderMovePages, {
        [name]: { $set: Object.keys(collectionFolderMovePages).length + 1 },
      })
    }
    setCollectionFolderMovePages(newSelectedFiles)
  }

  // ===============================
  // API calls for creating new collection/subcollection
  // ===============================
  const { mutateAsync: createNewCollectionFolderApiCall } = useMutation(
    () =>
      moveFiles(
        siteName,
        Object.keys(collectionFolderMovePages),
        slugifyCategory(collectionFolderCreationTitle),
        collectionName
      ),
    {
      onSuccess: () => {
        const redirectUrl = `/sites/${siteName}/folder/${
          collectionName
            ? `${collectionName}/subfolder/${slugifyCategory(
                collectionFolderCreationTitle
              )}`
            : slugifyCategory(collectionFolderCreationTitle)
        }`
        setRedirectToPage(redirectUrl)
        setCollectionFolderCreationState(CollectionCreationSteps.INACTIVE)
      },
      onError: (error) => {
        if (error.response.status === 409) {
          errorToast(
            `The name chosen is a protected folder name. Please choose a different name.`
          )
        } else {
          errorToast(
            `There was a problem trying to create your new folder. ${DEFAULT_RETRY_MSG}`
          )
        }
      },
    }
  )

  // ===============================
  // API calls for deleting subcollection or collection page
  // ===============================
  // get page settings details when page is selected (used for editing page settings and deleting)
  const { data: pageData } = useQuery(
    [
      PAGE_CONTENT_KEY,
      {
        siteName,
        folderName: collectionName,
        subfolderName: subcollectionName,
        fileName: selectedPage,
      },
    ],
    () =>
      getEditPageData({
        siteName,
        folderName: collectionName,
        subfolderName: subcollectionName,
        fileName: selectedPage,
      }),
    {
      enabled: selectedPage.length > 0 && isSelectedItemPage,
      retry: false,
      onError: () => {
        setSelectedPage("")
        errorToast(`The page data could not be retrieved. ${DEFAULT_RETRY_MSG}`)
      },
    }
  )

  const { mutateAsync: deleteCollectionPageOrSubcollection } = useMutation(
    async () => {
      if (isSelectedItemPage && pageData)
        await deletePageData(
          {
            siteName,
            folderName: collectionName,
            subFolderName: subcollectionName,
            fileName: selectedPage,
          },
          pageData.pageSha
        )
      else if (!isSelectedItemPage)
        await deleteSubfolder({
          siteName,
          folderName: collectionName,
          subfolderName: selectedPage,
        })
      else return
    },
    {
      onError: () =>
        errorToast(
          `Your ${
            isSelectedItemPage ? "file" : "subfolder"
          } could not be deleted successfully. ${DEFAULT_RETRY_MSG}`
        ),
      onSuccess: () => {
        successToast(
          `Successfully deleted ${isSelectedItemPage ? "file" : "subfolder"}`
        )
        refetchFolderContents()
      },
      onSettled: () => {
        setIsDeleteModalActive((prevState) => !prevState)
        setSelectedPage("")
      },
    }
  )

  const collectionContextData = {
    // General collection data
    siteName,
    collectionName,
    subcollectionName,
    collectionFolderOrderArray,
    directoryFileSha,
    folderContents,
    parsedFolderContents,
    isFolderLive,
    isLoadingDirectory,
    queryError,
    refetchFolderContents,
    isFolderModalOpen,
    setIsFolderModalOpen,

    // Page selection
    selectedPage,
    setSelectedPage,
    selectedPath,
    setSelectedPath,
    isSelectedItemPage,
    setIsSelectedItemPage,

    // Collection/subcollection rearrangement data
    isRearrangeActive,
    setIsRearrangeActive,
    setCollectionFolderOrderArray,

    // Collection page setting data
    isPageSettingsActive,
    setIsPageSettingsActive,

    // Delete collection page data
    isDeleteModalActive,
    setIsDeleteModalActive,

    // Collection page move data
    isMoveModalActive,
    setIsMoveModalActive,
    initialMoveDropdownQueryState,
    moveDropdownQuery,
    setMoveDropdownQuery,
    allFolders,
    querySubfolders,
    getCategories,

    // Collection/subcollection creation data
    collectionFolderCreationState,
    setCollectionFolderCreationState,
    collectionFolderCreationTitle,
    collectionFolderCreationErrors,
    collectionFolderCreationNameChangeHandler,
    collectionFolderCreationPageSelectChangeHandler,
    collectionFolderMovePages,

    // TO-DO: Improve naming convention for these...
    // Methods that involve API calls
    createNewCollectionFolderApiCall,
    rearrangeFolder,
    deleteCollectionPageOrSubcollection,
  }

  return (
    <CollectionContext.Provider value={collectionContextData}>
      {children}
    </CollectionContext.Provider>
  )
}

export { CollectionContext, CollectionConsumer, CollectionProvider }
