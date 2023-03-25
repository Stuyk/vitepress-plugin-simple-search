import { titlePlugin } from "@mdit-vue/plugin-title";
import type { MarkdownItEnv } from "@mdit-vue/types";
import * as fs from "fs-extra";
import matter from "gray-matter";
import MarkdownIt from "markdown-it";
import { v4 as uuid } from "uuid";
import { SiteConfig as VPConfig } from "vitepress";
import { IndexedData } from "./types/indexedData";
import { Options } from "./types/options";

let markdownIt!: any;

export function toSearchableText(content: string) {
  return content
    .replaceAll(/<\/?[^>]+(>|$)/g, " ") // remove html tags
    .replaceAll(/{{.*?}}/g, "") // remove vue variables
    .replaceAll("&ZeroWidthSpace;", "") // remove non-printing &ZeroWidthSpace;
    .replaceAll(/\s\s+/g, " ") // remove multiple spaces, tabs, newlines
    .trim(); // remove leading and trailing spaces;
}

export function replaceMdExtension(url: string) {
  const { cleanUrls } = getVPConfig();

  return url.replace(/\.md$/, cleanUrls ? "" : ".html");
}

/**
 * Reads a page from the file system.
 *
 * @param {string} pagePath
 * @returns {Promise<string>}
 */
async function readPage(pagePath: string): Promise<string> {
  const pageContent = await fs.readFile(pagePath, "utf-8");
  return pageContent.toString();
}

/**
 * Gets the vitepress config.
 *
 * @returns {VPConfig}
 */
function getVPConfig(): VPConfig {
  return (global as any).VITEPRESS_CONFIG as VPConfig;
}

/**
 * Gets the markdown renderer.
 * 
 * @todo Use createMarkdownRenderer from vitepress, but build failed with import 'node:fs'.
 * @returns {MarkdownIt}
 */
function getMarkdownRenderer() {
  if (!markdownIt) {
    const { markdown = {} } = getVPConfig();
    markdownIt = MarkdownIt({
      html: true,
      linkify: true,
      ...markdown
    });
    markdownIt.use(titlePlugin);
  }

  return markdownIt;
}

/**
 * Extracts search data from a markdown file.
 *
 * @param {string} page
 * @param {Options} options
 * @returns {Promise<SearchData>}
 */
export async function extractPageData(
  page: string,
  options: Options
): Promise<IndexedData | undefined> {
  const { srcDir } = getVPConfig();

  const pagePath = srcDir + "/" + page;

  const pageContent = await readPage(pagePath);
  const frontMatter = matter(pageContent);

  if (!frontMatter.data?.searchable === false) return undefined;

  const mdRenderer = getMarkdownRenderer();
  const mdEnv: MarkdownItEnv = {};

  const html = mdRenderer.render(frontMatter.content, mdEnv);
  const title = frontMatter.data?.title ?? mdEnv?.title ?? "";

  const indexedData = {
    id: uuid(),
    title,
    text: toSearchableText(html),
    html,
    url: replaceMdExtension(page),
  };

  if (!indexedData.title) console.warn(`No title found for ${page}.`);

  return options.transform ? options.transform(indexedData) : indexedData;
}

/**
 * Builds index info by reading markdown files.
 * Strips content, gets titles, complains about no titles.
 * Returns formatted data.
 *
 * @export
 * @param {Options} options
 * @return {Promise<IndexedData[]>}
 */
export async function buildIndexData(options: Options): Promise<IndexedData[]> {
  const { pages } = getVPConfig();
  const indexedData: IndexedData[] = [];

  await Promise.all(
    pages.map(async (page) => {
      try {
        const pageData = await extractPageData(page, options);

        if (pageData) {
          indexedData.push(pageData);
        }
      } catch (error) {
        console.error(`Error during extract data from page: ${page}.`, {
          error,
        });
      }
    })
  );

  return indexedData;
}
