# External Proxy Ingress

Credit: https://github.com/JJGadgets/Biohazard/blob/0892c3da33f919cf6801430b17cd545a6a2cdf93/kube/deploy/core/ingress/external-proxy-x/README.md

## Diagram

```mermaid
sequenceDiagram
    participant User
    participant VPS
    box Cluster
    participant Tailscale Pod
    participant haproxy
    participant nginx
    end
    User->>VPS: Visit URL
    VPS->>Tailscale Pod: Proxy TCP traffic<br/>with Proxy Protocol<br/>to haproxy Cluster IP<br/>through Tailscale
    Tailscale Pod->>+haproxy: Forward to haproxy Service
    Note right of haproxy: Decrypt HTTPS,<br/>add Forwarded header,<br/>Reencrypt HTTPS
    haproxy->>-nginx: Forward to nginx
    nginx-->>User: Return
```

## VPS haproxy configuration

See [config file applied with Ansible](/ansible/vps/roles/haproxy/templates/haproxy.cfg.j2)

## Advantages

- Hide home network IP
- No ports opened at home
- No dynamic DNS because of changing IP at home
