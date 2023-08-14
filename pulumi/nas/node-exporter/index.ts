import * as docker from '@pulumi/docker';

import { image } from './config';

const nodeExporterImage = new docker.RemoteImage('node-exporter', {
  name: image,
});

const nodeExporterContainer = new docker.Container('node-exporter', {
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
});

export default {
  nodeExporterContainer: nodeExporterContainer.id,
};
