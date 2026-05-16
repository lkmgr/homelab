<div align="center">

### My Homelab Repository

</div>

## Hardware

### Kubernetes Cluster

| Device                      | Type          | OS Disk        | Data Disk      | RAM   | OS    | Longhorn |
| --------------------------- | ------------- | -------------- | -------------- | ----- | ----- | -------- |
| Dell Optiplex 3050 i5-7500T | Control Plane | 500GB SATA SSD | 500GB NVME SSD | 16 GB | Talos | ✅       |
| Dell Optiplex 3050 i5-7500T | Control Plane | 500GB SATA SSD | 500GB NVME SSD | 16 GB | Talos | ✅       |
| Minisforum Ryzen 5 4500U    | Control Plane | 500GB SATA SSD | 512GB NVME SSD | 16 GB | Talos | ✅       |

### NAS

| Device          | Disk    | RAM     |
| --------------- | ------- | ------- |
| Synology DS218+ | 2x16 TB | 6GB RAM |

## Requirements

- `mise install`
- Install `minijinja-cli`
- Doppler CLI set up
- Age key in `age.key` file in root folder

## Preparation

- Download Talos image: `just talos download-image [intel|amd] [talos-version]`
- Boot from .iso

```sh
talosctl -n <ip> get disks --insecure
talosctl -n <ip> get links --insecure
```

- Create config for each node in `talos/` folder

## Installation

```sh
just talos apply-node k8s-0 <ip> --insecure
just talos apply-node k8s-1 <ip> --insecure
just talos apply-node k8s-2 <ip> --insecure

just bootstrap k8s

just bootstrap apps
```

## License

MIT

## Acknowledgments

[`cluster-template`](https://github.com/onedr0p/cluster-template), [`onedr0p/home-ops`](https://github.com/onedr0p/home-ops), [`app-template` Chart](https://github.com/bjw-s/helm-charts) and the home-operations community
