import commandLineArgs from 'command-line-args';
import {
  connectToProviders,
  getWallet,
  getLaunchConfig
} from '../../common'

const forceXcmVersion = async ({ api, location, version, wallet, pallet }) => {
  let nonce = await api.rpc.system.accountNextIndex(wallet.address);
  await api.tx.sudo
			.sudo(api.tx[pallet].forceXcmVersion(location, version))
			.signAndSend(wallet, { nonce, era: 0 });
}

const forceDefaultXcmVersion = async ({ api, version, wallet, pallet }) => {
  let nonce = await api.rpc.system.accountNextIndex(wallet.address);
  await api.tx.sudo
			.sudo(api.tx[pallet].forceDefaultXcmVersion(version))
			.signAndSend(wallet, { nonce, era: 0 });
}

const main = async () => {
  const optionDefinitions = [
    { name: 'chain', alias: 'c', type: String },
    { name: 'uri', alias: 'u', type: String },
    { name: 'id', alias: 'i', type: Number },
    { name: 'version', alias: 'v', type: Number}
  ]
  const options = commandLineArgs(optionDefinitions);
  const { chain, id, version, uri } = options;
  let config = getLaunchConfig()

  let port
  let location
  let pallet

  if (chain === 'relay') {
    port = config.relaychain.nodes[0].wsPort
    location = { parent: 0, interior: { x1: { parachain: id }}}
    pallet = 'xcmPallet'
  } else if (chain === 'para') {
    port = config.parachains[0].nodes[0].wsPort
    location = { parent: 1, interior: { here: true }}
    pallet = 'polkadotXcm'
  }

  const chainProvider = await connectToProviders(port, undefined);

  const data = { // source
    api: chainProvider.source.chain.api,
    location,
    version,
    wallet: await getWallet(uri),
    pallet
  }

  if (chain === 'para') {
    await forceDefaultXcmVersion(data)  
  }

  if (chain === 'relay') {
    await forceXcmVersion(data)
  }  
  
  process.exit(0)
}

main()