// import dependencies
import yaml from 'js-yaml';
import cheerio from 'cheerio';
import slugify from 'slugify';
import axios from 'axios';
import { Base64 } from 'js-base64';
import _ from 'lodash';

// axios settings
axios.defaults.withCredentials = true

// Constants
const ALPHANUM_REGEX = /^[0-9]+[a-z]*$/ // at least one number, followed by 0 or more lower-cased alphabets
const NUM_REGEX = /^[0-9]+$/
const NUM_IDENTIFIER_REGEX = /^[0-9]+/
export const DEFAULT_ERROR_TOAST_MSG = 'Please try again or check your internet connection.'

// extracts yaml front matter from a markdown file path
export function frontMatterParser(content) {
  // format file to extract yaml front matter
  const results = content.split('---');
  const frontMatter = yaml.safeLoad(results[1]); // get the front matter as an object
  const mdBody = results.slice(2).join('---');

  return {
    frontMatter,
    mdBody,
  };
}

// this function concatenates the front matter with the main content body
// of the markdown file
export function concatFrontMatterMdBody(frontMatter, mdBody) {
  return ['---\n', yaml.safeDump(frontMatter), '---\n', mdBody].join('');
}

// this function converts file names into readable form
// for example, '0-this-is-a-file.md' -> 'This Is A File'
export function deslugifyCollectionPage(collectionPageName) {
  return collectionPageName
    .split('.')[0] // remove the file extension
    .split('-').slice(1) // remove the number at the start
    .map(string => _.upperFirst(string)) // capitalize first letter
    .join(' '); // join it back together
}

// this function converts directories into readable form
// for example, 'this-is-a-directory' -> 'This Is A Directory'
export function deslugifyDirectory(dirName) {
  return dirName
    .split('-')
    .map(string => _.upperFirst(string)) // capitalize first letter
    .join(' '); // join it back together
}

// this function converts file names into readable form
// for example, 'this-is-a-file.md' -> 'This Is A File'
export function deslugifyPage(pageName) {
  return pageName
    .split('.')[0] // remove the file extension
    .split('-')
    .map(string => _.upperFirst(string)) // capitalize first letter
    .join(' '); // join it back together
}


// takes a string URL and returns true if the link is an internal link
// only works on browser side
export function isLinkInternal(url) {
  const tempLink = document.createElement('a');
  tempLink.href = url;
  return tempLink.hostname === window.location.hostname;
}

// takes in a permalink and returns a URL that links to the image on the staging branch of the repo
export function prependImageSrc(repoName, chunk) {
  const $ = cheerio.load(chunk);
  $('img').each((i, elem) => {
    // check for whether the original image source is from within Github or outside of Github
    // only modify URL if it's a permalink on the website
    if (isLinkInternal($(elem).attr('src'))) {
      $(elem).attr('src', `https://raw.githubusercontent.com/isomerpages/${repoName}/staging${$(elem).attr('src')}?raw=true`);
    }
    // change src to placeholder image if images not found
    $(elem).attr('onerror', "this.onerror=null; this.src='/placeholder_no_image.png';") 
  });
  return $.html();
}

export function changeFileName(event, context) {
  context.setState({
    tempFileName: event.target.value,
  });
}

const monthMap = {
  '01': 'Jan',
  '02': 'Feb',
  '03': 'Mar',
  '04': 'Apr',
  '05': 'May',
  '06': 'Jun',
  '07': 'Jul',
  '08': 'Aug',
  '09': 'Sep',
  10: 'Oct',
  11: 'Nov',
  12: 'Dec',
};

function monthIntToStr(monthInt) {
  return monthMap[monthInt];
}

