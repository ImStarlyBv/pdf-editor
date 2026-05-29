import { getToolById } from '../../models/toolRegistry';

export const resolveToolRequest = (toolId) => {
  const tool = getToolById(toolId);

  if (!tool) {
    return {
      ok: false,
      status: 404,
      error: `Unknown tool: ${toolId}`,
    };
  }

  return {
    ok: true,
    tool,
  };
};
