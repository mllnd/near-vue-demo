<template>
  <main>
    <header style="display: flex; align-items: center; justify-content: space-between;">
      <h1>NEAR Guest Book</h1>
      <button @click="currentUser ? signOut() : signIn()">
        {{ currentUser ? 'Log Out' : 'Log In' }}
      </button>
    </header>
    <template v-if="currentUser">
      <form @submit="sendMessage">
        <fieldset id="fieldset" :disabled="submitting">
          <p>Sign the guest book, {{ currentUser.accountId }}!</p>
          <p class="highlight">
            <label for="message">Message:</label>
            <input autocomplete="off" v-model="message" autofocus id="message" required/>
          </p>
          <p>
            <label for="donation"> Donation (optional):</label>
            <input autocomplete="off" v-model="donation"
                   id="donation" :max="maxDonation" min="0" step="0.01" type="number"/>
            <span title="NEAR Tokens">Ⓝ</span>
          </p>
          <button type="submit">Sign</button>
        </fieldset>
      </form>
    </template>
    <template v-else>
      <p>
        This app demonstrates a key element of NEAR’s UX: once an app has
        permission to make calls on behalf of a user (that is, once a user
        signs in), the app can make calls to the blockhain for them without
        prompting extra confirmation. So you’ll see that if you don’t
        include a donation, your message gets posted right to the guest book.
      </p>
      <p>
        But if you do add a donation, then NEAR will double-check that
        you’re ok with sending money to this app.
      </p>
      <p>
        Go ahead and sign in to try it out!
      </p>
    </template>
    <template v-if="!!currentUser && !!messages.length">
      <h2>Messages</h2>
      <!-- TODO: format as cards, add timestamp -->
      <p :key="index" v-for="(message, index) in messages">
        <strong>{{ message.sender }}</strong>:<br/>
        {{ message.text }}
      </p>
    </template>
  </main>
</template>

<script>
import { mapGetters } from 'vuex';
import { Big } from 'big.js';

export default {
  name: 'GuestBook',
  computed: {
    ...mapGetters(['currentUser', 'contract', 'wallet', 'nearConfig'])
  },
  data() {
    return {
      messages: [],
      submitting: false,
      donation: 0,
      message: null,
      maxDonation: 0, // By default, set as 0.
      gas: Big(3).times(10 ** 13).toFixed()
    };
  },
  async mounted() {
    // Once the user is available, set max donation.
    if (this.currentUser) {
      this.maxDonation = Big(this.currentUser.balance).div(10 ** 24);
    }
    // Get the messages and reverse them - latest on top.
    this.messages = (await this.contract.getMessages()).reverse();
  },
  methods: {
    signIn() {
      this.wallet.requestSignIn(
        this.nearConfig.contractName,
        'NEAR Vue.js Guest Book'
      );
    },
    signOut() {
      this.wallet.signOut();
      window.location.replace(window.location.origin + window.location.pathname)
    },
    async sendMessage(e) {
      e.preventDefault();
      this.submitting = true;
      // Asynchronously post the message and get all of the messages again.
      try {
        await this.contract.addMessage(
          { text: this.message },
          this.gas,
          Big(this.donation || '0').times(10 ** 24).toFixed()
        );
      } catch (e) {
        console.log(e);
        alert('Something went wrong! Check the console.');
      } finally {
        const messages = await this.contract.getMessages();
        this.messages = messages.reverse();
      }
      // Reset values.
      this.message = null;
      this.donation = 0;
      this.submitting = false;
    }
  }
};
</script>
