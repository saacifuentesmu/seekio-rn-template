// REST implementation of the FileStore port — STUB.
//
// The template has no REST file-storage endpoints wired yet. Implement against
// the authenticated axios client (services/api/client) when the backend spec
// lands — typically multipart upload for `uploadCsv`, GET for `downloadCsv`,
// and a HEAD or metadata endpoint for `getFileUpdatedTime` (returning the
// Last-Modified header parsed into an ISO 8601 string).

import {FileStore} from '@/services/backend/ports/fileStore';

const NOT_IMPLEMENTED =
  'RestFileStore not implemented — wire to services/api/client when the file endpoints land (see file header)';

export class RestFileStore implements FileStore {
  uploadCsv(_path: string, _content: string): Promise<void> {
    throw new Error(NOT_IMPLEMENTED);
  }

  downloadCsv(_path: string): Promise<string | null> {
    throw new Error(NOT_IMPLEMENTED);
  }

  getFileUpdatedTime(_path: string): Promise<string | null> {
    throw new Error(NOT_IMPLEMENTED);
  }
}
