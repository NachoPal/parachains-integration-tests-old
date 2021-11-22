require('dotenv').config()
import commandLineArgs from 'command-line-args';
import connectToRelayChains from '../../common/connectToRelayChains';
// import { u8aToHex } from '@polkadot/util'
import getWallet from '../../common/getWallet';
import { signAndSendCallback } from '../../common/signAndSendCallback';
import { assets } from '../../config/eventsEvals';
import getLaunchConfig from '../../common/getLaunchConfig';


const createAsset = async ({ api, id, admin, minBalance, wallet }) => {
  let nonce = await api.rpc.system.accountNextIndex(wallet.address);
  // console.log(u8aToHex(admin.addressRaw))
  let adminObj = { Id: admin.address }

  let eventEval = { eventEval: assets.Created, callback: () => { process.exit(0) }}

  await api.tx.assets.create(id, adminObj, minBalance)
    .signAndSend(
      wallet, 
      { nonce, era: 0 },
      signAndSendCallback([eventEval])
    );
}

const main = async () => {
  const optionDefinitions = [
    { name: 'id', alias: 'i', type: Number },
    { name: 'admin', alias: 'a', type: String },
    { name: 'minBalance', alias: 'm', type: Number },
    { name: 'signer', alias: 's', type: String }
  ]
  const options = commandLineArgs(optionDefinitions);
  const { id, admin, minBalance, signer } = options;

  let config = getLaunchConfig()
  const paraPort = config.parachains[0].nodes[0].wsPort

  const relayChain = await connectToRelayChains(paraPort, undefined);

  const data = { // source
    api: relayChain.source.chain.api,
    id,
    admin: await getWallet(admin),
    minBalance,
    wallet: await getWallet(signer)
  }

  await createAsset(data)  
}

main()