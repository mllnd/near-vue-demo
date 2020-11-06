import Vue from 'vue';
import Vuex from 'vuex';
import * as nearApi from 'near-api-js';
import nearConfig from './near';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    contract: null,
    currentUser: null,
    wallet: null,
    nearConfig: null
  },
  getters: {
    contract: state => state.contract,
    currentUser: state => state.currentUser,
    wallet: state => state.wallet,
    nearConfig: state => state.nearConfig
  },
  mutations: {
    setupNear(state, payload) {
      state.contract = payload.contract;
      state.currentUser = payload.currentUser;
      state.wallet = payload.wallet;
      state.nearConfig = payload.nearConfig;
    }
  },
  actions: {
    async initNear({ commit }) {
      // Initialize connection to TestNet.
      const near = await nearApi.connect({
        deps: {
          keyStore: new nearApi.keyStores.BrowserLocalStorageKeyStore()
        },
        ...nearConfig
      });

      const wallet = new nearApi.WalletConnection(near);

      let currentUser;

      if (wallet.getAccountId()) {
        currentUser = {
          accountId: wallet.getAccountId(),
          balance: (await wallet.account().state()).amount
        }
      }

      const contract = await new nearApi.Contract(wallet.account(), process.env.VUE_APP_CONTRACT_NAME || 'mllnd.testnet', {
        viewMethods: ['getMessages'],
        changeMethods: ['addMessage'],
        sender: wallet.getAccountId()
      });
      // Commit and send to mutation.
      commit('setupNear', { contract, currentUser, wallet, nearConfig });
    }
  }
});

export default store;
