set no-exit-message
set quiet
set script-interpreter := ['bash', '-euo', 'pipefail']
set shell := ['bash', '-euo', 'pipefail', '-c']

bootstrap_dir := justfile_dir() + '/bootstrap'
kubernetes_dir := justfile_dir() + '/kubernetes'

controller := `talosctl config info -o yaml | yq -e '.endpoints[0]'`

[private]
default:
    just -l bootstrap

[script]
k8s:
    just log info "Bootstrapping..." "stage" "$(basename "$0")"
    until op=$(talosctl -n "{{ controller }}" bootstrap 2>&1 || true) && [[ "$op" == *"AlreadyExists"* ]]; do
        just log info "Kubernetes bootstrap in progress. Retrying in 5 seconds..." "stage" "$(basename "$0")"
        sleep 5
    done

apps: (kubeconfig "node") ready apps-ns apps-secrets apps-crds apps-helm kubeconfig flux
    just log info "Cluster is bootstrapped — Flux will start syncing the Git repository"

[private]
[script]
ready:
    # Talos requires nodes to be Ready=False before applying resources; already-Ready
    # is also acceptable (re-run after the cluster is up).
    if kubectl wait nodes --for=condition=Ready=True --all --timeout=10s &>/dev/null; then
        just log info "Nodes are Ready, skipping wait"
        exit 0
    fi
    until kubectl wait nodes --for=condition=Ready=False --all --timeout=10s &>/dev/null; do
        just log info "Nodes not yet available, retrying in 10s..."
        sleep 10
    done
    just log info "Nodes available"

[script]
kubeconfig lb="cilium":
    just log info "Getting kubeconfig..." "stage" "$(basename "$0")"
    if ! talosctl kubeconfig -n "{{ controller }}" -f --force-context-name main {{ justfile_dir() }}; then
        just log fatal "Failed to fetch kubeconfig" "stage" "$(basename "$0")"
    fi
    if [[ "{{ lb }}" != "cilium" ]]; then
        if ! kubectl config set-cluster main --server "https://{{ controller }}:6443"; then
            just log fatal "Failed to set kubectl cluster server address" "stage" "$(basename "$0")"
        fi
    fi

[script]
apps-ns:
    just log info "Creating namespaces..." "stage" "$(basename "$0")"
    for app in "{{ kubernetes_dir }}/apps"/*/; do
        ns="$(basename "$app")"
        if kubectl get namespace "$ns" &>/dev/null; then
            just log info "Namespace already exists" namespace "$ns"
        elif kubectl create namespace "$ns" --dry-run=client -o yaml \
                | kubectl apply --server-side --filename - &>/dev/null; then
            just log info "Namespace applied" namespace "$ns"
        else
            just log error "Failed to apply namespace" namespace "$ns"
            exit 1
        fi
    done

[script]
apps-secrets:
    just log info "Creating initial secrets..." "stage" "$(basename "$0")"
    for secret in \
        "{{ bootstrap_dir }}/github-deploy-key.sops.yaml" \
        "{{ bootstrap_dir }}/github-extra-deploy-key.sops.yaml" \
        "{{ bootstrap_dir }}/sops-age.sops.yaml" \
        "{{ kubernetes_dir }}/flux/vars/cluster-secrets.sops.yaml"
    do
        name="$(basename "$secret" .sops.yaml)"
        if sops exec-file "$secret" \
                "kubectl -n flux-system apply --server-side --filename {}" &>/dev/null; then
            just log info "Secret applied" resource "$name"
        else
            just log fatal "Failed to apply secret" resource "$name"
        fi
    done

[script]
apps-crds:
    just log info "Installing CRDs..." "stage" "$(basename "$0")"
    helmfile_file="{{ bootstrap_dir }}/helmfile.d/00-crds.yaml"
    crds="$(helmfile --file "$helmfile_file" template --quiet \
        | yq eval-all --exit-status 'select(.kind == "CustomResourceDefinition")')" \
        || { just log error "Failed to render CRDs" file "$helmfile_file"; exit 1; }
    if echo "$crds" | kubectl diff --filename - &>/dev/null; then
        just log info "CRDs already up-to-date"
        exit 0
    fi
    if echo "$crds" | kubectl apply --server-side --force-conflicts --filename - &>/dev/null; then
        just log info "CRDs applied"
    else
        just log error "Failed to apply CRDs" file "$helmfile_file"
        exit 1
    fi

[script]
apps-helm:
    just log info "Installing apps..." "stage" "$(basename "$0")"
    helmfile --file "{{ bootstrap_dir }}/helmfile.d/01-apps.yaml" sync --hide-notes

[script]
flux:
    just log info "Initial Flux setup..." "stage" "$(basename "$0")"
    kubectl apply --server-side --force-conflicts --kustomize {{ source_directory() }}/flux
    kubectl wait deployment -n flux-system --all --for=condition=Available --timeout=2m
    kubectl apply --server-side --force-conflicts --kustomize {{ kubernetes_dir }}/flux/config
