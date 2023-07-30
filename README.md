<div align="center">

### My Homelab Repository

</div>

## Hardware

### Kubernetes Cluster

| Device | Type | Disk | RAM | OS |
| --- | --- | --- | --- | --- |
| Minis Forum Ryzen 5 4500U  | Control Plane | 512GB NVME | 16 GB | Debian 12 |
| HP EliteDesk 800 G2 i5-6500T  | Control Plane | 480GB SATA SSD | 16 GB | Debian 12 |
| Dell Optiplex 3040 i5-6500T  | Control Plane | 480GB SATA SSD | 16 GB | Debian 12 |

### NAS

| Device | Disk | RAM |
| --- | --- | --- |
| Synology DS218+ | 2x16 TB | 6GB RAM |

### Misc.

| Device | Used for |
| --- | --- |
| Raspberry Pi 4 4GB | Klipper/Moonraker/Fluidd |
| Raspberry Pi 2 | - |

## Requirements

```
age
cilium-cli
flux2
go-task
helm
kubectl
kustomize
python
sops
stern
yq
```

### Setup Python Virtual Environment

```
task deps
```

## License

MIT

## Acknowledgments

[`flux-cluster-template`](https://github.com/onedr0p/flux-cluster-template), [`onedr0p/home-ops`](https://github.com/onedr0p/home-ops) and the k8s-at-home community

