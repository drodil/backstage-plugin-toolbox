import { createBackend } from '@backstage/backend-defaults';

const backend = createBackend();

backend.add(import('@backstage/plugin-auth-backend'));
backend.add(import('@backstage/plugin-auth-backend-module-guest-provider'));
backend.add(import('@drodil/backstage-plugin-toolbox-backend-module-whois'));
backend.add(import('../src'));

backend.start();
