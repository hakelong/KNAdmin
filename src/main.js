import Vue from 'vue'
import iView from 'iview'
import { router } from './router/index'
import store from './store'
import App from './app.vue'
import 'iview/dist/styles/iview.css'

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import VueQuillEditor from 'vue-quill-editor'

Vue.use(iView)
Vue.use(VueQuillEditor)

new Vue({
  el: '#app',
  router: router,
  store: store,
  render: h => h(App),
  mounted() {
    this.$store.commit('updateMenulist')
  }
})
