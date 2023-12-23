# Longhorn

## Default path (`/var/lib/longhorn`)

```sh
kubectl label nodes <name> node.longhorn.io/create-default-disk=true
```

## Custom path (`/mnt/longhorn`)

```sh
kubectl label nodes <name> node.longhorn.io/create-default-disk=config
kubectl annotate nodes <name> node.longhorn.io/default-disks-config='[{"path":"/mnt/longhorn"}]'
```

## Checks

### Node Labels

```sh
kubectl get nodes <name> --show-labels
```

### Node Annotations

```sh
kubectl get nodes <name> -o jsonpath='{.metadata.annotations}'
```
