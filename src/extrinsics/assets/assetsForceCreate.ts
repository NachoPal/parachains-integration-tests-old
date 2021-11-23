require('dotenv').config()
import commandLineArgs from 'command-line-args';
import {
  connectToProviders,
  getWallet,
  getLaunchConfig,
  signAndSendCallback
} from '../../common';
import { sudo, assets } from '../../config/eventsEvals';


const forceCreateAsset = async ({ api, id, owner, isSufficient, minBalance, wallet }) => {
  let nonce = await api.rpc.system.accountNextIndex(wallet.address);
  // console.log(u8aToHex(admin.addressRaw))
  let ownerObj = { Id: owner.address }

  let eventEvalSudo = { eventEval: sudo.Sudid, callback: () => {} }
  let eventEvalForceCreated = { eventEval: assets.ForceCreated, callback: () => { process.exit(0) }}

  await api.tx.sudo.
			sudo(api.tx.assets.forceCreate(id, ownerObj, isSufficient, minBalance)).
      signAndSend(
        wallet, 
        { nonce, era: 0 },
        signAndSendCallback([eventEvalSudo, eventEvalForceCreated])
      );
}

const main = async () => {
  const optionDefinitions = [
    { name: 'id', alias: 'i', type: Number },
    { name: 'owner', alias: 'o', type: String },
    { name: 'isSufficient', alias: 'u', type: Boolean },
    { name: 'minBalance', alias: 'm', type: Number },
    { name: 'signer', alias: 's', type: String }
  ]
  const options = commandLineArgs(optionDefinitions);
  const { id, owner, isSufficient, minBalance, signer } = options;

  let config = getLaunchConfig()
  const paraPort = config.parachains[0].nodes[0].wsPort

  const relayChain = await connectToProviders(paraPort, undefined);

  const data = { // source
    api: relayChain.source.chain.api,
    id,
    owner: await getWallet(owner),
    isSufficient,
    minBalance,
    wallet: await getWallet(signer)
  }

  await forceCreateAsset(data)  
}

main()