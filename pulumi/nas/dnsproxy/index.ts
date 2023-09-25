import * as docker from '@pulumi/docker';

import { image, domain } from './config';
import getProvider from '../provider';

const provider = getProvider();

const dnsproxyImage = new docker.RemoteImage(
  'dnsproxy',
  { name: image },
  { provider },
);

const dnsproxyContainer = new docker.Container(
  'dnsproxy',
  {
    name: 'pulumi-dnsproxy',
    image: dnsproxyImage.imageId,
    restart: 'unless-stopped',
    command: [
      '--listen=0.0.0.0',
      '--port=53',
      '--http3',
      '--upstream=https://cloudflare-dns.com/dns-query',
      `--upstream=[/${domain}/]192.168.4.249:53`,
      '--fallback=1.1.1.1:53',
      '--bootstrap=1.1.1.1:53',
      '--bootstrap=8.8.8.8:53',
      '--cache',
    ],
    ports: [
      { internal: 53, external: 53, protocol: 'tcp' },
      { internal: 53, external: 53, protocol: 'udp' },
    ],
    destroyGraceSeconds: 30,
  },
  { provider },
);

export default {
  dnsproxyContainer: dnsproxyContainer.id,
};
