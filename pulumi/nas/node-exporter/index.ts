import * as docker from '@pulumi/docker';

import { image } from './config';
import getProvider from '../provider';

const provider = getProvider();

const nodeExporterImage = new docker.RemoteImage(
  'node-exporter',
  { name: image },
  { provider },
);

const nodeExporterContainer = new docker.Container(
  'node-exporter',
  {
    name: 'pulumi-node-exporter',
    image: nodeExporterImage.imageId,
    restart: 'unless-stopped',
    command: [
      '--path.procfs=/host/proc',
      '--path.sysfs=/host/sys',
      '--no-collector.diskstats',
      '--no-collector.filesystem',
    ],
    privileged: true,
    ports: [{ internal: 9100, external: 9100 }],
    volumes: [
      { hostPath: '/proc', containerPath: '/host/proc', readOnly: true },
      { hostPath: '/sys', containerPath: '/host/sys', readOnly: true },
    ],
    destroyGraceSeconds: 30,
  },
  { provider },
);

export default {
  nodeExporterContainer: nodeExporterContainer.id,
};
