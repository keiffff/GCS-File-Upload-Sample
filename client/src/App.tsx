import React, { useCallback, ChangeEventHandler } from 'react';
import gql from 'graphql-tag';
import { useUploadFileMutation } from './types/graphql';

// eslint-disable-next-line no-unused-expressions, @typescript-eslint/no-unused-expressions
gql`
  mutation uploadFile($file: Upload!) {
    uploadFile(file: $file)
  }
`;

export const App = () => {
  const [uploadFile, { loading, error, data }] = useUploadFileMutation();
  const handleUploadFile = useCallback<ChangeEventHandler<HTMLInputElement>>(
    e => {
      const { files } = e.target;
      if (!files?.length) return;
      uploadFile({ variables: { file: files[0] } });
    },
    [uploadFile],
  );

  return (
    <>
      {loading ? 'loading' : null}
      {error ? error.graphQLErrors.map(({ message }, i) => <span key={i}>{message}</span>) : null}
      {data?.uploadFile ? <img src={data.uploadFile} style={{ width: '200px' }} /> : 'no image'}
      <input type="file" onChange={handleUploadFile} />
    </>
  );
};
