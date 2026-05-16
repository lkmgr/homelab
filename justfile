#!/usr/bin/env -S just --justfile

set quiet
set shell := ['bash', '-euo', 'pipefail', '-c']
set script-interpreter := ['bash', '-euo', 'pipefail']

[group: 'bootstrap']
mod bootstrap 'bootstrap'

[group: 'kubernetes']
mod kube 'kubernetes'

[group: 'talos']
mod talos 'talos'

[private]
default:
    just -l

[private]
log lvl msg *args:
    gum log -t rfc3339 -s -l "{{ lvl }}" "{{ msg }}" {{ args }}
