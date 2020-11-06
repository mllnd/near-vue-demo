const CONTRACT_NAME = process.env.VUE_APP_CONTRACT_NAME || 'mllnd.testnet';

module.exports = {
  nodeUrl: 'https://rpc.testnet.near.org',
  walletUrl: 'https://wallet.testnet.near.org',
  helperUrl: 'https://helper.testnet.near.org',
  contractName: CONTRACT_NAME,
  networkId: 'default'
};
