import * as pulumi from '@pulumi/pulumi';
import * as docker from '@pulumi/docker';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

let provider: docker.Provider | null = null;

const connectDocker = (): docker.Provider => {
  const config = new pulumi.Config();
  const host = config.require('ssh-host');
  const hostKeys = config.require('ssh-host-keys');
  const privateKey = config.require('ssh-key');

  const homedir = os.homedir();

  fs.mkdirSync(path.resolve(homedir, '.ssh'), { mode: 0o700 });

  fs.writeFileSync(path.resolve(homedir, '.ssh/known_hosts'), hostKeys, {
    encoding: 'utf8',
    mode: 0o644,
  });

  fs.writeFileSync(path.resolve(homedir, '.ssh/id_ed25519'), privateKey, {
    encoding: 'utf8',
    mode: 0o400,
  });

  const provider = new docker.Provider('nas', {
    host,
    sshOpts: ['-i', path.resolve(homedir, '.ssh/id_ed25519')],
  });

  return provider;
};

const getProvider = () => {
  if (!provider) {
    provider = connectDocker();
  }
  return provider;
};

export default getProvider;
