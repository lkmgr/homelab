import * as pulumi from "@pulumi/pulumi";

const config = new pulumi.Config("minio");

export const image = config.require("image");
export const rootUser = config.require("root-user");
export const rootPass = config.require("root-pass");
