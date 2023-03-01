import * as fs from 'fs-extra';
import glob from 'glob';
import matter from 'gray-matter';
import { getOptions } from './options';
import { FileSearchData } from './types/fileSearchData';

/**
 * Strips content of lots of garabage.
 *
 * @param {string} content
 * @return {string}
 */
function cleanupContent(content: string): string {
    const options = getOptions();
    if (typeof options.regexForContentStripping === 'undefined') {
        return content;
    }

    return content.replace(options.regexForContentStripping, '').toLowerCase();
}

/**
 * Builds document info by reading markdown files.
 * Strips content, gets titles, complains about no titles.
 * Returns formatted data.
 *
 * @export
 * @param {string} folder
 * @param {string} [baseURL='']
 * @return {Promise<FileSearchData>}
 */
export async function buildDocumentation(folder: string, transformer: any => any): Promise<FileSearchData> {
    const files = glob.sync(`${folder}/**/*.md`.replace(/\\/gm, '/'));
    const fileInfo: Array<{ title: string; content: string; link: string }> = [];
    const options = getOptions();

    for (let file of files) {
        if (file.includes('node_modules')) {
            continue;
        }

        if (options.partialsToIgnore && options.partialsToIgnore.length >= 1) {
            const partialIndex = options.partialsToIgnore.findIndex((partialName) => file.includes(partialName));
            if (partialIndex !== -1) {
                continue;
            }
        }

        const data = fs.readFileSync(file).toString();
        const frontMatter = matter(data);
        const frontMatterData = transformer(frontMatter.data);

        if (typeof frontMatterData['title'] === 'undefined') {
            console.warn(`${file} does not have a 'title' for building search index.`);
        }

        const baseURL = options.baseURL ? options.baseURL : '';
        fileInfo.push({
            title: frontMatterData.title,
            content: cleanupContent(frontMatter.content),
            link: file.replace(/.*docs/gm, baseURL).replace('.md', ''),
        });
    }

    return fileInfo;
}
