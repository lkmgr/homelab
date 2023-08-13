# Pulumi

## Synology NAS

### Preparation

In Synology UI:

- Enable SSH
- Install Docker

On local machine:

- `ssh-copy-id $ADMIN@$IP`
- `ssh $ADMIN@$IP`

On Synology:

- `sudo synogroup --add docker $ADMIN`
- `sudo chown root:docker /var/run/docker.sock`
- set `PermitUserEnvironment` to `yes` in `/etc/ssh/sshd_config`
- `sudo synosystemctl restart sshd.service`
- `env | grep PATH | tee .ssh/environment`

Credit: https://qmacro.org/blog/posts/2021/06/12/remote-access-to-docker-on-my-synology-nas/
