import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import renderComponent from 'utils/testing';
import CreateDirModal from './CreateDirModal';
import { useMkdir } from 'tapis-hooks/files';

jest.mock('tapis-hooks/files/useMkdir');

describe('CreateDirModal', () => {
  it.skip('fires the onSubmit function', async () => {
    const mkdirMock = jest.fn();
    const resetMock = jest.fn();
    (useMkdir as jest.Mock).mockReturnValue({
      mkdir: mkdirMock,
      isLoading: false,
      error: null,
      isSuccess: false,
      reset: resetMock,
    });

    renderComponent(<CreateDirModal toggle={() => {}} />);

    const input = screen.getByLabelText('Input');
    await act(async () => {
      fireEvent.change(input, {
        target: {
          value: 'testdir',
        },
      });
    });

    const button = screen.getByLabelText('Submit');
    await act(async () => {
      fireEvent.click(button);
    });

    await waitFor(() => {
      expect(mkdirMock).toBeCalledTimes(1);
      expect(resetMock).toBeCalledTimes(1);
    });
  });

  it.skip('submits with valid inputs', async () => {
    const mkdirMock = jest.fn();
    const resetMock = jest.fn();
    (useMkdir as jest.Mock).mockReturnValue({
      mkdir: mkdirMock,
      isLoading: false,
      error: null,
      isSuccess: false,
      reset: resetMock,
    });

    renderComponent(<CreateDirModal toggle={() => {}} />);

    const input = screen.getByLabelText('Input');
    await act(async () => {
      fireEvent.change(input, {
        target: {
          value: 'testdir',
        },
      });
    });

    const button = screen.getByLabelText('Submit');
    await act(async () => {
      fireEvent.click(button);
    });

    await waitFor(() => {
      expect(mkdirMock).toBeCalledTimes(1);
      expect(resetMock).toBeCalledTimes(1);
    });
  });

  it.skip('fails with invalid inputs', async () => {
    const mkdirMock = jest.fn();
    const resetMock = jest.fn();
    (useMkdir as jest.Mock).mockReturnValue({
      mkdir: mkdirMock,
      isLoading: false,
      error: null,
      isSuccess: false,
      reset: resetMock,
    });

    renderComponent(<CreateDirModal toggle={() => {}} />);

    const input = screen.getByLabelText('Input');
    await act(async () => {
      fireEvent.change(input, {
        target: {
          // * is an invalid value
          value: '*',
        },
      });
    });

    const button = screen.getByLabelText('Submit');
    await act(async () => {
      fireEvent.click(button);
    });

    await waitFor(() => {
      expect(mkdirMock).toBeCalledTimes(0);
      expect(resetMock).toBeCalledTimes(1);
    });
  });
});
