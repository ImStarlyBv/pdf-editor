import { NextResponse } from 'next/server';
import { resolveToolRequest } from '../../../../controllers/tools/toolController';
import {
  getUploadedFiles,
  validateToolUpload,
} from '../../../../controllers/tools/uploadController';
import { runTool } from '../../../../services/tools/toolService';

const makeAttachmentHeaders = ({ filename, contentType }) => ({
  'Content-Type': contentType,
  'Content-Disposition': `attachment; filename="${filename.replace(/"/g, '')}"`,
  'Cache-Control': 'no-store',
});

export async function POST(request, { params }) {
  const { toolId } = await params;
  const resolved = resolveToolRequest(toolId);

  if (!resolved.ok) {
    return NextResponse.json({ error: resolved.error }, { status: resolved.status });
  }

  const { files, formData } = await getUploadedFiles(request);
  const uploadValidation = validateToolUpload({ tool: resolved.tool, files });

  if (!uploadValidation.ok) {
    return NextResponse.json(
      { error: uploadValidation.error },
      { status: uploadValidation.status },
    );
  }

  let result;

  try {
    result = await runTool({ tool: resolved.tool, files, formData });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || `${resolved.tool.name} failed.` },
      { status: 400 },
    );
  }

  if (result.kind === 'file') {
    return new Response(result.bytes, {
      status: 200,
      headers: makeAttachmentHeaders(result),
    });
  }

  if (result.status === 'error') {
    return NextResponse.json({ error: result.message }, { status: 400 });
  }

  return NextResponse.json(result, { status: 501 });
}
