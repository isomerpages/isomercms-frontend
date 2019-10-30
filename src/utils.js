// import dependencies
import yaml from 'js-yaml';
import cheerio from 'cheerio';

// extracts yaml front matter from a markdown file path
export function frontMatterParser(content) {
  // format file to extract yaml front matter
  const results = content.split('---');
  const frontMatter = yaml.safeLoad(results[1]); // get the front matter as an object
  const mdBody = results[2];

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

// prepends image src urls so that images are rendered on the right pane
// of the edit pages
export function prependImageSrc(repoName, imagePath, chunk) {
  const $ = cheerio.load(chunk);
  $('img').each((i, elem) => {
    $(elem).attr('src', `https://github.com/isomerpages/${repoName}/blob/staging/${$(elem).attr('src')}?raw=true`);
    return $.html();
  });
}
