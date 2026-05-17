set quiet
set script-interpreter := ['bash', '-euo', 'pipefail']
set shell := ['bash', '-euo', 'pipefail', '-c']

[private]
default:
    just -l talos

[private]
template file *args:
    doppler run -p cluster-talos -c main -- minijinja-cli "{{ file }}" {{ args }}

[confirm('Apply Talos config ' + node + ' to IP ' + ip + ' [y|N] ?')]
[doc('Apply Talos config to a node')]
apply-node node ip *args:
    just talos render-config "{{ node }}" | talosctl -n "{{ ip }}" apply-config -f /dev/stdin {{ args }}

[confirm('Upgrade Talos on node ' + node + ' with IP ' + ip + ' [y|N] ?')]
[doc('Upgrade Talos on a node')]
[script]
upgrade-node node ip:
    IMAGE="$(just talos render-config "{{ node }}" | yq 'select(.machine.install.image != null) | .machine.install.image')"
    just log info "Upgrading Talos on node..." ip "{{ ip }}" image "${IMAGE}"
    talosctl upgrade -n "{{ ip }}" --image "${IMAGE}"
    just log info "Successfully upgraded Talos" ip "{{ ip }}" image "${IMAGE}"

[doc('Render Talos config for a node')]
[script]
render-config node:
    talosctl machineconfig patch \
        <(just talos template "{{ source_directory() }}/machineconfig.yaml.j2" "{{ source_directory() }}/vars.yaml") \
        -p @<(just talos template "{{ source_directory() }}/{{ node }}.yaml.j2" "{{ source_directory() }}/vars.yaml")

[arg('type', pattern='intel|amd')]
[arg('version', pattern='v\d+\.\d+.\d+')]
[doc('Download Talos image')]
[script]
download-image type version:
    export SCHEMATIC="$(just talos schematic-id {{ type }})"
    curl -fL --remove-on-error --retry 5 --retry-delay 5 --retry-all-errors --progress-bar \
        -o "{{ source_directory() }}/talos-{{ version }}-${SCHEMATIC:0:8}.iso" \
        "https://factory.talos.dev/image/${SCHEMATIC}/{{ version }}/metal-amd64.iso"
    just log info "Downloaded Talos" version "{{ version }}" schematic "${SCHEMATIC}"

[arg('type', pattern='intel|amd')]
[doc('Get Talos schematic ID')]
schematic-id type:
    curl -sX POST --data-binary @"{{ source_directory() }}/schematics/{{ type }}.yaml" "https://factory.talos.dev/schematics" | jq -r '.id'
