import React, { useEffect, useState } from 'react';
import { useList } from 'tapis-hooks/systems';
import { useDetail } from 'tapis-hooks/apps';
import { FormProvider, useForm } from 'react-hook-form';
import { QueryWrapper, SubmitWrapper } from 'tapis-ui/_wrappers';
import Wizard, { Step } from 'tapis-ui/_common/Wizard';
import { Button } from 'reactstrap';
import { DescriptionList } from 'tapis-ui/_common';
import * as Jobs from '@tapis/tapis-typescript-jobs';
import * as Apps from '@tapis/tapis-typescript-apps';
import AppSelectStep from './AppSelectStep';
import FileInputsStep from './FileInputsStep';
import { useSubmit } from 'tapis-hooks/jobs';
import styles from './JobLauncherWizard.module.scss';

const jobInputComplete = (jobInput: Jobs.JobFileInput) => {
  return !!jobInput.name?.length && !!jobInput.sourceUrl?.length && !!jobInput.targetPath?.length;
}

const fileInputsComplete = (app: Apps.TapisApp, job: Jobs.ReqSubmitJob) => {
  const required = app.jobAttributes?.fileInputs?.filter(input => input.inputMode === Apps.FileInputModeEnum.Required) ?? [];
  if (job.fileInputs?.some(jobInput => !jobInputComplete(jobInput))) {
    return false;
  }
  const incomplete = required.some(
    input => {
      const matchingJobInput = job.fileInputs?.find(jobInput => jobInput.name === input.name)
      if (!matchingJobInput) {
        // Required input was missing from job submission
        if (!!input.sourceUrl) {
          // The app input specifies a sourceUrl, so it's not required in the job submission
          return true;
        }
        return false;
      }
      if (matchingJobInput) {
        // Required input was found in job submission, Check to see if it's complete
        return !jobInputComplete(matchingJobInput);
      }
    }
  )
  if (incomplete) {
    // One or more job submissions file inputs was incomplete, yet required in app inputs
    // without having a sourceUrl specified in the app
    return false;
  }
  return true;
}

interface JobLauncherProps {
  appId: string;
  appVersion: string;
  name: string;
  execSystemId?: string;
}

const JobLauncherWizard: React.FC<JobLauncherProps> = ({
  appId,
  appVersion,
  name,
  execSystemId,
}) => {
  const {
    data: respSystems,
    isLoading: systemsLoading,
    error: systemsError,
  } = useList();
  const {
    data: respApp,
    isLoading: appLoading,
    error: appError,
  } = useDetail({
    appId,
    appVersion,
    select: 'jobAttributes',
  });

  const app = respApp?.result;
  const systems = respSystems?.result ?? [];
  const formMethods = useForm<Jobs.ReqSubmitJob>({ reValidateMode: 'onBlur' });
  const { reset, getValues, trigger } = formMethods;

  // Utility function to map an app spec's file inputs to a job's fileInput
  const mapAppInputs = (appInputs: Array<Apps.AppFileInput>) => {
    return appInputs.map((input) => {
      const { sourceUrl, targetPath, description, name } = input;
      const result: Jobs.JobFileInput = {
        sourceUrl,
        targetPath,
        description,
        name,
      };
      return result;
    });
  };

  const defaultValues: Jobs.ReqSubmitJob = {
    appId,
    appVersion,
    name,
    execSystemId,
    fileInputs: mapAppInputs(app?.jobAttributes?.fileInputs ?? []),
  };

  // Populating default values needs to happen as an effect
  // after initial render of field arrays
  useEffect(() => {
    reset(defaultValues);
  }, [reset, app?.id]); // eslint-disable-line react-hooks/exhaustive-deps


  const jobSubmission = getValues();

  const steps: Array<Step> = [
    {
      name: 'Job Info',
      component: (
        <AppSelectStep
          app={app}
          name={name}
          systems={systems}
          execSystemId={execSystemId}
        />
      ),
      complete: !!jobSubmission.execSystemId && !!jobSubmission.name
    },
    {
      name: 'File Inputs',
      component: <FileInputsStep app={app} systems={systems} />,
      complete: !!(app && fileInputsComplete(app, jobSubmission))
    },
    {
      name: 'Summary',
      component: <DescriptionList data={jobSubmission} />,
      complete: true
    }
  ]

  const { submit, isLoading, error, data } = useSubmit(appId, appVersion);

  const finish = <SubmitWrapper isLoading={isLoading} error={error} success={data?.message}>
    <Button
      color="primary"
      onClick={() => submit(jobSubmission)}
    >
      Submit Job
    </Button>
  </SubmitWrapper>

  console.log('Current job submission state', getValues());

  return (
    <QueryWrapper
      isLoading={appLoading || systemsLoading}
      error={appError ?? systemsError}
    >
      <FormProvider {...formMethods}>
        <Wizard steps={steps} onStep={trigger} finish={finish} />
      </FormProvider>
    </QueryWrapper>
  );
};

export default JobLauncherWizard;
