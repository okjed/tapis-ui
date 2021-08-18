import { useQuery } from 'react-query';
import { list } from 'tapis-api/apps';
import { Apps } from '@tapis/tapis-typescript'
import { useTapisConfig } from 'tapis-hooks';
import QueryKeys from './queryKeys';

const useList = (params: Apps.GetAppsRequest) => {
  const { accessToken, basePath } = useTapisConfig();
  const result = useQuery<Apps.RespApps, Error>(
    [QueryKeys.list, params, accessToken],
    // Default to no token. This will generate a 403 when calling the list function
    // which is expected behavior for not having a token
    () => list(params, basePath, accessToken?.access_token || ''),
    {
      enabled: !!accessToken
    }
  );
  return result;
}

export default useList;