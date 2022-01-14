import { Apps, Jobs } from '@tapis/tapis-typescript';

export const getIncompleteAppInputs = (
  app: Apps.TapisApp
): Array<Apps.AppFileInput> => {
  return (
    app.jobAttributes?.fileInputs?.filter(
      (fileInput) => !fileInput.sourceUrl
    ) ?? []
  );
};

export const getIncompleteAppInputsOfType = (
  app: Apps.TapisApp,
  inputType: Apps.FileInputModeEnum
): Array<Apps.AppFileInput> => {
  return getIncompleteAppInputs(app).filter(
    (fileInput) => fileInput.inputMode === inputType
  );
};

export const generateRequiredFileInputsFromApp = (
  app: Apps.TapisApp
): Array<Jobs.JobFileInput> => {
  const requiredInputs: Array<Apps.AppFileInput> = getIncompleteAppInputsOfType(
    app,
    Apps.FileInputModeEnum.Required
  );
  const fileInputs: Array<Jobs.JobFileInput> = requiredInputs.map(
    (appFileInput) => {
      return {
        name: appFileInput.name,
      };
    }
  );
  return fileInputs;
};

export const fileInputsComplete = (
  app: Apps.TapisApp,
  fileInputs: Array<Jobs.JobFileInput>
) => {
  // Check to make sure job has filled in all REQUIRED app inputs that are missing sourceUrl
  const incompleteRequiredInputs: Array<Apps.AppFileInput> =
    getIncompleteAppInputsOfType(app, Apps.FileInputModeEnum.Required);
  const hasIncompleteRequiredInput: boolean = incompleteRequiredInputs.some(
    (requiredInput) => {
      // Find JobFileInput with name matching the required input
      const jobFileInput: Jobs.JobFileInput | undefined = fileInputs.find(
        (jobFileInput) => jobFileInput.name === requiredInput.name
      );
      if (!jobFileInput) {
        // Matching jobFileInput not found, therefore there is an incomplete required input
        return true;
      } else {
        // Verify that this input has a sourceUrl specified
        return !!jobFileInput.sourceUrl;
      }
    }
  );
  if (hasIncompleteRequiredInput) {
    return false;
  }

  // Check to see if an OPTIONAL input was included but not fully specified
  const optionalAppInputs: Array<Apps.AppFileInput> = getIncompleteAppInputs(
    app
  ).filter((appFileInput) => !appFileInput.sourceUrl);
  // get any optional app file input that was included in the job.
  const optionalJobInputs: Array<Jobs.JobFileInput> =
    fileInputs.filter((jobFileInput) =>
      optionalAppInputs.some(
        (optionalAppInput) => jobFileInput.name === optionalAppInput.name
      )
    ) ?? [];
  const hasIncompleteOptionalInput: boolean = optionalJobInputs.some(
    (jobInput) => !jobInput.sourceUrl
  );
  if (hasIncompleteOptionalInput) {
    return false;
  }

  // Check to see if any app inputs that did not exist
  const namedInputs =
    app.jobAttributes?.fileInputs?.map((input) => input.name) ?? [];
  const otherInputs: Array<Jobs.JobFileInput> =
    fileInputs.filter(
      (jobInput) => !namedInputs.some((name) => name === jobInput.name)
    ) ?? [];
  if (
    otherInputs.some(
      (otherInput) => !otherInput.sourceUrl || !otherInput.targetPath
    )
  ) {
    return false;
  }

  return true;
};