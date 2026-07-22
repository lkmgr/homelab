set quiet
set script-interpreter := ['bash', '-euo', 'pipefail']
set shell := ['bash', '-euo', 'pipefail', '-c']

[private]
default:
    just -l kube

[doc('Prune pods in Failed, Pending, or Succeeded state')]
[script]
prune-pods:
    for phase in Failed Pending Succeeded; do
        kubectl delete pods -A --field-selector status.phase="$phase" --ignore-not-found=true
    done

[doc('Snapshot a single app with VolSync')]
[script]
snapshot ns app:
    if ! kubectl -n "{{ ns }}" get replicationsources "{{ app }}" &>/dev/null; then
        just log error "ReplicationSource not found" namespace "{{ ns }}" app "{{ app }}"
        exit 1
    fi
    just log info "Triggering snapshot" namespace "{{ ns }}" app "{{ app }}"
    kubectl -n "{{ ns }}" patch replicationsources "{{ app }}" --type merge \
        -p '{"spec":{"trigger":{"manual":"$(date +%s)"}}}'
    job="volsync-src-{{ app }}"
    just log info "Waiting for job to appear..." job "$job"
    until kubectl -n "{{ ns }}" get job/"$job" &>/dev/null; do
        sleep 5
    done
    just log info "Waiting for job to complete..." job "$job"
    kubectl -n "{{ ns }}" wait job/"$job" --for=condition=complete --timeout=120m
    just log info "Snapshot complete" namespace "{{ ns }}" app "{{ app }}"

[doc('Snapshot all apps with VolSync')]
[script]
snapshot-all:
    kubectl get replicationsources --no-headers -A | while read -r ns name _; do
        kubectl -n "$ns" patch replicationsources "$name" --type merge \
            -p '{"spec":{"trigger":{"manual":"$(date +%s)"}}}'
    done

[doc('Debug a node')]
[script]
debug-node node:
    trap 'kubectl delete pod -n default -l app.kubernetes.io/managed-by=kubectl-debug --field-selector spec.nodeName={{ node }} --ignore-not-found --wait=false' EXIT
    kubectl debug node/{{ node }} -n default -it --image=mirror.gcr.io/alpine:latest --profile=sysadmin
