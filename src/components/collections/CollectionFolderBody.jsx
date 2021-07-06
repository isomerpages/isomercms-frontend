import React from "react"
import { Link } from "react-router-dom"
import { ReactQueryDevtools } from "react-query/devtools"

// Import contexts
import { CollectionConsumer } from "../../contexts/CollectionContext"

import Header from "../Header"
import Sidebar from "../Sidebar"
import FolderOptionButton from "../folders/FolderOptionButton"
import { FolderContent } from "../folders/FolderContent"

import elementStyles from "../../styles/isomer-cms/Elements.module.scss"
import contentStyles from "../../styles/isomer-cms/pages/Content.module.scss"

import { deslugifyDirectory } from "../../utils"

// Import constants
import { CollectionCreationSteps } from "../../constants"

const CollectionFolderBody = () => {
  return (
    <CollectionConsumer>
      {({
        siteName,
        collectionName,
        subcollectionName,
        isRearrangeActive,
        setIsRearrangeActive,
        setIsPageSettingsActive,
        setCollectionFolderCreationState,
        collectionFolderOrderArray,
        setCollectionFolderOrderArray,
        isLoadingDirectory,
        queryError,
        folderContents,
        initialMoveDropdownQueryState,
        moveDropdownQuery,
        setMoveDropdownQuery,
        allFolders,
        querySubfolders,
        getCategories,
        setIsFolderModalOpen,
        setIsDeleteModalActive,
        setIsMoveModalActive,
        setSelectedPage,
        setSelectedPath,
      }) => (
        <>
          <Header
            siteName={siteName}
            backButtonText={`Back to ${
              subcollectionName ? collectionName : "Workspace"
            }`}
            backButtonUrl={`/sites/${siteName}/${
              subcollectionName ? `folder/${collectionName}` : "workspace"
            }`}
            shouldAllowEditPageBackNav={!isRearrangeActive}
            isEditPage
          />
          <div className={elementStyles.wrapper}>
            <Sidebar siteName={siteName} currPath={location.pathname} />
            {/* main section starts here */}
            <div className={contentStyles.mainSection}>
              {/* Page title */}
              <div className={contentStyles.sectionHeader}>
                <h1 className={contentStyles.sectionTitle}>
                  {deslugifyDirectory(collectionName)}
                </h1>
              </div>
              {/* Info segment */}
              <div className={contentStyles.segment}>
                <i className="bx bx-sm bx-bulb text-dark" />
                <span>
                  <strong className="ml-1">Pro tip:</strong> You can make a new
                  section by creating subfolders
                </span>
              </div>
              {/* Segment divider  */}
              <div className={contentStyles.segmentDividerContainer}>
                <hr className="w-100 mt-3 mb-5" />
              </div>
              {/* Collections title */}
              <div className={contentStyles.segment}>
                <span>
                  <Link to={`/sites/${siteName}/workspace`}>
                    <strong>Workspace</strong>
                  </Link>
                  &nbsp;
                  {">"}
                  {collectionName ? (
                    subcollectionName ? (
                      <Link to={`/sites/${siteName}/folder/${collectionName}`}>
                        <strong className="ml-1">
                          &nbsp;
                          {deslugifyDirectory(collectionName)}
                        </strong>
                      </Link>
                    ) : (
                      <strong className="ml-1">
                        &nbsp;
                        {deslugifyDirectory(collectionName)}
                      </strong>
                    )
                  ) : null}
                  {collectionName && subcollectionName ? (
                    <span>
                      &nbsp;
                      {">"}
                      <strong className="ml-1">
                        &nbsp;
                        {deslugifyDirectory(subcollectionName)}
                      </strong>
                    </span>
                  ) : null}
                </span>
              </div>
              {/* Options */}
              <div className={contentStyles.contentContainerFolderRowMargin}>
                <FolderOptionButton
                  title="Rearrange items"
                  isSelected={isRearrangeActive}
                  onClick={() => setIsRearrangeActive(true)}
                  option="rearrange"
                  isDisabled={
                    collectionFolderOrderArray.length <= 1 || !folderContents
                  }
                />
                <FolderOptionButton
                  title="Create new page"
                  option="create-page"
                  id="pageSettings-new"
                  onClick={() =>
                    setIsPageSettingsActive((prevState) => !prevState)
                  }
                />
                <FolderOptionButton
                  title="Create new subfolder"
                  option="create-sub"
                  isDisabled={!!(subcollectionName || isLoadingDirectory)}
                  onClick={() =>
                    setCollectionFolderCreationState(
                      CollectionCreationSteps.SELECT_FOLDER_NAME
                    )
                  }
                />
              </div>
              {/* Collections content */}
              {!isLoadingDirectory &&
                !queryError &&
                collectionFolderOrderArray.length === 0 && (
                  <span>
                    There are no pages in this&nbsp;
                    {subcollectionName ? `subfolder` : `folder`}.
                  </span>
                )}
              {queryError && (
                <span>
                  There was an error retrieving your content. Please refresh the
                  page.
                </span>
              )}
              {!queryError && folderContents && (
                <FolderContent
                  folderOrderArray={collectionFolderOrderArray}
                  setFolderOrderArray={setCollectionFolderOrderArray}
                  allCategories={getCategories(
                    moveDropdownQuery,
                    allFolders,
                    querySubfolders
                  )}
                  siteName={siteName}
                  collectionName={collectionName}
                  setIsPageSettingsActive={setIsPageSettingsActive}
                  setIsFolderModalOpen={setIsFolderModalOpen}
                  setIsDeleteModalActive={setIsDeleteModalActive}
                  setIsMoveModalActive={setIsMoveModalActive}
                  setSelectedPage={setSelectedPage}
                  setSelectedPath={setSelectedPath}
                  moveDropdownQuery={moveDropdownQuery}
                  setMoveDropdownQuery={setMoveDropdownQuery}
                  clearMoveDropdownQueryState={() =>
                    setMoveDropdownQuery(initialMoveDropdownQueryState)
                  }
                />
              )}
            </div>
            {/* main section ends here */}
            {process.env.REACT_APP_ENV === "LOCAL_DEV" && (
              <ReactQueryDevtools initialIsOpen={false} />
            )}
          </div>
        </>
      )}
    </CollectionConsumer>
  )
}

export default CollectionFolderBody
