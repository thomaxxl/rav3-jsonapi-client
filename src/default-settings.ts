import { safrsErrorHandler } from './errors';

export default {
  total: 'total',
  headers: {
    Accept: 'application/vnd.api+json; charset=utf-8',
    'Content-Type': 'application/vnd.api+json; charset=utf-8'
  },
  updateMethod: 'PATCH',
  arrayFormat: 'brackets',
  errorHandler: safrsErrorHandler,
  endpointToTypeStripLastLetters: ['Model', 's'] // update/create type: UserModel -> User, Users -> s
};
