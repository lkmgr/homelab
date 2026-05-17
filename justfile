#!/usr/bin/env -S just --justfile

set lazy
set quiet
set shell := ['bash', '-euo', 'pipefail', '-c']

[group: 'Bootstrap']
mod bootstrap 'bootstrap'

[group: 'Kube']
mod kube 'kubernetes'

[group: 'Talos']
mod talos 'talos'

[private]
default:
    just -l

[private]
log lvl msg *args:
    gum log -t rfc3339 -s -l "{{ lvl }}" "{{ msg }}" {{ args }}
