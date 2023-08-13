import * as pulumi from "@pulumi/pulumi";
import * as docker from "@pulumi/docker";

const config = new pulumi.Config();

const vars = {
  minioRootUser: config.require("minioRootUser"),
  minioRootPass: config.require("minioRootPass"),
};

const minioImage = new docker.RemoteImage("minio", {
  name: "minio/minio:RELEASE.2023-08-04T17-40-21Z.hotfix.5a2b71e54",
});

const minioContainer = new docker.Container("minio", {
  image: minioImage.imageId,
  command: ["server", "--console-address", ":9090"],
  envs: [
    `MINIO_ROOT_USER=${vars.minioRootUser}`,
    `MINIO_ROOT_PASSWORD=${vars.minioRootPass}`,
    "MINIO_VOLUMES=/data",
    "MINIO_PROMETHEUS_AUTH_TYPE=public",
  ],
  name: "pulumi-minio",
  restart: "unless-stopped",
  ports: [
    { internal: 9000, external: 9001 },
    { internal: 9090, external: 9091 },
  ],
  volumes: [{ hostPath: "/volume1/docker/minio", containerPath: "/data" }],
});

const minioSSDContainer = new docker.Container("minio-ssd", {
  image: minioImage.imageId,
  command: ["server", "--console-address", ":9090"],
  envs: [
    `MINIO_ROOT_USER=${vars.minioRootUser}`,
    `MINIO_ROOT_PASSWORD=${vars.minioRootPass}`,
    "MINIO_VOLUMES=/data",
    "MINIO_PROMETHEUS_AUTH_TYPE=public",
  ],
  name: "pulumi-minio-ssd",
  restart: "unless-stopped",
  ports: [
    { internal: 9000, external: 9000 },
    { internal: 9090, external: 9090 },
  ],
  volumes: [
    { hostPath: "/volumeUSB1/usbshare/docker/minio", containerPath: "/data" },
  ],
});

export default {
  minioContainer: minioContainer.id,
  minioSSDContainer: minioSSDContainer.id,
};
