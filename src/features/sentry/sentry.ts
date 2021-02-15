import * as Sentry from '@sentry/react';
import appConfig from '../../constants/app.config';
import { Integrations } from '@sentry/tracing';

export const initializeSentry = () => {
  if (!appConfig.sentryDsn) return;

  Sentry.init({
    dsn: appConfig.sentryDsn,
    integrations: [new Integrations.BrowserTracing()],
    release: 'poe-harvest-crafts@' + process.env.npm_package_version,
    // debug: !appConfig.production,

    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,
    normalizeDepth: 8
  });
};
