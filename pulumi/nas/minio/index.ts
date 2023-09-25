import * as docker from '@pulumi/docker';
// import * as doppler from '@pulumiverse/doppler';
// import * as pulumi from '@pulumi/pulumi';

import { image, rootUser, rootPass } from './config';
import getProvider from '../provider';

// const config = new pulumi.Config('doppler');
// const dopplerProvider = new doppler.Provider('doppler', {
//   dopplerToken: config.require('apiKey'),
// });
// const secrets = doppler.secretsOutput(
//   { config: 'main', project: 'pulumi' },
//   { provider: dopplerProvider },
// );
//
// const user = secrets.apply((x) => x.map['MINIO_ROOT_USER']);
// console.log('USER', user);

const provider = getProvider();

const minioImage = new docker.RemoteImage(
  'minio',
  {
    name: image,
  },
  { provider },
);

const minioContainer = new docker.Container(
  'minio',
  {
    image: minioImage.imageId,
    command: ['server', '--console-address', ':9090'],
    envs: [
      `MINIO_ROOT_USER=${rootUser}`,
      `MINIO_ROOT_PASSWORD=${rootPass}`,
      'MINIO_VOLUMES=/data',
      'MINIO_PROMETHEUS_AUTH_TYPE=public',
    ],
    name: 'pulumi-minio',
    restart: 'unless-stopped',
    ports: [
      { internal: 9000, external: 9001 },
      { internal: 9090, external: 9091 },
    ],
    volumes: [{ hostPath: '/volume1/docker/minio', containerPath: '/data' }],
    destroyGraceSeconds: 30,
  },
  { provider },
);

const minioSSDContainer = new docker.Container(
  'minio-ssd',
  {
    image: minioImage.imageId,
    command: ['server', '--console-address', ':9090'],
    envs: [
      `MINIO_ROOT_USER=${rootUser}`,
      `MINIO_ROOT_PASSWORD=${rootPass}`,
      'MINIO_VOLUMES=/data',
      'MINIO_PROMETHEUS_AUTH_TYPE=public',
    ],
    name: 'pulumi-minio-ssd',
    restart: 'unless-stopped',
    ports: [
      { internal: 9000, external: 9000 },
      { internal: 9090, external: 9090 },
    ],
    volumes: [
      { hostPath: '/volumeUSB1/usbshare/docker/minio', containerPath: '/data' },
    ],
    destroyGraceSeconds: 30,
  },
  { provider },
);

export default {
  minioContainer: minioContainer.id,
  minioSSDContainer: minioSSDContainer.id,
};
