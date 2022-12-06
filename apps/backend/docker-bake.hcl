
group "default" {
  targets = ["dapp", "server-localhost", "console"]
}

group "goerli" {
  targets = ["dapp", "server-goerli", "console"]
}

target "fs" {
  context = "./docker"
  target  = "dapp-fs-build"
  contexts = {
    dapp-build = "target:dapp"
  }
}

target "server-localhost" {
  context = "./docker"
  target  = "machine-server"
  args = {
    CHAIN_ID = 31337
  }
  contexts = {
    dapp-build = "target:dapp"
  }
}

target "server-goerli" {
  context = "./docker"
  target  = "machine-server"
  args = {
    CHAIN_ID = 5
  }
  contexts = {
    dapp-build = "target:dapp"
  }
}

target "console" {
  context = "./docker"
  target  = "machine-console"
  contexts = {
    dapp-build = "target:dapp"
  }
}

target "machine-localhost" {
  context = "./docker"
  target  = "machine-standalone"
  args = {
    CHAIN_ID = 31337
  }
  contexts = {
    dapp-build = "target:dapp"
  }
}

target "machine-goerli" {
  context = "./docker"
  target  = "machine-standalone"
  args = {
    CHAIN_ID = 5
  }
  contexts = {
    dapp-build = "target:dapp"
  }
}
