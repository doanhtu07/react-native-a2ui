# Versioning Guidelines for Early-Stage Packages (`0.x.x`)

All internal and workspace packages must strictly adhere to Semantic Versioning (SemVer) during pre-release and early development phases:

1. **Initial Baseline Release (`0.0.0` → `0.1.0`)**
   - Use a **Minor** bump (`0.1.0`) for the first working baseline or usable milestone across workspace packages.
   - Use **Patch** bumps (`0.0.1`) strictly for early configuration fixes or internal refactoring prior to functional parity.

2. **Pre-1.0 Iterations (`0.x.x`)**
   - **Patch (`0.x.Y`):** Backwards-compatible bug fixes, minor internal optimizations, or documentation updates.
   - **Minor (`0.X.0`):** New backwards-compatible features **OR** breaking API changes prior to baseline stability (Package managers treat `0.1.x` → `0.2.0` as breaking).

3. **Promoting to Production (`1.0.0`)**
   - Reserve **Major** bumps (`1.0.0`) exclusively for declaring public API stability and backward-compatibility commitments across consumer applications.

4. **Changeset Instructions**
   - When generating changesets via CLI:
     - Select `minor` for breaking changes while version is below `1.0.0`.
     - Select `major` only when explicitly promoting the workspace to its stable `1.0.0` release.

# Versioning Guidelines for Production Packages (`1.0.0+`)

Once a package reaches version `1.0.0` or higher, Semantic Versioning (SemVer) rules strictly enforce backward-compatibility commitments:

1. **Major Bumps (`X.0.0`)**
   - **Trigger:** Any breaking change to the public API, type signatures, exported assets, or runtime requirements.
   - **Examples:**
     - Renaming or removing exported functions, components, hooks, or interfaces.
     - Changing function parameter ordering, return types, or required props.
     - Dropping support for underlying platform/framework versions (e.g., Node, React Native, Angular).
     - Altering default state or runtime behaviors in ways that break existing code.

2. **Minor Bumps (`1.X.0`)**
   - **Trigger:** New features added in a backward-compatible manner.
   - **Examples:**
     - Adding new optional props, methods, configuration options, or parameters.
     - Introducing new sub-path exports without removing existing ones.
     - Deprecating an API without removing it (accompanied by runtime or editor warnings).
     - Performance optimizations that alter underlying execution without changing behavior.

3. **Patch Bumps (`1.0.X`)**
   - **Trigger:** Backward-compatible bug fixes and minor internal operational updates.
   - **Examples:**
     - Fixing broken component logic, memory leaks, or state edge cases.
     - Internal code refactoring, dependency updates, or bundler build target optimizations.
     - Type-definition corrections that fix incorrect compiler errors without altering runtime types.

4. **Changeset Instructions (`1.0.0+`)**
   - **`patch`**: Routine bug fixes or non-breaking maintenance.
   - **`minor`**: New features, new exports, or soft deprecations.
   - **`major`**: Any change that requires consumers to update their application code or peer dependencies to compile or run correctly.

# Release Channels (`alpha` / `beta` / stable)

A version reaches production through up to three channels. The bump level is
decided exactly as above — the channel only controls _who sees the build_, never
_how much the version moves_.

| Channel | Environment | Version shape   | npm dist-tag | GitHub Release |
| ------- | ----------- | --------------- | ------------ | -------------- |
| `alpha` | QA          | `1.2.0-alpha.N` | `alpha`      | Pre-release    |
| `beta`  | UAT         | `1.2.0-beta.N`  | `beta`       | Pre-release    |
| stable  | Production  | `1.2.0`         | `latest`     | Latest release |

1. **Channel Rules**
   - A prerelease always carries the **target** stable version. `1.2.0-alpha.0`
     is a candidate for `1.2.0`; it never ships as `1.1.x`.
   - Only a stable version may occupy the `latest` dist-tag. QA and UAT builds
     are installable by name (`@copartit/…@alpha`) but never resolve for a
     consumer on a plain semver range.
   - Channels move forward only: `alpha` → `beta` → stable. Promote by
     re-cutting the same target version on the next channel; never demote a
     `beta` back to `alpha` — cut a fresh `alpha` on a higher target instead.
   - `-alpha.N` and `-beta.N` are the only accepted suffixes. CI rejects any
     other prerelease shape.

2. **Choosing the Bump Before Entering a Channel**
   - Decide `patch` / `minor` / `major` from the sections above **first**, then
     enter the channel. Entering `alpha` on an undecided bump produces a
     prerelease of the wrong target version.
   - Additional changesets added while a channel is active re-derive the target.
     A `minor` changeset landing on top of `1.2.0-alpha.0` moves subsequent
     prereleases to `1.3.0-alpha.N`, which is correct and expected.

3. **Changeset Instructions (Channels)**
   - `pnpm changeset pre enter alpha` — begin QA prereleases.
   - `pnpm changeset pre enter beta` — begin UAT prereleases (exit `alpha` first).
   - `pnpm changeset pre exit` — leave prerelease mode; the next
     `changeset version` stamps the stable release.
   - Each `changeset version` inside a channel increments the trailing counter
     (`alpha.0` → `alpha.1`). Cut as many as QA/UAT needs; the counter is cheap.
   - Prerelease state lives in `.changeset/pre.json` and **must be committed** —
     it is what keeps the channel active for the branch.

See [`docs/packages/publish.md`](../packages/publish.md) for the commands that
cut and ship each channel.
