import * as docker from '@pulumi/docker';

import { image } from './config';
import getProvider from '../provider';

const provider = getProvider();

const adguardImage = new docker.RemoteImage(
  'adguard',
  { name: image },
  { provider },
);

const adguardContainer = new docker.Container(
  'adguard',
  {
    name: 'pulumi-adguard',
    image: adguardImage.imageId,
    restart: 'unless-stopped',
    command: ['--web-addr=0.0.0.0:53', '--no-check-update'],
    ports: [
      { internal: 53, external: 53, protocol: 'tcp' },
      { internal: 53, external: 53, protocol: 'udp' },
      { internal: 80, external: 6500 },
      { internal: 3000, external: 6600 },
    ],
    volumes: [
      {
        hostPath: '/volume1/docker/adguard/work',
        containerPath: '/opt/adguardhome/work',
      },
      {
        hostPath: '/volume1/docker/adguard/conf',
        containerPath: '/opt/adguardhome/conf',
      },
    ],
    destroyGraceSeconds: 30,
  },
  { provider },
);

export default {
  adguardContainer: adguardContainer.id,
};
