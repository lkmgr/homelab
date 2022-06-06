#!/bin/bash

for crd in $(kubectl get crd -o jsonpath="{.items[*].metadata.name}" | tr ' ' '\n' | grep longhorn.io); do
  kubectl -n longhorn-system get "$crd" -o yaml | sed "s/\- longhorn.io//g" | kubectl apply -f -
  kubectl -n longhorn-system delete "$crd" --all
  kubectl delete crd/"$crd"
done
