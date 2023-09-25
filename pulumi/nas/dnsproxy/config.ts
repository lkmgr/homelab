import * as pulumi from '@pulumi/pulumi';

const config = new pulumi.Config('dnsproxy');

export const image = config.require('image');
export const domain = config.require('domain');
