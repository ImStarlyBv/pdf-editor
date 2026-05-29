export const getUploadedFiles = async (request) => {
  const formData = await request.formData();
  return {
    formData,
    files: formData.getAll('files').filter((file) => file && file.size > 0),
  };
};

export const validateToolUpload = ({ tool, files }) => {
  if (tool.acceptedTypes.length === 0) {
    return { ok: true };
  }

  if (files.length === 0) {
    return {
      ok: false,
      status: 400,
      error: `${tool.name} requires at least one uploaded file.`,
    };
  }

  if (tool.uploadMode === 'single' && files.length > 1) {
    return {
      ok: false,
      status: 400,
      error: `${tool.name} accepts one file at a time.`,
    };
  }

  const invalidFile = files.find((file) => !tool.acceptedTypes.includes(file.type));

  if (invalidFile) {
    return {
      ok: false,
      status: 400,
      error: `${invalidFile.name} is not a supported file type for ${tool.name}.`,
    };
  }

  return { ok: true };
};