// Takes in a resource file name and retrieves the date, type, and title of the resource.
// =================
// Each fileName comes in the format of `{date}-{type}-{title}.md`
// A sample fileName is 2019-08-23-post-CEO-made-a-speech.md
// {date} is YYYY-MM-DD, e.g. 2019-08-23
// {type} is either `post` or `file`
// {title} is a string containing [a-z,A-Z,0-9] and all whitespaces are replaced by hyphens
export function retrieveResourceFileMetadata(fileName) {
  const fileNameArray = fileName.split('.md')[0];
  const tokenArray = fileNameArray.split('-');
  const date = tokenArray.slice(0,3).join('-');

  const type = ['file', 'post'].includes(tokenArray[3]) ? tokenArray[3] : undefined

  const titleTokenArray = type ? tokenArray.slice(4) : tokenArray.slice(3);
  const prettifiedTitleTokenArray = titleTokenArray.map((token) => {
    // We search for special characters which were converted to text
    // Convert dollar back to $ if it is followed by any alphanumeric character
    const convertedToken = token.replaceAll(/dollar(?=([0-9]))/g, '$')
    if (convertedToken.length < 2) return convertedToken.toUpperCase()
    return convertedToken.slice(0,1).toUpperCase() + convertedToken.slice(1)
  });
  const title = prettifiedTitleTokenArray.join(' ')

  return { date, type, title };
}

export function prettifyDate(date) {
  const tokenArray = date.split('-');
  const day = tokenArray[2];
  const month = monthIntToStr(tokenArray[1]);
  const year = tokenArray[0];
  return `${day} ${month} ${year}`;
}

// function recursively checks if all child object values are empty
// note that {a: '', b: {c: ''}, d: [ {e: ''}, {f: [ {g: ''} ]} ]} returns true
export function isEmpty(obj) {
  let isEmptyVal = true;
  for (var key in obj) {
    if (typeof obj[key] === "object" && obj.hasOwnProperty(key)) {
      isEmptyVal = isEmptyVal && isEmpty(obj[key]);
    } else {
      if (obj[key] !== "" && obj[key] !== null) {
        isEmptyVal = false;
      }
    }
  }
  return isEmptyVal
}

export function dequoteString(str) {
  let dequotedString = str;
  if (str[0] === '"') dequotedString = dequotedString.slice(1);
  if (str[str.length - 1] === '"') dequotedString = dequotedString.slice(0, -1);
  return dequotedString;
}

export function generateResourceFileName(title, date, resourceType) {
  const safeTitle = slugify(title).replace(/[^a-zA-Z0-9-]/g, '');
  return `${date}-${resourceType}-${safeTitle}.md`;
}

export function prettifyResourceCategory(category) {
  return category.replace(/-/g, ' ').toUpperCase();
}

export function slugifyCategory(category) {
  return slugify(category).replace(/[^a-zA-Z0-9-]/g, '').toLowerCase();
}

export function prettifyPageFileName(fileName) {
  const fileNameArray = fileName.split('.md')[0];
  const tokenArray = fileNameArray.split('-').map((token) => {
    if (token.length < 2) return token.toUpperCase()
    return token.slice(0,1).toUpperCase() + token.slice(1)
  });

  return tokenArray.join(' ');
}

export function prettifyCollectionPageFileName(fileName) {
  const fileNameArray = fileName.split('.md')[0];
  const tokenArray = fileNameArray.split('-').map((token) => {
    if (token.length < 2) return token.toUpperCase()
    return token.slice(0,1).toUpperCase() + token.slice(1)
  });
  return tokenArray.slice(1).join(' ');
}

export function generatePageFileName(title) {
  return `${slugify(title).replace(/[^a-zA-Z0-9-]/g, '')}.md`;
}

export function generateCollectionPageFileName(title, groupIdentifier) {
  return `${groupIdentifier}-${slugify(title).replace(/[^a-zA-Z0-9-]/g, '')}.md`;
}

export function generatePermalink(title) {
  return slugify(title).replace(/[^a-zA-Z0-9-]/g, '').toLowerCase();
}

export function slugifyLower(str) {
  return slugify(str, {lower: true})
}

