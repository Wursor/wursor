export type ToolSchema = {
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
  };
};

export const ALLOWED_TOOL_NAMES = [
  'read_page',
  'update_post',
  'update_option',
  'create_page',
  'update_theme_json',
] as const;

export type AllowedToolName = (typeof ALLOWED_TOOL_NAMES)[number];

const TOOLS: ToolSchema[] = [
  {
    type: 'function',
    function: {
      name: 'read_page',
      description: 'Read the raw content and title of a page by its slug.',
      parameters: {
        type: 'object',
        properties: { page: { type: 'string', description: 'Page slug' } },
        required: ['page'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'update_post',
      description: 'Update the title and/or content of an existing page or post.',
      parameters: {
        type: 'object',
        properties: {
          page: { type: 'string', description: 'Page slug' },
          title: { type: 'string' },
          content: { type: 'string' },
        },
        required: ['page'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'update_option',
      description: 'Update a WordPress option such as blogname or blogdescription.',
      parameters: {
        type: 'object',
        properties: {
          key: { type: 'string' },
          value: { type: 'string' },
        },
        required: ['key', 'value'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'create_page',
      description: 'Create a new page with a title and content.',
      parameters: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          content: { type: 'string' },
        },
        required: ['title', 'content'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'update_theme_json',
      description: 'Apply a JSON patch to theme.json (colors, fonts, layout).',
      parameters: {
        type: 'object',
        properties: {
          patch: { type: 'string', description: 'JSON patch object as a string' },
        },
        required: ['patch'],
      },
    },
  },
];

export function generateToolSchemas(): ToolSchema[] {
  return TOOLS;
}
