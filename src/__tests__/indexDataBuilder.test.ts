import { afterAll, beforeAll, describe, expect, test, vi } from "vitest";
import {
  buildIndexData,
  toSearchableText,
  replaceMdExtension,
} from "../indexDataBuilder";
import { DEFAULT_OPTIONS } from "./../index";

beforeAll(async () => {
  vi.stubGlobal("VITEPRESS_CONFIG", {
    root: "/",
    site: {
      base: "/",
    },
    markdown: {},
    srcDir: __dirname,
    pages: ["pages/page_test.md"],
    cleanUrls: true,
  });
});

afterAll(() => {
  vi.restoreAllMocks();
});

describe("Test toSearchableText function", async () => {
  test("toSearchableText should remove html tags", () => {
    const content = `<div>
      <a href="/">Hello world  ! <img src="/" /></a>
      <hr />
    </div>`;

    const expected = "Hello world !";

    expect(
      toSearchableText(content)
    ).toBe(expected);
  });
});

describe("Test replaceMdExtension function", async () => {
  test("replaceMdExtension should replace .md extension from file path", () => {
    const link = "/foo/bar/baz";

    (global as any).VITEPRESS_CONFIG.cleanUrls = true;
    expect(replaceMdExtension(`${link}.md`), "").toBe(link);
    (global as any).VITEPRESS_CONFIG.cleanUrls = false;
    expect(replaceMdExtension(`${link}.md`), ".html").toBe(`${link}.html`);
    (global as any).VITEPRESS_CONFIG.cleanUrls = true;
  });
});

describe("Test buildIndexData function", async () => {
  test("buildIndexData should return an object with the correct properties", async () => {
    const expected = {
      id: expect.any(String),
      title: "Hello World",
      text: "Hello World This is a test",
      html: expect.any(String),
      url: "pages/page_test",
    };

    const indexedData = await buildIndexData(DEFAULT_OPTIONS);

    expect(Object.values(indexedData)[0]).toMatchObject(expected);
  });
});
