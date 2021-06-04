import React from 'react';

import elementStyles from '../styles/isomer-cms/Elements.module.scss';

const AltFolderBody = ({ notificationType, text }) => {

  return (
    <>
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
      </div>
    </>
  )
}

export default AltFolderBody