export function retrieveCollectionAndLinkFromPermalink(permalink) {
  const permalinkArray = permalink.split('/')
  let collectionName, editableLink
  if (permalinkArray.length <= 2 || permalinkArray[2] === '') {
    // Item has no collection
    collectionName = ''
    editableLink = permalinkArray[1]
  } else if (permalinkArray.length >= 4 && permalinkArray[3] !== '') {
    // Item is a 3rd nav
    collectionName = permalinkArray.slice(1,3).join('/')
    editableLink = permalinkArray[3]
  } else {
    collectionName = permalinkArray[1]
    editableLink = permalinkArray[2]
  }
  return {collectionName, editableLink}
}

export async function saveFileAndRetrieveUrl(fileInfo) {
  const {
    // state params
    title,
    permalink,
    fileUrl,
    date,
    mdBody,
    sha,
    category,
    originalThirdNavTitle,
    thirdNavTitle,
    thirdNavOptions,
    // props
    originalCategory,
    collectionPageData,
    type,
    resourceType,
    fileName,
    isNewFile,
    siteName,
    isNewCollection,
  } = fileInfo

  let slugifiedCategory
  if (isNewCollection) slugifiedCategory = slugifyCategory(category)
  else slugifiedCategory = category

  const baseApiUrl = `${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}${originalCategory ? type === "resource" ? `/resources/${originalCategory}` : `/collections/${originalCategory}` : ''}`
  const newBaseApiUrl = `${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}${category ? type === "resource" ? `/resources/${slugifiedCategory}` : `/collections/${slugifiedCategory}` : ''}`
  let newFileName, frontMatter
  if (type === "resource") {
    newFileName = generateResourceFileName(title.toLowerCase(), date, resourceType);
    frontMatter = { title, date };
  } else if (type === "page") {
    frontMatter = thirdNavTitle
      ? { title, permalink, third_nav_title: thirdNavTitle }
      : { title, permalink };

    // Creating a collection page
    if (slugifiedCategory) {
      newFileName = await generateNewCollectionFileName({
        fileName,
        originalThirdNavTitle,
        thirdNavTitle,
        thirdNavOptions,
        collectionPageData,
        baseApiUrl: newBaseApiUrl,
        title: title.toLowerCase(),
        siteName,
        category: slugifiedCategory,
        isNewCollection,
        isNewFile,
        originalCategory,
        newBaseApiUrl,
      })
    // Creating a simple page
    } else {
      newFileName = generatePageFileName(title.toLowerCase());
    }
  }
  console.log('This is the new file name', newFileName)

  if (permalink) {
    frontMatter.permalink = permalink;
  }
  if (fileUrl) {
    frontMatter.file_url = fileUrl;
  }

  const content = concatFrontMatterMdBody(frontMatter, mdBody);
  const base64EncodedContent = Base64.encode(content);

  let params = {};
  if (newFileName !== fileName || originalCategory !== category) {
    // We'll need to create a new .md file with a new filename
    params = {
      content: base64EncodedContent,
      pageName: newFileName,
    };
    await axios.post(`${newBaseApiUrl}/pages`, params);
    // If it is an existing file, delete the existing page
    if (!isNewFile) {
      await axios.delete(`${baseApiUrl}/pages/${fileName}`, {
        data: {
          sha,
        },
      });
    }
  } else {
    // Save to existing .md file
    params = {
      content: base64EncodedContent,
      sha,
    };
    await axios.post(`${newBaseApiUrl}/pages/${fileName}`, params);
  }
  let newPageUrl
  if (type === 'resource') {
    if (resourceType === 'file') {
      newPageUrl = `/sites/${siteName}/resources/${slugifiedCategory}`
    } else {
      newPageUrl = `/sites/${siteName}/resources/${slugifiedCategory}/${newFileName}`
    }
  } else if (type === 'page') {
    newPageUrl = slugifiedCategory ? `/sites/${siteName}/collections/${slugifiedCategory}/${newFileName}` : `/sites/${siteName}/pages/${newFileName}`
  }
  return newPageUrl
}

