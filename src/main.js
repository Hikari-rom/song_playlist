import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import VueRouter from 'vue-router'; 

Vue.config.productionTip = false

Vue.use(VueRouter)


const routes = [
  {
    path: '/artist/:artistId', name:'Artiste',
    component: () => import('./components/ArtistDetails.vue')
  },
  {
    path: '/', name:'MusicPlayer',
    component: () => import('./components/SongsParent.vue')
  },
]

const router = new VueRouter({
  routes
})

new Vue({
  vuetify,
  render: h => h(App),router
}).$mount('#app')
