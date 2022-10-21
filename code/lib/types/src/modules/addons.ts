import type { RenderData as RouterData } from '@storybook/router';
import type { ThemeVars } from '@storybook/theming';
import type { API } from '@storybook/api';
import type { types } from '@storybook/addons';

/* eslint-disable camelcase */
import type {
  AnyFramework,
  InputType,
  StoryContext as StoryContextForFramework,
  LegacyStoryFn as LegacyStoryFnForFramework,
  PartialStoryFn as PartialStoryFnForFramework,
  ArgsStoryFn as ArgsStoryFnForFramework,
  StoryFn as StoryFnForFramework,
  DecoratorFunction as DecoratorFunctionForFramework,
  LoaderFunction as LoaderFunctionForFramework,
  StoryId,
  StoryKind,
  StoryName,
  Args,
  ComponentTitle,
} from '@storybook/types';

export type Addon_Types = types | string;

export interface Addon_ArgType<TArg = unknown> extends InputType {
  defaultValue?: TArg;
}

export type Addons_ArgTypes<TArgs = Args> = {
  [key in keyof Partial<TArgs>]: Addon_ArgType<TArgs[key]>;
} & {
  // for custom defined args
  [key in string]: Addon_ArgType<unknown>;
};

export type Addon_Comparator<T> = ((a: T, b: T) => boolean) | ((a: T, b: T) => number);
export type Addon_StorySortMethod = 'configure' | 'alphabetical';
export interface Addon_StorySortObjectParameter {
  method?: Addon_StorySortMethod;
  order?: any[];
  locales?: string;
  includeNames?: boolean;
}

export type Addon_Path = string;
export interface Addon_BaseIndexEntry {
  id: StoryId;
  name: StoryName;
  title: ComponentTitle;
  importPath: Addon_Path;
}
export type Addon_StoryIndexEntry = Addon_BaseIndexEntry & {
  type: 'story';
};

export type Addon_DocsIndexEntry = Addon_BaseIndexEntry & {
  storiesImports: Addon_Path[];
  type: 'docs';
  standalone: boolean;
};

/** A StandaloneDocsIndexExtry represents a file who's default export is directly renderable */
export type Addon_StandaloneDocsIndexEntry = Addon_DocsIndexEntry & { standalone: true };
/** A TemplateDocsIndexEntry represents a stories file that gets rendered in "docs" mode */
export type Addon_TemplateDocsIndexEntry = Addon_DocsIndexEntry & { standalone: false };

export type Addon_IndexEntry = Addon_StoryIndexEntry | Addon_DocsIndexEntry;

// The `any` here is the story store's `StoreItem` record. Ideally we should probably only
// pass a defined subset of that full data, but we pass it all so far :shrug:
export type Addon_IndexEntryLegacy = [StoryId, any, Addon_Parameters, Addon_Parameters];
export type Addon_StorySortComparator = Addon_Comparator<Addon_IndexEntryLegacy>;
export type Addon_StorySortParameter = Addon_StorySortComparator | Addon_StorySortObjectParameter;
export type Addon_StorySortComparatorV7 = Addon_Comparator<Addon_IndexEntry>;
export type Addon_StorySortParameterV7 =
  | Addon_StorySortComparatorV7
  | Addon_StorySortObjectParameter;

// TODO: remove all these types, they belong in the renderer and csf-package

export interface Addon_OptionsParameter extends Object {
  storySort?: Addon_StorySortParameter;
  theme?: {
    base: string;
    brandTitle?: string;
  };
  [key: string]: any;
}

export interface Addon_Parameters {
  fileName?: string;
  options?: Addon_OptionsParameter;
  /** The layout property defines basic styles added to the preview body where the story is rendered. If you pass 'none', no styles are applied. */
  layout?: 'centered' | 'fullscreen' | 'padded' | 'none';
  docsOnly?: boolean;
  [key: string]: any;
}

export type Addon_StoryContext<TFramework extends AnyFramework = AnyFramework> =
  StoryContextForFramework<TFramework>;
export type Addon_StoryContextUpdate = Partial<Addon_StoryContext>;

type Addon_ReturnTypeFramework<ReturnType> = { component: any; storyResult: ReturnType };
export type Addon_PartialStoryFn<ReturnType = unknown> = PartialStoryFnForFramework<
  Addon_ReturnTypeFramework<ReturnType>
