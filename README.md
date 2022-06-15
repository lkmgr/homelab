<div align="center">

### My Homelab Repository

</div>

## Hardware

### Kubernetes Cluster

| Device | Type | Disk | RAM | OS |
| --- | --- | --- | --- | --- |
| Minis Forum Ryzen 5 4500U  | Master | 512GB NVME | 16 GB | Ubuntu 22.04 |
| HP EliteDesk 800 G2 i5-6500T  | Worker | 240GB SATA SSD | 16 GB | Ubuntu 22.04 |
| Dell Optiplex 3040 i5-6500T  | Worker | 240GB SATA SSD | 16 GB | Ubuntu 22.04 |

> Currently only one Master and only Local Path storage until I get better SSDs  
> (etcd fsync delays were sometimes too high with the cheap 240GB drives)

### NAS

| Device | Disk | RAM |
| --- | --- | --- |
| Synology DS218+ | 2x4 TB | 6GB RAM |

### Misc.

| Device | Used for |
| --- | --- |
| Raspberry Pi 4 4GB with USB SSD | Klipper/Moonraker/Fluidd |
| Raspberry Pi 2 | - |

## License

MIT

## Acknowledgments

[k8s-at-home Community](https://github.com/k8s-at-home), based on [`template-cluster-k3s`](https://github.com/k8s-at-home/template-cluster-k3s)
