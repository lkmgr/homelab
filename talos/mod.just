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

[doc('Render Talos config for a node')]
[script]
render-config node:
    talosctl machineconfig patch \
        <(just talos template "{{ source_directory() }}/machineconfig.yaml.j2" "{{ source_directory() }}/vars.yaml") \
        -p @<(just talos template "{{ source_directory() }}/{{ node }}.yaml.j2" "{{ source_directory() }}/vars.yaml")

[script]
download-image type version:
    export SCHEMATIC="$(just talos schematic-id {{ type }})"
    curl -fL --remove-on-error --retry 5 --retry-delay 5 --retry-all-errors --progress-bar \
        -o "{{ source_directory() }}/talos-{{ version }}-${SCHEMATIC:0:8}.iso" \
        "https://factory.talos.dev/image/${SCHEMATIC}/{{ version }}/metal-amd64.iso"
    just log info "Downloaded Talos" version "{{ version }}" schematic "${SCHEMATIC}"

schematic-id type:
    curl -sX POST --data-binary @"{{ source_directory() }}/schematics/{{ type }}.yaml" "https://factory.talos.dev/schematics" | jq -r '.id'
