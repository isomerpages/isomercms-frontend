import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { useQuery, useMutation } from 'react-query';
import PropTypes from 'prop-types';
import _ from 'lodash';

import {
    PAGE_CONTENT_KEY,
} from '../constants'

import { getEditPageData, deletePageData } from '../api'

import { DEFAULT_RETRY_MSG } from '../utils'

// Import components
import OverviewCard from '../components/OverviewCard';
import ComponentSettingsModal from './ComponentSettingsModal'
import PageSettingsModal from './PageSettingsModal'
import { errorToast, successToast } from '../utils/toasts';
import DeleteWarningModal from '../components/DeleteWarningModal'

// Import styles
import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import contentStyles from '../styles/isomer-cms/pages/Content.module.scss';

// Import utils
import { retrieveThirdNavOptions } from '../utils/dropdownUtils'


// axios settings
axios.defaults.withCredentials = true

const CollectionPagesSection = ({ collectionName, pages, siteName, isResource }) => {
    const [isComponentSettingsActive, setIsComponentSettingsActive] = useState(false)
    const [selectedFile, setSelectedFile] = useState('')
    const [createNewPage, setCreateNewPage] = useState(false)
    const [collectionPageData, setCollectionPageData] = useState(null)
    const [thirdNavData, setThirdNavData] = useState(null)
    const [allCategories, setAllCategories] = useState()
    const [canShowDeleteWarningModal, setCanShowDeleteWarningModal] = useState(false)

    useEffect(() => {
        let _isMounted = true
        const fetchData = async () => {
          // Retrieve the list of all page/resource categories for use in the dropdown options.
          if (isResource) {
            const resourcesResp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/resources`);
            const { resources: allCategories } = resourcesResp.data;
            if (_isMounted) setAllCategories(allCategories.map((category) => category.dirName))
          } else {
            const collectionsResp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/collections`);
            const { collections: collectionCategories } = collectionsResp.data;
            if (_isMounted) setAllCategories(collectionCategories)
          }
        }
        fetchData()

        return () => { _isMounted = false }
      }, [])

    const loadThirdNavOptions = async () => {
        if (thirdNavData) {
            return new Promise((resolve) => {
                resolve(thirdNavData)
              });
        }

        const { collectionPages, thirdNavOptions } = await retrieveThirdNavOptions(siteName, collectionName, true)
        setCollectionPageData(collectionPages)
        setThirdNavData(thirdNavOptions)
        return thirdNavOptions
    }


    const isCategoryDropdownDisabled = (isNewFile, category) => {
        if (category) return true
        if (isNewFile) return false
        return true
    }

    const generateNewPageText = () => {
        if (isResource) {
            return `Add a new resource`
        } else {
            return `Add a new ${collectionName ? 'collection ' : ''}page`
        }
    }

    const settingsToggle = (event) => {
        const { id } = event.target;
        const idArray = id.split('-');

        // Create new page
        if (idArray[1] === 'NEW') {
            setIsComponentSettingsActive((prevState) => !prevState)
            setSelectedFile('')
            setCreateNewPage(true)
        } else {
          // Modify existing page frontmatter
          const pageIndex = parseInt(idArray[1], RADIX_PARSE_INT);

          setIsComponentSettingsActive((prevState) => !prevState)
          setSelectedFile(pages[pageIndex])
          setCreateNewPage(false)
        }
    }

    const { data: pageData } = useQuery(
        [PAGE_CONTENT_KEY, { siteName, fileName: selectedFile }],
        () => getEditPageData({ siteName, fileName: selectedFile }),
        {
          enabled: selectedFile.length > 0,
          retry: false,
          onError: () => {
            setSelectedFile('')
            errorToast(`The page data could not be retrieved. ${DEFAULT_RETRY_MSG}`)
          },
        },
    )

    const { mutateAsync: deleteHandler } = useMutation(
        async () => deletePageData({ siteName, fileName: selectedFile }, pageData.pageSha),
        {
          onError: () => errorToast(`Your file could not be deleted successfully. ${DEFAULT_RETRY_MSG}`),
          onSuccess: () => {successToast('Successfully deleted file'); window.location.reload();},
          onSettled: () => setCanShowDeleteWarningModal((prevState) => !prevState),
        }
      )

    return (
        <>
            {
                isComponentSettingsActive 
                && ( isResource 
                    ? <ComponentSettingsModal
                        modalTitle={isResource ? "Resource Settings" : "Page Settings"}
                        // settingsToggle={settingsToggle}
                        category={collectionName}
                        isCategoryDisabled={isCategoryDropdownDisabled(createNewPage, collectionName)}
                        siteName={siteName}
                        fileName={selectedFile ? selectedFile.fileName : ''}
                        isNewFile={createNewPage}
                        type={isResource ? "resource" : "page"}
                        pageFileNames={
                            _.chain(pages)
                                .map((page) => page.fileName)
                                .value()
                        }
                        collectionPageData={collectionPageData}
                        loadThirdNavOptions={loadThirdNavOptions}
                        setIsComponentSettingsActive={setIsComponentSettingsActive}
                    /> 
                    : (pageData || createNewPage) 
                    && <PageSettingsModal
                        pagesData={pages}
                        pageData={pageData}
                        siteName={siteName}
                        originalPageName={selectedFile || ''}
                        isNewPage={createNewPage}
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
            <div className={contentStyles.contentContainerBoxes}>
                {/* Display loader if pages have not been retrieved from API call */}
                { pages
                    ? (
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
                            <h2 id="settingsText-NEW">{generateNewPageText()}</h2>
                        </button>
                        {
                            _.isEmpty(pages)
                            ?   null
                            : pages.map((page, pageIdx) => (
                                <OverviewCard
                                    key={page.fileName}
                                    itemIndex={pageIdx}
                                    category={collectionName}
                                    siteName={siteName}
                                    fileName={page.fileName || page.name} // temporary fix
                                    resourceType={isResource ? page.type : ''}
                                    date={page.date}
                                    isResource={isResource}
                                    allCategories={allCategories}
                                    setIsComponentSettingsActive={setIsComponentSettingsActive}
                                    setSelectedFile={setSelectedFile}
                                    setCanShowDeleteWarningModal={setCanShowDeleteWarningModal}
                                />
                            ))
                        }
                    </div>
                    )
                    : 'Loading Pages...'
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
