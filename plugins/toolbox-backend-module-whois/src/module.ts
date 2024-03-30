import { createBackendModule } from '@backstage/backend-plugin-api';
import { toolboxToolExtensionPoint } from '@drodil/backstage-plugin-toolbox-node';
import { WhoisHandler } from './handler';

export const toolboxModuleWhois = createBackendModule({
  pluginId: 'toolbox',
  moduleId: 'whois',
  register(reg) {
    reg.registerInit({
      deps: { toolbox: toolboxToolExtensionPoint },
      async init({ toolbox }) {
        toolbox.addToolRequestHandler(new WhoisHandler());
      },
    });
  },
});
