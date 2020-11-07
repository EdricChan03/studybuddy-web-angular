// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import { baseEnvironment, Environment } from './environment.base';

export const environment: Environment = {
  production: false,
  ...baseEnvironment,
  disableRouterAuth: true,
  analytics: {
    debugMode: true
  },
  remoteConfig: {
    settings: {
      minimumFetchIntervalMillis: 10_000
    }
  }
};
