
target "dapp" {
}

variable "TAG" {
  default = "devel"
}

variable "DOCKER_ORGANIZATION" {
  default = "cartesi"
}

target "server-localhost" {
  tags = ["${DOCKER_ORGANIZATION}/dapp:worldcup2022-${TAG}-localhost-server"]
}

target "server-goerli" {
  tags = ["${DOCKER_ORGANIZATION}/dapp:worldcup2022-${TAG}-goerli-server"]
}

target "console" {
  tags = ["${DOCKER_ORGANIZATION}/dapp:worldcup2022-${TAG}-console"]
}

target "machine-localhost" {
  tags = ["${DOCKER_ORGANIZATION}/dapp:worldcup2022-${TAG}-localhost-machine"]
}

target "machine-goerli" {
  tags = ["${DOCKER_ORGANIZATION}/dapp:worldcup2022-${TAG}-goerli-machine"]
}
