import Vue from 'vue';
import Vuex from 'vuex';
import * as nearApi from 'near-api-js';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    numbers: [
      12,
      33
    ],
    contract: null,
    currentUser: null,
    wallet: null
  },
  getters: {
    allnumbers: state => state.numbers,
    smallNumbers(state) {
      return state.numbers.filter(i => {
        return i <= 30;
      });
    },
    bigNumbers(state) {
      return state.numbers.filter(i => {
        return i > 30
      });
    },
    contract: state => state.contract,
    currentUser: state => state.currentUser,
    wallet: state => state.wallet,
  },
  mutations: {
    setupNear(state, payload) {
      state.contract = payload.contract;
      state.currentUser = payload.currentUser;
      state.wallet = payload.wallet;
    }
  },
  actions: {
    async initNear({ commit }) {
      // Initialize connection to TestNet.
      const near = await nearApi.connect({
        nodeUrl: 'https://rpc.testnet.near.org',
        deps: {
          keyStore: new nearApi.keyStores.BrowserLocalStorageKeyStore()
        },
        contractName: 'mllnd.testnet'
      });

      const wallet = new nearApi.WalletConnection(near);

      let currentUser;

      if (wallet.getAccountId()) {
        currentUser = {
          accountId: wallet.getAccountId(),
          balance: (await wallet.account().state()).amount
        }
      }

      const contract = await new nearApi.Contract(wallet.account(), 'mllnd.testnet', {
        viewMethods: ['getMessages'],
        changeMethods: ['addMessage'],
        sender: wallet.getAccountId()
      });
      // Commit and send to mutation.
      commit('setupNear', { contract, currentUser, wallet });
    }
  }
});

export default store;