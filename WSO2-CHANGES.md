# WSO2 fork of jsonpath-plus

| | |
| --- | --- |
| Package | `@wso2/jsonpath-plus` |
| Upstream | [JSONPath-Plus/JSONPath](https://github.com/JSONPath-Plus/JSONPath) |
| Base | tag `v10.4.1`, commit `154567f` |
| Release line | branch `10.4.x` |

Metadata changes only; library behaviour is identical to the base tag. `v10.4.1`
is upstream's latest release, which upstream never published to npm. See
`git diff 154567f` for the delta.

## Why this exists

Some WSO2 products still build on Node 16 — the API Manager publisher portal
among them. `jsonpath-plus` 10.x declares `engines.node: ">=18.0.0"`, and those
projects set `engine-strict=true`, which turns that declaration into a hard
install failure rather than a warning.

The declared floor is stricter than the code requires — 10.4.1 runs correctly on
Node 16.9.0 and later. This fork declares the accurate floor so the dependency
installs on Node 16.

That matters because `@stoplight/spectral-core` 1.23.1 depends on
`jsonpath-plus@^10.3.0`. Without a corrected floor, that upgrade cannot be
installed on Node 16 at all.

Retire the fork once the products that need it have moved to Node 18, or when
upstream lowers its declared floor. Do not add WSO2-specific features; the fork
tracks upstream, it does not diverge from it.

## Versioning and branches

Releases carry the upstream version number with no suffix: `10.4.1` means
upstream 10.4.1 plus the changes above. Branch `10.4.x` is the 10.4 line; `main`
mirrors upstream and carries no library changes. When upstream releases 10.4.2,
rebase `10.4.x` onto `v10.4.2` and publish `10.4.2`.

Releases are dispatched from the default branch, which is where
`.github/workflows/release.yml` lives, naming the release line as an input. It
checks that branch out, verifies, tags and publishes.

Releases are tagged `v10.4.1`. Upstream tags the same names at different
commits, so fetch upstream into its own namespace rather than over ours:
`git fetch oss "refs/tags/*:refs/tags/upstream/*"`.

Since the version carries no WSO2 marker, **every GitHub release must record the
upstream base tag and commit SHA in its notes** — that is the only record of
what a given build derives from.

## Using it

`jsonpath-plus` is normally a transitive dependency, so redirect it by name:

```json
{
  "overrides": {
    "jsonpath-plus": "npm:@wso2/jsonpath-plus@10.4.1"
  }
}
```

Three things that fail quietly or confusingly:

- **npm 8.3.0+ is required.** Earlier versions ignore `overrides` silently.
- **A direct dependency must be changed to the same alias**, not left as a
  semver range — npm compares specification strings, so a range plus an override
  fails with `EOVERRIDE ... conflicts with direct dependency`.
- **pnpm 10+ reads overrides from `pnpm-workspace.yaml`.** The `pnpm.overrides`
  key in `package.json` is ignored without warning.

## Requirements

- **Node 16.9.0+** — `Object.hasOwn` and `Error` `cause` need 16.9.0. Upstream
  declares `>=18.0.0`, which is stricter than the code requires; this fork
  declares the accurate floor. Building the package needs 18.18+.
- **Chrome/Edge 93+, Firefox 92+, Safari 15.4+** — the browser bundle uses
  `Object.hasOwn` and ships no polyfill. This is a higher floor than
  jsonpath-plus 6.x and 7.x, which did not use it.
