import { WsProvider } from '@polkadot/api';
import { ApiOptions } from '@polkadot/api/types';

const getProviderInfo = (providerPort: string, types: ApiOptions['types']) => {
  const hasher = null;

  return {
    hasher,
    provider: new WsProvider(`ws://localhost:${providerPort}`),
    types
  };
};

export const substrateProviders = (sourceChainPort, targetChainPort) => {
  const sourceChain = getProviderInfo(sourceChainPort, {});
  const targetChain = targetChainPort ? getProviderInfo(targetChainPort, {}) : undefined;

  return [
    {
      hasher: sourceChain.hasher,
      types: sourceChain.types,
      provider: sourceChain.provider
    },
    {
      hasher: targetChain?.hasher,
      types: targetChain?.types,
      provider: targetChain?.provider
    }
  ];
};