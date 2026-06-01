export const getUploadedFiles = async (request) => {
  const formData = await request.formData();
  return {
    formData,
    files: formData.getAll('files').filter((file) => file && file.size > 0),
  };
};

export const validateToolUpload = ({ tool, files }) => {
  if (tool.id === 'addImage') {
    if (files.length < 2) {
      return {
        ok: false,
        status: 400,
        error: 'Add Image to PDF requires a PDF file followed by a PNG or JPEG image.',
      };
    }

    if (files[0].type !== 'application/pdf') {
      return {
        ok: false,
        status: 400,
        error: 'The first file must be the PDF that will receive the image.',
      };
    }

    if (!['image/png', 'image/jpeg'].includes(files[1].type)) {
      return {
        ok: false,
        status: 400,
        error: 'The second file must be a PNG or JPEG image.',
      };
    }

    return { ok: true };
  }

  if (tool.id === 'addAttachments') {
    if (files.length < 2) {
      return {
        ok: false,
        status: 400,
        error: 'Add Attachments To PDF requires a PDF file followed by at least one attachment.',
      };
    }

    if (files[0].type !== 'application/pdf') {
      return {
        ok: false,
        status: 400,
        error: 'The first file must be the PDF that will receive attachments.',
      };
    }

    return { ok: true };
  }

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
