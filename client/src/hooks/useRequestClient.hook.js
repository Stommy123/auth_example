import axios from 'axios';

const useRequestClient = (authToken, authHeaderKey) => {
  const headers = authToken ? { [authHeaderKey]: authToken } : {};

  const mergeOptions = (opts = {}) => ({ ...opts, headers: { ...headers, ...opts.headers } });

  const getRequest = (url, options) => axios.get(url, mergeOptions(options));

  const postRequest = (url, body, options) => axios.post(url, body, mergeOptions(options));

  const patchRequest = (url, body, options) => axios.patch(url, body, mergeOptions(options));

  const deleteRequest = (url, options) => axios.delete(url, mergeOptions(options));

  return {
    get: getRequest,
    post: postRequest,
    patch: patchRequest,
    delete: deleteRequest,
  };
};

export default useRequestClient;