/*
 * Util functions for generating file identifiers (the numeric/alphanumeric strings which filenames begin with)
 */

// Generate new filename when creating page in a collection
const generateNewCollectionFileName = async ({
  fileName,
  originalThirdNavTitle,
  thirdNavTitle,
  thirdNavOptions,
  collectionPageData,
  baseApiUrl,
  title,
  siteName,
  category,
  isNewCollection,
  isNewFile,
  originalCategory,
  newBaseApiUrl
}) => {
  let newFileName
  if (isNewCollection) {
    const groupIdentifier = await generateGroupIdentifier(null, false, null, thirdNavTitle ? true : false, thirdNavTitle, true)
    newFileName = generateCollectionPageFileName(title, groupIdentifier);
  } else if (originalCategory !== category) {
    // Page is being moved
    const groupIdentifier = await generateGroupIdentifier(collectionPageData, false, newBaseApiUrl)
    newFileName = generateCollectionPageFileName(title, groupIdentifier);
  }
  // New file name is also dependent on whether the file has been moved into or out of a third nav
  else if (originalThirdNavTitle !== thirdNavTitle && collectionPageData) {
    // Case: Move from within a third nav section to outside of it within the collection
    if (!thirdNavTitle) {
      const groupIdentifier = await generateGroupIdentifier(collectionPageData, false, baseApiUrl)
      newFileName = generateCollectionPageFileName(title, groupIdentifier);

    } else {
      // Assumption: third nav titles are unique
      const thirdNavSection = collectionPageData.filter((section) => section.type === 'third-nav' && section.title === thirdNavTitle)

      let groupIdentifier
      // Case: Create a new third nav section
      if (thirdNavSection.length === 0) {
        groupIdentifier = await generateGroupIdentifier(collectionPageData, true, baseApiUrl, true)

      // Case: Move from outside of third nav into a third nav OR
      // Case: Move from one third nav section into another third nav section
      } else {
        // Move the file to be the last file in the third nav
        groupIdentifier = await generateGroupIdentifier(thirdNavSection[0].contents, true, baseApiUrl)
      }

      newFileName = generateCollectionPageFileName(title, groupIdentifier);
    }
  } else if (originalThirdNavTitle === thirdNavTitle && collectionPageData) {
    if (isNewFile) {
      // Case: Creating a new page from within a collection
      const groupIdentifier = await generateGroupIdentifier(collectionPageData, false, baseApiUrl)
      newFileName = generateCollectionPageFileName(title, groupIdentifier);
    } else {
      // Case: renaming/changing details of existing file in collection
      // We can resuse the existing identifier
      const groupIdentifier = fileName.split('-')[0]
      newFileName = generateCollectionPageFileName(title, groupIdentifier);
    }
  } else {
    // Case: Creating a new page from the workspace and assigning to collection BUT not third nav
    if (!originalThirdNavTitle && !thirdNavTitle) {
      const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/collections/${category}`
      const groupIdentifier = await generateGroupIdentifier(null, false, apiUrl)
      newFileName = generateCollectionPageFileName(title, groupIdentifier);

    // Case: Creating a new page from the workspace and assigning to collection AND third nav
    } else if (!collectionPageData && thirdNavTitle) {
      const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/collections/${category}/pages`

      let groupIdentifier
      // Assigning to existing third nav
      if (thirdNavOptions.includes(thirdNavTitle)) {
        groupIdentifier = await generateGroupIdentifier(null, true, apiUrl, false, thirdNavTitle)

      // Create new third nav and assign to it
      } else {
        groupIdentifier = await generateGroupIdentifier(null, false, apiUrl, true, thirdNavTitle)
      }
      newFileName = generateCollectionPageFileName(title, groupIdentifier);
    }
  }

  return newFileName
}

