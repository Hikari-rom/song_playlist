<template>
    <div>
        <!-- ontimeupdate="updateBar()" -->
            List of Songs
            <!-- <ul>
                <li v-for="(song,index) in songs" :key="song.title" >
                    <div @click="goToSong(index)">
                        {{song.title}}{{index}}
                    </div>
                    <v-btn icon><v-icon @click="checkFavorites(index)" :class="{'isFav':song.favorite===true}">mdi-heart</v-icon></v-btn>
                    <v-btn icon><v-icon @click="addToWaitingList(index)">mdi-playlist-plus</v-icon></v-btn>
                </li>
            </ul> -->
            <v-data-table
                :headers="headers"
                :items="songs"
                item-key="title"
                :search="search"
                >
                <template v-slot:top>
                    <v-text-field
                        v-model="search"
                        label="Search"
                    ></v-text-field>
                </template>
            </v-data-table>

            <p> Titre en cours : {{actualSong.title}} </p>
            <v-dialog max-width="290">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on">
                        <v-icon>mdi-heart-multiple</v-icon>
                    </v-btn>
                </template>
                <v-card>
                    <v-card-title class="headline">
                        Favorites List
                    </v-card-title>
                    <v-card-text>
                        <ul>
                            <li v-for="fav in favorites" :key="fav.title">
                                {{fav.title}}
                            </li>
                        </ul>
                    </v-card-text>
                </v-card>
            </v-dialog>
            <v-img contain max-height="200" :src="actualSong.cover"></v-img>
            <div class="cent-align">
                <v-btn @click="goToPrev()">Prev</v-btn>
                <v-btn @click="togglePlaying()">Play</v-btn>
                <v-btn @click="goToNext()">Next</v-btn>
                <v-slider step="0.01" min="0" max="1" v-model="volume"></v-slider>
            </div>
            <div class="justify-start flex-wrap ma-16">
                <v-progress-linear height="10" rounded @change="goToPercent" 
                    background-color="error" color="success" :value="timerPercent">
                </v-progress-linear>
                {{getTimerDuration}}
            </div>
    </div>
