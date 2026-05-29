export const baseToolRequestSchema = {
  fields: {
    files: {
      required: true,
      type: 'file[]',
    },
    options: {
      required: false,
      type: 'json',
    },
  },
};
