<template>
    <div>
        <MusicPlaylist :songs.sync="songs" :favorites.sync="favorites" :waitingList="waitingList"/>
        <MusicPlayer :songs="songs" :waitingList="waitingList" :playing.sync="playing"/>
    </div>
</template>
<script>
import MusicPlaylist from './MusicPlaylist'
import MusicPlayer from './MusicPlayer'
import {songs,artists} from '../assets/js/songs.js';

export default {
    name: 'SongsParent',
    components:{
        MusicPlaylist,
        MusicPlayer,
    },
    data: ()=>({
        songs,
        artists,
        favorites:[],
        waitingList:[],
        playing:false,
    })
}
</script>
<style scoped>

</style>