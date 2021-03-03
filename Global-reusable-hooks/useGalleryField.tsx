import { useCallback, useEffect, useState } from 'react';
import { useFormikContext } from 'formik';
import { FileType, ImageType } from '../domains/files/types';
import { uploadTempFile } from '../domains/users/services/api';
import {
  getBase64fromImage,
  getFileExtension,
} from '../domains/files/utilities';

export const useGalleryField = (type: FileType) => {
  const formik = useFormikContext();
  const formFieldName = type === 'image' ? 'images' : 'documents';
  const fetchFiles = useCallback(() => [], []);
  const [tempFileValues, setTempFileValues] = useState<Array<number>>([]);

  useEffect(
    () => {
      formik.setFieldValue(formFieldName, tempFileValues);
    },
    // eslint-disable-next-line
    [tempFileValues, formFieldName]
  );

  const uploadFile = async (file: File): Promise<ImageType> => {
    const fileId = await uploadTempFile(file, type);
    const base64 = await getBase64fromImage(file);
    const base64Image: ImageType = {
      id: fileId,
      url: base64,
      name: file.name,
      extension: getFileExtension(file.name),
    };
    const newFile = fileId;
    setTempFileValues((prev: Array<number>) => {
      return [...prev, newFile];
    });
    return base64Image;
  };

  const deleteFile = (imageId: number): void => {
    const fileIds = tempFileValues.filter((fileId) => fileId !== imageId);
    setTempFileValues(fileIds);
  };

  return { fetchFiles, uploadFile, deleteFile };
};
