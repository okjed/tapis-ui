import { Jobs } from '@tapis/tapis-typescript';
import { apiGenerator, errorDecoder } from 'tapis-api/utils';


export interface SubmitParams {
  request: Jobs.ReqSubmitJob,
  basePath: string,
  jwt: string
}

const submit = ({ request, basePath, jwt }: SubmitParams): Promise<Jobs.RespSubmitJob>  => {
  const api: Jobs.JobsApi = apiGenerator<Jobs.JobsApi>(Jobs, Jobs.JobsApi, basePath, jwt);
  return errorDecoder<Jobs.RespSubmitJob>(
    () => api.submitJob({ reqSubmitJob: request })
  );
}

export default submit;