>;
export type Addon_LegacyStoryFn<ReturnType = unknown> = LegacyStoryFnForFramework<
  Addon_ReturnTypeFramework<ReturnType>
>;
export type Addon_ArgsStoryFn<ReturnType = unknown> = ArgsStoryFnForFramework<
  Addon_ReturnTypeFramework<ReturnType>
>;
export type Addon_StoryFn<ReturnType = unknown> = StoryFnForFramework<
  Addon_ReturnTypeFramework<ReturnType>
>;

export type Addon_DecoratorFunction<StoryFnReturnType = unknown> = DecoratorFunctionForFramework<
  Addon_ReturnTypeFramework<StoryFnReturnType>
>;
export type Addon_LoaderFunction = LoaderFunctionForFramework<Addon_ReturnTypeFramework<unknown>>;

export interface Addon_WrapperSettings {
  options: object;
  parameters: {
    [key: string]: any;
  };
}

export type Addon_StoryWrapper = (
  storyFn: Addon_LegacyStoryFn,
  context: Addon_StoryContext,
  settings: Addon_WrapperSettings
) => any;

export type Addon_MakeDecoratorResult = (...args: any) => any;

export interface Addon_AddStoryArgs<StoryFnReturnType = unknown> {
  id: StoryId;
  kind: StoryKind;
  name: StoryName;
  storyFn: Addon_StoryFn<StoryFnReturnType>;
  parameters: Addon_Parameters;
}

export interface Addon_ClientApiAddon<StoryFnReturnType = unknown> extends Addon_Type {
  apply: (a: Addon_StoryApi<StoryFnReturnType>, b: any[]) => any;
}
export interface Addon_ClientApiAddons<StoryFnReturnType> {
  [key: string]: Addon_ClientApiAddon<StoryFnReturnType>;
}

export type Addon_ClientApiReturnFn<StoryFnReturnType = unknown> = (
  ...args: any[]
) => Addon_StoryApi<StoryFnReturnType>;

export interface Addon_StoryApi<StoryFnReturnType = unknown> {
  kind: StoryKind;
  add: (
    storyName: StoryName,
    storyFn: Addon_StoryFn<StoryFnReturnType>,
    parameters?: Addon_Parameters
  ) => Addon_StoryApi<StoryFnReturnType>;
  addDecorator: (
    decorator: Addon_DecoratorFunction<StoryFnReturnType>
  ) => Addon_StoryApi<StoryFnReturnType>;
  addLoader: (decorator: Addon_LoaderFunction) => Addon_StoryApi<StoryFnReturnType>;
  addParameters: (parameters: Addon_Parameters) => Addon_StoryApi<StoryFnReturnType>;
  [k: string]: string | Addon_ClientApiReturnFn<StoryFnReturnType>;
}

export interface Addon_ClientStoryApi<StoryFnReturnType = unknown> {
  storiesOf(kind: StoryKind, module: any): Addon_StoryApi<StoryFnReturnType>;
}

export type Addon_LoadFn = () => any;
export type Addon_RequireContext = any; // FIXME
export type Addon_Loadable = Addon_RequireContext | [Addon_RequireContext] | Addon_LoadFn;

// CSF types, to be re-org'ed in 6.1

export type Addon_BaseDecorators<StoryFnReturnType> = Array<
  (story: () => StoryFnReturnType, context: Addon_StoryContext) => StoryFnReturnType
>;

export interface Addon_BaseAnnotations<Args, StoryFnReturnType> {
  /**
   * Dynamic data that are provided (and possibly updated by) Storybook and its addons.
   * @see [Arg story inputs](https://storybook.js.org/docs/react/api/csf#args-story-inputs)
   */
  args?: Partial<Args>;

  /**
   * ArgTypes encode basic metadata for args, such as `name`, `description`, `defaultValue` for an arg. These get automatically filled in by Storybook Docs.
   * @see [Control annotations](https://github.com/storybookjs/storybook/blob/91e9dee33faa8eff0b342a366845de7100415367/addons/controls/README.md#control-annotations)
   */
  argTypes?: Addons_ArgTypes<Args>;

  /**
   * Custom metadata for a story.
   * @see [Parameters](https://storybook.js.org/docs/basics/writing-stories/#parameters)
   */
  parameters?: Addon_Parameters;

  /**
   * Wrapper components or Storybook decorators that wrap a story.
   *
   * Decorators defined in Meta will be applied to every story variation.
   * @see [Decorators](https://storybook.js.org/docs/addons/introduction/#1-decorators)
   */
  decorators?: Addon_BaseDecorators<StoryFnReturnType>;

