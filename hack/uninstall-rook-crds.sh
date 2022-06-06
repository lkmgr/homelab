#!/bin/bash

for crd in $(kubectl get crd -o jsonpath="{.items[*].metadata.name}" | tr ' ' '\n' | grep rook.io); do
  kubectl -n rook-ceph get "$crd" -o yaml | sed "s/\- rook.io//g" | kubectl apply -f -
  kubectl -n rook-ceph delete "$crd" --all
  kubectl delete crd/"$crd"
done
