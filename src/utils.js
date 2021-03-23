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
export const DEFAULT_RETRY_MSG = 'Please try again or check your internet connection'
export const DEFAULT_ERROR_TOAST_MSG = `Something went wrong. ${DEFAULT_RETRY_MSG}`

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
  return `${slugify(title, {lower: true}).replace(/[^a-zA-Z0-9-]/g, '')}.md`;
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

function generateCollectionPageContent(fileInfo) {
  const {
    siteName,
    title,
    permalink,
    mdBody,
    folderName,
    subfolderName,
    isNewPage,
    originalPageName,
  } = fileInfo
  const frontMatter = subfolderName
    ? { title, permalink, third_nav_title: subfolderName }
    : { title, permalink }
  const content = concatFrontMatterMdBody(frontMatter, mdBody)
  const fileName = subfolderName 
    ? `${subfolderName}/${generatePageFileName(title)}` 
    : `${generatePageFileName(title)}`

  let endpointUrl, redirectUrl = ''
  if (isNewPage) {
    endpointUrl = `${siteName}/collections/${folderName}/pages/new/${encodeURIComponent(fileName)}`
    redirectUrl = `/sites/${siteName}/collections/${folderName}/${encodeURIComponent(fileName)}`
  } else if (originalPageName !== fileName) {
    endpointUrl = `${siteName}/collections/${folderName}/pages/${encodeURIComponent(originalPageName)}/rename/${encodeURIComponent(fileName)}`
  } else {
    endpointUrl = `${siteName}/collections/${folderName}/pages/${encodeURIComponent(fileName)}`
  }
  return { endpointUrl, content, redirectUrl }
}

function generateUnlinkedPageContent(fileInfo) {
  const {
    siteName,
    title,
    permalink,
    mdBody,
    isNewPage,
    originalPageName,
  } = fileInfo

  const frontMatter = { title, permalink }
  const content = concatFrontMatterMdBody(frontMatter, mdBody)
  const fileName = `${generatePageFileName(title)}`

  let endpointUrl, redirectUrl = ''
  if (isNewPage) {
    endpointUrl = `${siteName}/pages/new/${encodeURIComponent(fileName)}`
    redirectUrl = `/sites/${siteName}/pages/${encodeURIComponent(fileName)}`
  } else if (originalPageName !== fileName) {
    endpointUrl = `${siteName}/pages/${encodeURIComponent(originalPageName)}/rename/${encodeURIComponent(fileName)}`
  } else { //update page
    endpointUrl = `${siteName}/pages/${encodeURIComponent(fileName)}`
  }
  return { endpointUrl, content, redirectUrl }
}

export function generatePageContent(fileInfo) {
  const { pageType } = fileInfo
  if (pageType === 'collection') return generateCollectionPageContent(fileInfo)
  if (pageType === 'page') return generateUnlinkedPageContent(fileInfo)
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
  const decodedContent = yaml.safeLoad(folderContent)
  const collectionKey = Object.keys(decodedContent.collections)[0]
  return decodedContent.collections[collectionKey].order
}

export const updateDirectoryFile = (folderContent, folderOrder) => {
  const decodedContent = yaml.safeLoad(folderContent)
  const collectionKey = Object.keys(decodedContent.collections)[0]
  decodedContent.collections[collectionKey].order = folderOrder
  return yaml.safeDump(decodedContent)
}

export const getNavFolderDropdownFromFolderOrder = (folderOrder) => {
  return folderOrder.reduce((acc, curr) => {
    const pathArr = curr.split('/') // sample paths: "prize-sponsor.md", "prize-jury/nominating-committee.md"

    if (pathArr.length === 1) {
      acc.push(deslugifyDirectory(curr.split('.')[0])) // remove file extension
    }

    if (pathArr.length === 2 && deslugifyDirectory(pathArr[0]) !== acc[acc.length - 1]) {
      acc.push(deslugifyDirectory(pathArr[0]))
    }

    return acc
  }, [])
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
              name: curr,
          })
      }

      if (folderPathArr.length > 1) {
          const subfolderTitle = folderPathArr[0]

          // Start of a new subfolder section
          if (currFolderEntry.name !== subfolderTitle) {
              // Case: two consecutive subfolders - transitioning from one to the other
              if (currFolderEntry.name && currFolderEntry.name !== subfolderTitle) {
                  acc.push(currFolderEntry)
              }

              currFolderEntry = {
                type: 'dir',
                name: subfolderTitle,
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
    if (type === 'dir') return children
    if (type === 'file') return path
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
          name: subfolderFileName,
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