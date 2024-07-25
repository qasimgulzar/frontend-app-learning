import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient, getAuthenticatedUser } from '@edx/frontend-platform/auth';
import { logError, logInfo } from '@edx/frontend-platform/logging';

const getSearchEngineAuthToken = async () => {
  const authenticatedUser = getAuthenticatedUser();
  const url = new URL(`${getConfig().LMS_BASE_URL}/api/search/token/`);

  if (authenticatedUser) {
    try {
      const { data } = await getAuthenticatedHttpClient().get(url.href, {});
      return data;
    } catch (e) {
      const { customAttributes: { httpErrorStatus } } = e;
      if (httpErrorStatus === 404) {
        logInfo(`${e}. This probably happened because the search plugin is not installed on platform.`);
      } else {
        logError(e);
      }
    }
  }
  return null;
};
export default getSearchEngineAuthToken;
