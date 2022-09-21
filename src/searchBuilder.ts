import * as fs from 'fs-extra';
import glob from 'glob';
import matter from 'gray-matter'

/**
 * Strips content of lots of garabage.
 *
 * @param {string} content
 * @return {string} 
 */
function cleanupContent(content: string): string {
  let newContent = content.replace(/\s+$/gm, '');
  newContent = newContent.replace(/\{\{.*\}}/gm, '');
  newContent = newContent.replace(/\#/gm, '');
  newContent = newContent.replace(/\:\:\:/gm, '');
  newContent = newContent.replace(/\!\[].*\)/gm, '');
  return newContent;
}

/**
 * Builds document info by reading markdown files.
 * Strips content, gets titles, complains about no titles.
 * Returns formatted data.
 *
 * @export
 * @param {string} folder
 * @param {string} [baseURL='']
 * @return {Promise<Array<{title: string, content: string, link: string}>>}
 */
export async function buildDocumentation(folder: string, baseURL: string = ''): Promise<Array<{title: string, content: string, link: string}>> {
  if (baseURL.length >= 1 && baseURL.charAt(baseURL.length - 1) === '/') {
    baseURL = baseURL.slice(0, baseURL.length - 1);
  }
  
  const files = glob.sync(`${folder}/**/*.md`.replace(/\\/gm, '/'));
  const fileInfo: Array<{ title: string, content: string, link: string }> = [];

  for(let file of files) {
    const data = fs.readFileSync(file).toString();
    const frontMatter = matter(data)

    if (typeof frontMatter.data['title'] === 'undefined') {
      console.warn(`${file} does not have a 'title' for building search index.`);
    }

    fileInfo.push({ title: frontMatter.data.title, content: cleanupContent(frontMatter.content), link: file.replace(/.*docs/gm, '').replace('.md', baseURL) });
  }

  return fileInfo;
}