// Accepts an array of objects (pageArray) with attribute `fileName` and returns an incremented file identifier
const generateGroupIdentifier = async (pageArray, shouldAddToThirdNav, baseApiUrl, shouldCreateThirdNav, thirdNavTitle, isNewCollection) => {
  if (isNewCollection) {
    return incrementGroupIdentifier(null, false, shouldCreateThirdNav)
  }

  if (pageArray) {
    return incrementGroupIdentifier(pageArray, shouldAddToThirdNav, shouldCreateThirdNav)
  }

  const { data: { collectionPages } } = await axios.get(baseApiUrl)

  // Case: when creating a page from Workspace and assigning to a collection + third nav
  if (shouldAddToThirdNav && thirdNavTitle) {
    // Assumption: third nav titles are unique
    const thirdNavSection = collectionPages.filter((section) => section.type === 'third-nav' && section.title === thirdNavTitle)
    return incrementGroupIdentifier(thirdNavSection[0].contents, true)
  }

  // Case: when creating a page from Workspace and assigning to a collection + creating a new third nav
  if (shouldCreateThirdNav && thirdNavTitle) {
    return incrementGroupIdentifier(collectionPages, false, true)
  }

  // Case: when creating a page from Workspace and assigning to a collection BUT not third nav
  return incrementGroupIdentifier(collectionPages, false)
}

const incrementAlphabetString = (alphaString) => {
  const lastChar = alphaString[alphaString.length - 1]
  if (lastChar === 'z') return alphaString + 'a'

  const firstToSecondLastChar = alphaString.slice(0, alphaString.length - 1)
  return firstToSecondLastChar + nextChar(lastChar)
}

const nextChar = (c) => {
  return String.fromCharCode(c.charCodeAt(0) + 1);
}

const incrementGroupIdentifier = (pageArray, shouldAddToThirdNav, shouldCreateThirdNav) => {
  // New collection being created
  if (_.isEmpty(pageArray)) {
    if (shouldCreateThirdNav) return '0a'
    return '0'
  }

  const lastElem = pageArray[pageArray.length - 1]
  const lastFileName = (lastElem.type !== 'third-nav')
    ? lastElem.fileName
    : lastElem.contents[lastElem.contents.length - 1].fileName
  const lastFileNameArr = lastFileName.split('-')

  // If none of the previous elements were named alphanumerically
  if (!lastFileNameArr[0].match(ALPHANUM_REGEX)) return '0'

  // If identifier is just a number with no alphabets (for example, 1)
  const lastFileNameIdentifier = lastFileNameArr[0]
  if (lastFileNameIdentifier.match(NUM_REGEX)) {
    // Check whether it's a new third nav
    if (shouldCreateThirdNav) return (parseInt(lastFileNameIdentifier) + 1).toString() + 'a' // first element in a new third nav section

    return (parseInt(lastFileNameIdentifier) + 1).toString() // increment identifier by 1
  }

  const lastFileNameIdentifierNum = lastFileNameIdentifier.match(NUM_IDENTIFIER_REGEX)[0]
  const lastFileNameIdentifierAlpha = lastFileNameIdentifier.slice(lastFileNameIdentifierNum.length)

  // Again, check whether it's a new third nav
  // If last file in collection is part of third nav, we need to increment only the number. For example, if last file is 
  // 2c-<title>.md, the new third nav file should be 3a-<title>.md
  if (shouldCreateThirdNav) return (parseInt(lastFileNameIdentifierNum) + 1).toString() + 'a'

  /*
   * When the identifier is alphanumeric
   */

  // If identifier is alphanumeric, and you just want to increment the identifier's alphabet portion (for example, from 3a to 3b)
  // When adding to a third nav
  if (shouldAddToThirdNav) return lastFileNameIdentifierNum + incrementAlphabetString(lastFileNameIdentifierAlpha) // increment alphabet

  // If identifier is alphanumeric, but you want to increment to just a number (for example, from 2b to 3)
  // When not adding to a third nav
  return (parseInt(lastFileNameIdentifierNum) + 1).toString()
}

