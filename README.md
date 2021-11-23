# Introduction
The goal of this repository is to provide **Integraton Tests** for the **Common & System Parachains** in the Polkadot ecosystem. The tests are expected to be run against a _Parachain<>Relaychain_ local deployment using [Polkadot Launch](https://github.com/paritytech/polkadot-launch).

A CLI (which the tests make use of) is also available to interact directly with the chains.

# Versioning
Each _Parachain<>Relaychain_ combination has its own features and configurations. Thus, not all tests are valid for all possible _Parachain<>Relaychain_ combination. Because of it, it is necessary to have different branches for each combination and keep a well structured naming format:

```
release-<parachain_name>-<parachain_version>-<relaychain_name>-<relaychain_version>
```

For example: `release-westmint-v6-westend-v0.9.13` is telling us that:
- `polkadot-v0.9.13` from [Cumulus](https://github.com/paritytech/cumulus/tree/polkadot-v0.9.13)
- `release-statemine-v6` from [Cumulus](https://github.com/paritytech/cumulus/tree/release-statemine-v6)

releases were used to build the binaries that `polkadot-launch` did make use of.

Each release branch will also inlude the `config.json` file that was used to deploy the `polkadot-launch` infra the tests where developed for.

**Note**: The `master` branch of this repository will be up to date with the last release of the _Westmint<>Westend_ combinantion.

# Set up
- **In the Polkadot Launch repository**: follow the [installation instructions](https://github.com/paritytech/polkadot-launch)
- **In this repository**: `yarn`

# How to run
1. **In the Polkadot Launch repository**: deploy a Parachain<>Relaychain local deployment with `polkadot-launch`. You'll find the config file to use in the root directory of this repository -> `./config.js`
    ```
    yarn start config.js
    ```
2. **In this repository**: in case you are using a different config file, update `env` file accordingly.
    ```
    POLKADOT_LAUNCH_CONFIG_PATH = '<path_to_config_file>'
    ```
3. Once the _Parachain_ is producing blocks:
    ```
    yarn test
    ```
# Tests
To run all tests: `yarn test`

Implemented tests:

- **xcm** -> `$ yarn test:xcm`
  - `$ yarn test:xcm:limited-teleport-asset` -> Limited Teleport Asset (DMP & UMP)
  - `$ yarn test:xcm:transact` -> Transact (DMP & UMP)

- **assets** -> `$ yarn test:assets`

- **uniques** -> `$ yarn test:uniques`

# Contributions

PRs and contributions are welcome :)