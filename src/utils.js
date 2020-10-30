// import dependencies
import yaml from 'js-yaml';
import cheerio from 'cheerio';
import slugify from 'slugify';

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
    .map((string) => string.charAt(0).toUpperCase() + string.slice(1)) // capitalize first letter
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
// {type} is either `post` or `download`
// {title} is a string containing [a-z,A-Z,0-9] and all whitespaces are replaced by hyphens
export function retrieveResourceFileMetadata(fileName) {
  const fileNameArray = fileName.split('.md')[0];
  const tokenArray = fileNameArray.split('-');
  const day = tokenArray[2];
  const month = monthIntToStr(tokenArray[1]);
  const year = tokenArray[0];
  const date = `${day} ${month} ${year}`;

  const title = tokenArray.slice(3).join(' ');

  return { date, title };
}

export function enquoteString(str) {
  let enquotedString = str;
  if (str[0] !== '"') enquotedString = `"${enquotedString}`;
  if (str[str.length - 1] !== '"') enquotedString += '"';
  return enquotedString;
}

export function dequoteString(str) {
  let dequotedString = str;
  if (str[0] === '"') dequotedString = dequotedString.slice(1);
  if (str[str.length - 1] === '"') dequotedString = dequotedString.slice(0, -1);
  return dequotedString;
}

export function generateResourceFileName(title, date) {
  const safeTitle = slugify(title).replace(/[^a-zA-Z-]/g, '');
  return `${date}-${safeTitle}.md`;
}

export function prettifyResourceCategory(category) {
  return category.replace(/-/g, ' ').toUpperCase();
}

export function slugifyResourceCategory(category) {
  return slugify(category).toLowerCase();
}

export function prettifyPageFileName(fileName) {
  const fileNameArray = fileName.split('.md')[0];
  const tokenArray = fileNameArray.split('-');

  return tokenArray.join(' ');
}

export function prettifyCollectionPageFileName(fileName) {
  const fileNameArray = fileName.split('.md')[0];
  const tokenArray = fileNameArray.split('-');
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

export function retrieveCollectionAndLinkFromPermalink(permalink) {
  const permalinkArray = permalink.split('/')
  let collectionName, editableLink
  if (permalinkArray.length < 2 || permalinkArray[2] === '') {
    // Item has no collection
    collectionName = ''
    editableLink = permalinkArray[1]
  } else {
    collectionName = permalinkArray[1]
    editableLink = permalinkArray.slice(2).join('/')
  }
  return {collectionName, editableLink}
}