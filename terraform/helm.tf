resource "helm_release" "secrets_store_csi_driver" {
  name       = "csi-secrets-store"
  repository = "https://kubernetes-sigs.github.io/secrets-store-csi-driver/charts"
  chart      = "secrets-store-csi-driver"
  version    = "1.6.1"
  namespace  = "kube-system"

  set = [
    {
      name  = "syncSecret.enabled"
      value = "true"
    },
    {
      name  = "enableSecretRotation"
      value = "true"
    },
    {
      name  = "tokenRequests[0].audience"
      value = "sts.amazonaws.com"
    },
    {
      name  = "tokenRequests[1].audience"
      value = "pods.eks.amazonaws.com"
    }
  ]

  depends_on = [
    aws_eks_cluster.main
  ]
}

resource "helm_release" "secrets_provider_aws" {
  name       = "secrets-provider-aws"
  repository = "https://aws.github.io/secrets-store-csi-driver-provider-aws"
  chart      = "secrets-store-csi-driver-provider-aws"
  version    = "3.1.3"
  namespace  = "kube-system"

  set = [
    {
      name  = "secrets-store-csi-driver.install"
      value = "false"
    }
  ]

  depends_on = [
    helm_release.secrets_store_csi_driver
  ]
}
