set quiet
set shell := ['bash', '-euo', 'pipefail', '-c']
set script-interpreter := ['bash', '-euo', 'pipefail']

[private]
default:
    just -l kube

reconcile:
    flux -n flux-system reconcile kustomization cluster-apps --with-source

# Snapshot a single app's replication source
[script]
snapshot app ns='default':
    if ! kubectl --namespace "{{ ns }}" get replicationsources "{{ app }}" &>/dev/null; then
        just log error "ReplicationSource not found" app "{{ app }}" namespace "{{ ns }}"
        exit 1
    fi
    just log info "Triggering snapshot" app "{{ app }}" namespace "{{ ns }}"
    kubectl --namespace "{{ ns }}" patch replicationsources "{{ app }}" \
        --type merge \
        -p "{\"spec\":{\"trigger\":{\"manual\":\"$(date +%s)\"}}}"
    job="volsync-src-{{ app }}"
    just log info "Waiting for job to appear..." job "$job"
    until kubectl --namespace "{{ ns }}" get job/"$job" &>/dev/null; do
        sleep 5
    done
    just log info "Waiting for job to complete..." job "$job"
    kubectl --namespace "{{ ns }}" wait job/"$job" \
        --for=condition=complete \
        --timeout=120m
    just log info "Snapshot complete" app "{{ app }}" namespace "{{ ns }}"

# Snapshot all apps with a replication source in a namespace
[script]
snapshot-all ns='default':
    apps="$(kubectl --namespace "{{ ns }}" get replicationsources \
        -o jsonpath='{.items[*].metadata.name}')"
    if [[ -z "$apps" ]]; then
        just log warn "No replication sources found" namespace "{{ ns }}"
        exit 0
    fi
    for app in $apps; do
        just kube snapshot "$app" "{{ ns }}"
    done
