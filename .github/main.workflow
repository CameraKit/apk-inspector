workflow "New workflow" {
  on = "push"
  resolves = ["Test Code"]
}

action "Test Code" {
  uses = "actions/npm@e7aaefe"
  runs = "npm test"
}
