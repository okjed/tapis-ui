import React from 'react';
import { useFormContext, FieldArrayPath } from 'react-hook-form';
import { FileInput } from '@tapis/tapis-typescript-apps';
import { FieldArray, FieldArrayComponent } from './FieldArray';
import FieldWrapper from 'tapis-ui/_common/FieldWrapper';
import { Input, Label, FormText, FormGroup } from 'reactstrap';
import { mapInnerRef } from 'tapis-ui/utils/forms';
import { ReqSubmitJob } from '@tapis/tapis-typescript-jobs';

const FileInputField: FieldArrayComponent = ({ item, index }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<ReqSubmitJob>();
  const { sourceUrl, targetPath, inPlace, id } = item;
  const itemError = errors?.fileInputs && errors.fileInputs[index];

  return (
    <div key={id}>
      <FieldWrapper
        label="Source URL"
        required={true}
        description="Input TAPIS file as a pathname, TAPIS URI or web URL"
        error={itemError?.sourceUrl}
      >
        <Input
          bsSize="sm"
          defaultValue={sourceUrl}
          {...mapInnerRef(
            register(`fileInputs.${index}.sourceUrl`, {
              required: 'Source URL is required',
            })
          )}
        />
      </FieldWrapper>
      <FieldWrapper
        label="Target Path"
        required={true}
        description="File mount path inside of running container"
        error={itemError?.targetPath}
      >
        <Input
          bsSize="sm"
          defaultValue={targetPath}
          {...mapInnerRef(
            register(`fileInputs.${index}.targetPath`, {
              required: 'Target Path is required',
            })
          )}
        />
      </FieldWrapper>
      <FormGroup check>
        <Label check className="form-field__label" size="sm">
          <Input
            type="checkbox"
            bsSize="sm"
            defaultChecked={inPlace}
            {...mapInnerRef(register(`fileInputs.${index}.inPlace`))}
          />{' '}
          In Place
        </Label>
        <FormText className="form-field__help" color="muted">
          If this is true, the source URL will be mounted from the execution
          system's local file system
        </FormText>
      </FormGroup>
    </div>
  );
};

type FileInputsProps = {
  inputs: Array<FileInput>;
};

const FileInputs: React.FC<FileInputsProps> = ({ inputs }) => {
  const refName: FieldArrayPath<ReqSubmitJob> = 'fileInputs';
  const required = Array.from(
    inputs.filter((fileInput) => fileInput?.meta?.required).keys()
  );

  const appendData: FileInput = {
    sourceUrl: '',
    targetPath: '',
    inPlace: false,
    meta: {
      name: '',
      description: '',
      required: false,
    },
  };

  return (
    <FieldArray
      title="File Inputs"
      appendData={appendData}
      addButtonText="Add File Input"
      refName={refName}
      render={FileInputField}
      required={required}
    />
  );
};

export default FileInputs;