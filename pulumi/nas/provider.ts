import * as pulumi from '@pulumi/pulumi';
import * as docker from '@pulumi/docker';

const config = new pulumi.Config();
const host = config.require('ssh-host');

let provider: docker.Provider | null = null;

const getProvider = () => {
  if (!provider) {
    provider = new docker.Provider('nas', {
      host,
      sshOpts: ['-o', 'StrictHostKeyChecking=no'],
    });
  }
  return provider;
};

export default getProvider;
