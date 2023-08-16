import * as pulumi from '@pulumi/pulumi';
import * as docker from '@pulumi/docker';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

let provider: docker.Provider | null = null;

// Bug: SSH options can't be set
// https://github.com/pulumi/pulumi-docker/issues/702

// don't look at this function
const connectDocker = (): docker.Provider => {
  const config = new pulumi.Config();
  const host = config.require('ssh-host');
  const hostKeys = config.require('ssh-host-keys');
  const privateKey = config.require('ssh-key');

  const homedir = os.homedir();

  if (!fs.existsSync(path.resolve(homedir, '.ssh'))) {
    fs.mkdirSync(path.resolve(homedir, '.ssh'), { mode: 0o700 });
  }

  const knownHosts = fs.readFileSync(
    path.resolve(homedir, '.ssh/known_hosts'),
    {
      encoding: 'utf8',
    },
  );
  if (knownHosts.indexOf(hostKeys.trim()) === -1) {
    fs.appendFileSync(
      path.resolve(homedir, '.ssh/known_hosts'),
      '\n' + hostKeys,
      {
        encoding: 'utf8',
        mode: 0o600,
      },
    );
  }

  fs.writeFileSync('/tmp/pulumi_nas_key', privateKey, {
    encoding: 'utf8',
    mode: 0o600,
  });

  const provider = new docker.Provider('nas', {
    host,
    sshOpts: ['-i', '/tmp/pulumi_nas_key'],
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