</template>
<script>
export default {
    name:'MusicPlayer',
    data:()=>({
        songs:[
            {
                title: "Lucid Dreaming",
                mp3: "https://www.free-stock-music.com/music/fsm-team-escp-lucid-dreaming.mp3",
                cover: "https://www.free-stock-music.com/thumbnails/fsm-team-escp-lucid-dreaming.jpg",
                favorite: false,
                artist:{
                    firstName:"Kristian",
                    lastName:"Kostov",
                }
            },
            {
                title: "Potato Fries",
                mp3: "https://www.free-stock-music.com/music/potatofries-maittre-sara-olsen-ocean.mp3",
                cover: "https://www.free-stock-music.com/thumbnails/potatofries-maittre-sara-olsen-ocean.jpg",
                favorite: false,
                artist:{
                    firstName:"Charlotte",
                    lastName:"Perrelli",
                }
            },
            {  
                title: "This valley of Untold Emotion",
                mp3: "https://www.free-stock-music.com/music/chillin_wolf-this-valley-of-untold-emotion.mp3",
                cover: "https://www.free-stock-music.com/thumbnails/chillin_wolf-this-valley-of-untold-emotion.jpg",
                favorite: false,
                artist:{
                    firstName:"Yoko",
                    lastName:"Shimomura",
                }
            }
        ],
        search:'',
        waitingList:[],
        favorites:[],
        timer:0,
        timerPercent: 0,
        playing: false,
        actualSong:{},
        audioPage: null,
        totalDuration: "",
        totalDurationSec: 0,
        position: 0,
        volume: 1
    }),
    methods:{
        togglePlaying() {
            this.playing = !this.playing
            this.totalDurationSec = this.audioPage.duration
        },
        checkFavorites(index){
            
            let indexFav = this.favorites.findIndex(song => song.title === this.songs[index].title)
            console.log(indexFav)
            if( indexFav === -1 ){
                this.favorites.push(this.songs[index])
                this.songs[index].favorite = true
            }
            else
            {
                this.favorites.splice(indexFav, 1)
                this.songs[index].favorite = false
            }
            
        },
        addToWaitingList(index){
            console.log(index)
            this.waitingList.push(this.songs[index])
        },
        goToPercent(value){
            let alreadyPlaying = false
            if(!this.playing)
            {
                this.playing = !this.playing
                alreadyPlaying = true

            }
            this.timerPercent = value
            this.timer =  (this.timerPercent * this.totalDurationSec ) / 100
            this.audioPage.currentTime = this.timer
            alreadyPlaying && (this.playing = !this.playing)
        },
        goToNext(){
            let alreadyPlaying = false
            if(this.playing)
            {
                this.playing = !this.playing
                alreadyPlaying = true
            }
            if(this.waitingList.length > 0)
            {
                let nextSong = this.waitingList.shift()
                // Pas propre
                this.actualSong = nextSong
                this.audioPage.src = this.actualSong.mp3
            }
            else{
                let next = this.findNeighbors(this.actualSong.title).next
                if(next.title !== undefined)
                {
                    this.actualSong = next
                    this.audioPage.src = this.actualSong.mp3
                    this.position++
                }
            }
            alreadyPlaying && (this.playing = !this.playing)
        },
        goToPrev(){
            let alreadyPlaying = false
            if(!this.playing)
            {
                this.playing = !this.playing
                alreadyPlaying = true
            }
            let prev = this.findNeighbors(this.actualSong.title).prev
            if(prev.title !== undefined)
            {
                this.actualSong = prev
                this.audioPage.src = this.actualSong.mp3
                this.position--
            }
            alreadyPlaying && (this.playing = !this.playing)
            
        },
        findNeighbors(title){
            let resultat = this.songs.findIndex( song => song.title === title);
            // Terriblement moche : A changer par le biais de la position
            // Modifier en rajoutant un paramètre
            if(resultat == 0){
                return {prev:{},next:this.songs[resultat+1]}
            }
            else if(resultat == this.songs.length-1){
                return {prev:this.songs[resultat-1],next:{}}
            }else{
                return {prev:this.songs[resultat-1],next:this.songs[resultat+1]}
            }
        },
        goToSong(position){
            this.actualSong = this.songs[position]
            this.audioPage.src = this.songs[position].mp3
            this.position = position
        }
    },
    computed:{
        getTimerDuration:function(){
            let timer = this.getTimer
            let duration = this.getDuration
            return `${timer} / ${duration}`
        },
        getTimer:function(){
            let minTimer = Math.floor( this.timer / 60);
            let secTimer = Math.floor( this.timer % 60);
            minTimer < 10 && (minTimer = `0${minTimer}`)
            secTimer < 10 && (secTimer = `0${secTimer}`)
            return `${minTimer} : ${secTimer}`
        },
        getDuration:function(){
            let minDuration = Math.floor( this.totalDurationSec / 60)
            let secDuration = Math.floor( this.totalDurationSec % 60)
            minDuration < 10 && (minDuration = `0${minDuration}`)
            secDuration < 10 && (secDuration = `0${secDuration}`)
            return `${minDuration} : ${secDuration}`
        },
        headers:function(){
            return [
                {
                    text: 'Title',
                    value: 'title',
                },
                {
                    text: 'Artiste',
                    value: 'artist.lastName'
                }
            ]
        }
    },
    watch:{
        playing:function(){
            this.playing ? this.audioPage.play() : this.audioPage.pause()
        },
        position:function(){
            this.totalDurationSec = this.audioPage.duration
        },
        volume:function(){
            this.audioPage.volume = this.volume
        },
        timer:function(){
            if(this.timer == this.totalDurationSec)
            {
                this.goToNext()
            }
        }
    },
    created(){
        this.actualSong = this.songs[0]
    },
    mounted(){
        this.audioPage = new Audio(this.actualSong.mp3)
        this.audioPage.ontimeupdate = () => {
            this.timer = this.audioPage.currentTime
            this.timerPercent = Math.round(100*this.timer/this.totalDurationSec);
        }
    }
}
</script>

<style>
.isFav{
    color: red !important;
}
.cent-align{
    text-align:center;
}


</style>
