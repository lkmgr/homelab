import * as pulumi from '@pulumi/pulumi';

const config = new pulumi.Config('adguard');

export const image = config.require('image');