  /**
   * Define a custom render function for the story(ies). If not passed, a default render function by the framework will be used.
   */
  render?: (args: Args, context: Addon_StoryContext) => StoryFnReturnType;

  /**
   * Function that is executed after the story is rendered.
   */
  play?: (context: Addon_StoryContext) => Promise<void> | void;
}

export interface Addon_Annotations<Args, StoryFnReturnType>
  extends Addon_BaseAnnotations<Args, StoryFnReturnType> {
  /**
   * Used to only include certain named exports as stories. Useful when you want to have non-story exports such as mock data or ignore a few stories.
   * @example
   * includeStories: ['SimpleStory', 'ComplexStory']
   * includeStories: /.*Story$/
   *
   * @see [Non-story exports](https://storybook.js.org/docs/formats/component-story-format/#non-story-exports)
   */
  includeStories?: string[] | RegExp;

  /**
   * Used to exclude certain named exports. Useful when you want to have non-story exports such as mock data or ignore a few stories.
   * @example
   * excludeStories: ['simpleData', 'complexData']
   * excludeStories: /.*Data$/
   *
   * @see [Non-story exports](https://storybook.js.org/docs/formats/component-story-format/#non-story-exports)
   */
  excludeStories?: string[] | RegExp;
}

export interface Addon_BaseMeta<ComponentType> {
  /**
   * Title of the story which will be presented in the navigation. **Should be unique.**
   *
   * Stories can be organized in a nested structure using "/" as a separator.
   *
   * Since CSF 3.0 this property is optional.
   *
   * @example
   * export default {
   *   ...
   *   title: 'Design System/Atoms/Button'
   * }
   *
   * @see [Story Hierarchy](https://storybook.js.org/docs/basics/writing-stories/#story-hierarchy)
   */
  title?: string;

  /**
   * Manually set the id of a story, which in particular is useful if you want to rename stories without breaking permalinks.
   *
   * Storybook will prioritize the id over the title for ID generation, if provided, and will prioritize the story.storyName over the export key for display.
   *
   * @see [Sidebar and URLs](https://storybook.js.org/docs/react/configure/sidebar-and-urls#permalinking-to-stories)
   */
  id?: string;

  /**
   * The primary component for your story.
   *
   * Used by addons for automatic prop table generation and display of other component metadata.
   */
  component?: ComponentType;

  /**
   * Auxiliary subcomponents that are part of the stories.
   *
   * Used by addons for automatic prop table generation and display of other component metadata.
   *
   * @example
   * import { Button, ButtonGroup } from './components';
   *
   * export default {
   *   ...
   *   subcomponents: { Button, ButtonGroup }
   * }
   *
   * By defining them each component will have its tab in the args table.
   */
  subcomponents?: Record<string, ComponentType>;
}

export type Addon_BaseStoryObject<Args, StoryFnReturnType> = {
  /**
   * Override the display name in the UI
   */
  storyName?: string;
};

export type Addon_BaseStoryFn<Args, StoryFnReturnType> = {
  (args: Args, context: Addon_StoryContext): StoryFnReturnType;
} & Addon_BaseStoryObject<Args, StoryFnReturnType>;

export type BaseStory<Args, StoryFnReturnType> =
  | Addon_BaseStoryFn<Args, StoryFnReturnType>
  | Addon_BaseStoryObject<Args, StoryFnReturnType>;

export interface Addon_RenderOptions {
  active?: boolean;
  key?: string;
}

export interface Addon_Type {
  title: (() => string) | string;
  type?: Addon_Types;
  id?: string;
  route?: (routeOptions: RouterData) => string;
  match?: (matchOptions: RouterData) => boolean;
  render: (renderOptions: Addon_RenderOptions) => any | null;
  paramKey?: string;
  disabled?: boolean;
  hidden?: boolean;
}

export type Addon_Loader = (api: API) => void;

export interface Addon_Loaders {
  [key: string]: Addon_Loader;
}
export interface Addon_Collection {
  [key: string]: Addon_Type;
}
export interface Addon_Elements {
  [key: string]: Addon_Collection;
}
export interface Addon_ToolbarConfig {
  hidden?: boolean;
}
export interface Addon_Config {
  theme?: ThemeVars;
  toolbar?: {
    [id: string]: Addon_ToolbarConfig;
  };
  [key: string]: any;
}
