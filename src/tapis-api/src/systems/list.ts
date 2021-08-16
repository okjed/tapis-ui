import { Systems } from '@tapis/tapis-typescript';
import { apiGenerator } from 'tapis-api/src/utils';
import { errorDecoder } from 'tapis-api/src/utils';

const list = (params: Systems.GetSystemsRequest, basePath: string, jwt: string) => {
  const api: Systems.SystemsApi = apiGenerator<Systems.SystemsApi>(Systems, Systems.SystemsApi, basePath, jwt);
  return errorDecoder<Systems.RespSystems>(
    () => api.getSystems(params)
  );
}

export default list;