export const checkIsOutOfViewport = (bounding, posArr) => {
  // Checks if the element exceeds viewport in any of the dimensions given in posArr
  let out = {};
	out.top = bounding.top < 0;
	out.left = bounding.left < 0;
	out.bottom = bounding.bottom > (window.innerHeight || document.documentElement.clientHeight);
  out.right = bounding.right > (window.innerWidth || document.documentElement.clientWidth);
  
  return posArr.some((pos) => {return out[pos]})
}

export const getObjectDiff = (obj1, obj2) => {
  const allkeys = _.union(_.keys(obj1), _.keys(obj2));
  const difference = _.reduce(allkeys, function (result, key) {
    if ( !_.isEqual(obj1[key], obj2[key]) ) {
      result[key] = {obj1: obj1[key], obj2: obj2[key]}
    }
    return result;
  }, {});
  return difference
}

export const parseDirectoryFile = (folderContent) => {
  const decodedContent = yaml.safeLoad(Base64.decode(folderContent))
  const collectionKey = Object.keys(decodedContent.collections)[0]
  return decodedContent.collections[collectionKey].order
}

export const updateDirectoryFile = (folderContent, folderOrder) => {
  const decodedContent = yaml.safeLoad(Base64.decode(folderContent))
  const collectionKey = Object.keys(decodedContent.collections)[0]
  decodedContent.collections[collectionKey].order = folderOrder
  return Base64.encode(yaml.safeDump(decodedContent))
}

export const convertFolderOrderToArray = (folderOrder) => {
  let currFolderEntry = {}
  return folderOrder.reduce((acc, curr, currIdx) => {
      const folderPathArr = curr.split('/')
      if (folderPathArr.length === 1) {
          if (JSON.stringify(currFolderEntry) !== '{}') acc.push(currFolderEntry)
          currFolderEntry = {}
          acc.push({
              type: 'file',
              path: curr,
              title: curr,
          })
      }

      if (folderPathArr.length > 1) {
          const subfolderTitle = folderPathArr[0]

          // Start of a new subfolder section
          if (currFolderEntry.title !== subfolderTitle) {
              // Case: two consecutive subfolders - transitioning from one to the other
              if (currFolderEntry.title && currFolderEntry.title !== subfolderTitle) {
                  acc.push(currFolderEntry)
              }

              currFolderEntry = {
                type: 'dir',
                title: subfolderTitle,
                path: curr,
                children: [curr],
              }
          } else {
              currFolderEntry.children.push(curr)
          }

          // last entry
          if (currIdx === folderOrder.length - 1) acc.push(currFolderEntry)
      }

      return acc
  }, [])
}

export const convertArrayToFolderOrder = (array) => {
  const updatedFolderOrder = array.map(({ type, children, path }) => {
    if (type == 'dir') return children
    if (type == 'file') return path
  })
  return _.flatten(updatedFolderOrder)
}

export const retrieveSubfolderContents = (folderOrder, subfolderName) => {
  return folderOrder.reduce((acc, curr) => {
    const folderPathArr = curr.split('/')
    if (folderPathArr.length === 2) {
      const [subfolderTitle, subfolderFileName] = folderPathArr
      if (subfolderTitle === subfolderName) {
        acc.push({
          type: 'file',
          path: curr,
          title: subfolderFileName,
        })
      }
    }
    return acc
  }, [])
}

export const convertSubfolderArray = (folderOrderArray, rawFolderContents, subfolderName) => {
  const arrayCopy = _.cloneDeep(folderOrderArray)
  return rawFolderContents.map((curr) => {
    const folderPathArr = curr.split('/')
    const subfolderTitle = folderPathArr[0]
    if (folderPathArr.length === 2 && subfolderTitle === subfolderName) {
      const { path } = arrayCopy.shift()
      return path
    }
    return curr
  })
} 