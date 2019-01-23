workflow "New workflow" {
  on = "push"
  resolves = ["test"]
}

action "install" {
  uses = "actions/npm@de7a3705a9510ee12702e124482fad6af249991b"
  args = "install"
}

action "test" {
  uses = "actions/npm@de7a3705a9510ee12702e124482fad6af249991b"
  needs = ["install"]
  args = "test"
}
