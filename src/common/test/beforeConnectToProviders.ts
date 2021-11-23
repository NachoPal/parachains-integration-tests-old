// import connectToProviders from '../connectToProviders';
import {
  connectToProviders,
  getWallet,
  getLaunchConfig,
  getBalance,
  getApisFromRelays
} from '../../common';

export const beforeConnectToProviders = (
    { relay: { senderRelay, receiverRelay }, para: { senderPara, receiverPara }}
  ) => {
    let config = getLaunchConfig()

    return(
      before(async function() {
        let config = getLaunchConfig()

        const relayPort = config.relaychain.nodes[0].wsPort
        const paraPort = config.parachains[0].nodes[0].wsPort

        const relayChains = await connectToProviders(relayPort, undefined);
        const paraChains = await connectToProviders(paraPort, undefined);
      
        const { sourceApi: relaySourceApi } = getApisFromRelays(relayChains);
        const { sourceApi: paraSourceApi } = getApisFromRelays(paraChains);
      
        this.paraSourceApi = paraSourceApi
        this.relaySourceApi = relaySourceApi

        this.senderRelay = await getWallet(senderRelay)
        this.receiverRelay = await getWallet(receiverRelay)

        this.senderPara = await getWallet(senderPara)
        this.receiverPara = await getWallet(receiverPara)
      
        this.senderRelayBalance = await getBalance(relaySourceApi, this.senderRelay.address)
        this.receiverParaBalance = await getBalance(paraSourceApi, this.receiverPara.address)
      
        this.senderParaBalance = await getBalance(paraSourceApi, this.senderPara.address)
        this.receiverRelayBalance = await getBalance(relaySourceApi, this.receiverRelay.address)
      })
    )
}