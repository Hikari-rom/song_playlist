<template>
  <v-container>
    <h1>Artist</h1>
    <h2>{{selectedArtist.firstName}} {{selectedArtist.lastName}}</h2>
    <h2>Age : {{selectedArtist.age}} years old</h2>
  </v-container>
</template>

<script>
import {artists} from '../assets/js/songs.js';

export default {
  name: "ArtistDetails",
  data: ()=> ({
    artists,
    selectedArtist: [],
    idArtist: '',
  }),
  methods: {
    loadSelectedArtist(){
      let artistId = this.$route.params.artistId;
      this.selectedArtist = this.artists.find(artist => artist.id == artistId)
    }
  },
  components: {

  },
  computed: {
  },
  created(){
    this.loadSelectedArtist();
  }
};
</script>
