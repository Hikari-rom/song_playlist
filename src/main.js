import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import VueRouter from 'vue-router'; 

Vue.config.productionTip = false

Vue.use(VueRouter)

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
      .register('service-worker.js', {
          scope: '/'
      })
      .then(registration => {
          console.log('Registration OK');
          console.log(registration)
      })
      .catch(error => {
          console.error('Erreur: ', error);
      });
}


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
