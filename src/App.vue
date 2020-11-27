<template>
  <v-app>
    <v-main>
        <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
  // import MusicPlayer from './components/MusicPlayer';

export default {
  name: 'App',

  components: {
    // MusicPlayer,
  },

  data: () => ({
    //
  }),
};
</script>
