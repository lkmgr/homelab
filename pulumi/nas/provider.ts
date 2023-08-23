import * as pulumi from '@pulumi/pulumi';
import * as docker from '@pulumi/docker';
import * as fs from 'fs';

let provider: docker.Provider | null = null;

const connectDocker = (): docker.Provider => {
  const config = new pulumi.Config();
  const host = config.require('ssh-host');
  const privateKey = config.require('ssh-key');

  fs.writeFileSync('/tmp/sshkey', privateKey, {
    encoding: 'utf8',
    mode: 0o600,
  });

  const provider = new docker.Provider('nas', {
    host,
    sshOpts: [
      '-i',
      '/tmp/sshkey',
      '-o',
      'StrictHostKeyChecking=no',
      '-o',
      'UserKnownHostsFile=/dev/null',
    ],
  });

  return provider;
};

/* const connectDocker = () => {
  const config = new pulumi.Config();
  const host = config.require('ssh-host');

  return new docker.Provider('nas', { host });
}; */

const getProvider = () => {
  if (!provider) {
    provider = connectDocker();
  }
  return provider;
};

export default getProvider;
