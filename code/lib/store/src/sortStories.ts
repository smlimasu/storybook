/* eslint-disable camelcase */
import { dedent } from 'ts-dedent';
import type {
  Parameters,
  Addon_Comparator,
  Addon_IndexEntryLegacy,
  Addon_StorySortParameter,
  Addon_StorySortParameterV7,
  Addon_StoryIndexEntry,
  Addon_IndexEntry,
} from '@storybook/types';
import { storySort } from './storySort';
import type { Story, Path } from './types';

const sortStoriesCommon = (
  stories: Addon_IndexEntry[],
  storySortParameter: Addon_StorySortParameterV7,
  fileNameOrder: Path[]
) => {
  if (storySortParameter) {
    let sortFn: Addon_Comparator<any>;
    if (typeof storySortParameter === 'function') {
      sortFn = storySortParameter;
    } else {
      sortFn = storySort(storySortParameter);
    }
    stories.sort(sortFn as (a: Addon_IndexEntry, b: Addon_IndexEntry) => number);
  } else {
    stories.sort(
      (s1, s2) => fileNameOrder.indexOf(s1.importPath) - fileNameOrder.indexOf(s2.importPath)
    );
  }
  return stories;
};

export const sortStoriesV7 = (
  stories: Addon_IndexEntry[],
  storySortParameter: Addon_StorySortParameterV7,
  fileNameOrder: Path[]
) => {
  try {
    return sortStoriesCommon(stories, storySortParameter, fileNameOrder);
  } catch (err) {
    throw new Error(dedent`
    Error sorting stories with sort parameter ${storySortParameter}:

    > ${(err as Error).message}
    
    Are you using a V6-style sort function in V7 mode?

    More info: https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#v7-style-story-sort
  `);
  }
};

const toIndexEntry = (story: any): Addon_StoryIndexEntry => {
  const { id, title, name, parameters, type } = story;
  return { id, title, name, importPath: parameters.fileName, type };
};

export const sortStoriesV6 = (
  stories: [string, Story, Parameters, Parameters][],
  storySortParameter: Addon_StorySortParameter,
  fileNameOrder: Path[]
) => {
  if (storySortParameter && typeof storySortParameter === 'function') {
    stories.sort(
      storySortParameter as (a: Addon_IndexEntryLegacy, b: Addon_IndexEntryLegacy) => number
    );
    return stories.map((s) => toIndexEntry(s[1]));
  }

  const storiesV7 = stories.map((s) => toIndexEntry(s[1]));
  return sortStoriesCommon(
    storiesV7,
    storySortParameter as Addon_StorySortParameterV7,
    fileNameOrder
  );
};
