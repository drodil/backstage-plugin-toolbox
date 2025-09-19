export interface Config {
  toolbox?: {
    /**
     * List of enabled actions. If not set, all actions are enabled.
     * Should be id of the action
     */
    enabledActions?: string[];
  };
}
