import yaml from 'js-yaml';

// extracts yaml front matter from a markdown file path
export default function frontMatterParser(content) {
  // format file to extract yaml front matter
  const results = content.split('---');
  const frontMatter = yaml.safeLoad(results[1]); // get the front matter as an object
  const mdBody = results[2];

  return {
    frontMatter,
    mdBody,
  };
}
