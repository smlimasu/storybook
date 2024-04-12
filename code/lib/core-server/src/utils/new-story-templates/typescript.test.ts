import { describe, expect, it } from 'vitest';
import { getTypeScriptTemplateForNewStoryFile } from './typescript';

describe('typescript', () => {
  it('should return a TypeScript template with a default import', () => {
    const result = getTypeScriptTemplateForNewStoryFile({
      basenameWithoutExtension: 'foo',
      componentExportName: 'default',
      componentIsDefaultExport: true,
      frameworkPackageName: '@storybook/nextjs',
      exportedStoryName: 'Default',
    });

    expect(result).toMatchInlineSnapshot(`
      "import type { Meta, StoryObj } from '@storybook/nextjs';

      import Foo from './foo';

      const meta = {
        component: Foo,
      } satisfies Meta<typeof Foo>;

      export default meta;

      type Story = StoryObj<typeof meta>;

      export const Default: Story = {};"
    `);
  });

  it('should return a TypeScript template with a named import', () => {
    const result = getTypeScriptTemplateForNewStoryFile({
      basenameWithoutExtension: 'foo',
      componentExportName: 'Example',
      componentIsDefaultExport: false,
      frameworkPackageName: '@storybook/nextjs',
      exportedStoryName: 'Default',
    });

    expect(result).toMatchInlineSnapshot(`
      "import type { Meta, StoryObj } from '@storybook/nextjs';

      import { Example } from './foo';

      const meta = {
        component: Example,
      } satisfies Meta<typeof Example>;

      export default meta;

      type Story = StoryObj<typeof meta>;

      export const Default: Story = {};"
    `);
  });
});
