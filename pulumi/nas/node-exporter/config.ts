import * as pulumi from '@pulumi/pulumi';

const config = new pulumi.Config('node-exporter');

export const image = config.require('image');
