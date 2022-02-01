import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Authenticator } from '@tapis/tapis-typescript';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './store';
import TapisContext, { TapisContextType } from '../context/TapisContext';

interface TapisProviderProps {
  token?: Authenticator.NewAccessTokenResponse;
  basePath: string;
}

const TapisHooksProvider: React.FC<
  React.PropsWithChildren<TapisProviderProps>
> = ({ token, basePath, children }) => {
  // Provide a context state for the rest of the application, including
  // a way of modifying the state
  const contextValue: TapisContextType = {
    basePath,
  };

  // react-query client
  const queryClient = new QueryClient();

  return (
    <TapisContext.Provider value={contextValue}>
      <ReduxProvider store={store}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </ReduxProvider>
    </TapisContext.Provider>
  );
};

export default TapisHooksProvider;