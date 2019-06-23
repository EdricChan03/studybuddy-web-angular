import { baseEnvironment, Environment } from './environment.base';

export const environment: Environment = {
  production: true,
  ...baseEnvironment
};
