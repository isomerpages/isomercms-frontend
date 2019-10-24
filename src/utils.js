import yaml from 'js-yaml';

// extracts yaml front matter from a markdown file path
export default function frontMatterParser(content) {
  // format file to extract yaml front matter
  const results = content.split('---');
  const articleConfig = results[1];
  const articleContent = results[2];

  // get the configs
  const configObj = yaml.safeLoad(articleConfig);

  return {
    configObj,
    articleContent,
  };
}
