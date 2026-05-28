export const userListResponseSchema = {
  type: 'object',
  required: ['page', 'per_page', 'total', 'total_pages', 'data'],
  properties: {
    page: { type: 'number' },
    per_page: { type: 'number' },
    total: { type: 'number' },
    total_pages: { type: 'number' },
    data: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'number' },
          email: { type: 'string', format: 'email' },
          first_name: { type: 'string' },
          last_name: { type: 'string' },
          avatar: { type: 'string' },
        },
        additionalProperties: true,
      },
    },
    support: {
      type: 'object',
      properties: {
        url: { type: 'string' },
        text: { type: 'string' },
      },
    },
  },
  additionalProperties: true,
} as const;

export interface UserListResponse {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: Array<{
    id: number;
    email?: string;
    first_name?: string;
    last_name?: string;
    avatar?: string;
  }>;
}
