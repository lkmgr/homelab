{ pkgs ? import (fetchTarball "https://github.com/NixOS/nixpkgs/archive/d14ae62671fd4eaec57427da1e50f91d6a5f9605.tar.gz") {} }:

pkgs.mkShell {
  buildInputs = with pkgs; [
    kubectl
    fluxcd
    sops
    gnupg
    pre-commit
    kubernetes-helm
    go-task
    yamllint

    nodejs-16_x
    nodePackages.prettier
    nodePackages.markdownlint-cli
  ];
}
