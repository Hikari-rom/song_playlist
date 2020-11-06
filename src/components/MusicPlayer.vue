<template>
    <div>
        <!-- ontimeupdate="updateBar()" -->
            <ul>
                <li v-for="song in songs" :key="song.title" @click="goToSong(song.title)">
                    {{song.title}}
                </li>
            </ul>
            <p> Titre en cours : {{actualSong.title}} </p>
            <v-img contain max-height="200" :src="actualSong.cover"></v-img>
            <div class="cent-align">
                <v-btn @click="goToPrev()">Prev</v-btn>
                <v-btn @click="togglePlaying()">Play</v-btn>
                <v-btn @click="goToNext()">Next</v-btn>
            </div>
            <v-progress-linear height="10" rounded @change="goToPercent" 
                background-color="error" color="success" :value="timerPercent">
            </v-progress-linear>
            {{getTimerDuration}}
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
                cover: "https://www.free-stock-music.com/thumbnails/fsm-team-escp-lucid-dreaming.jpg"
            },
            {
                title: "PotatoFries",
                mp3: "https://www.free-stock-music.com/music/potatofries-maittre-sara-olsen-ocean.mp3",
                cover: "https://www.free-stock-music.com/thumbnails/potatofries-maittre-sara-olsen-ocean.jpg"
            },
            {  
                title: "This valley of Untold Emotion",
                mp3: "https://www.free-stock-music.com/music/chillin_wolf-this-valley-of-untold-emotion.mp3",
                cover: "https://www.free-stock-music.com/thumbnails/chillin_wolf-this-valley-of-untold-emotion.jpg"
            }
        ],
        timer:0,
        timerPercent: 0,
        playing: false,
        actualSong:{},
        audioPage: null,
        totalDuration: "",
        totalDurationSec: 0,
        position: 0
    }),
    methods:{
        togglePlaying() {
            this.playing = !this.playing
            this.totalDurationSec = this.audioPage.duration
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
            if(!this.playing)
            {
                this.playing = !this.playing
                alreadyPlaying = true
            }
            let next = this.findNeighbors(this.actualSong.title).next
            if(next.title !== undefined)
            {
                this.actualSong = next
                this.audioPage.src = this.actualSong.mp3
                this.position++
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
        goToSong(title){
            let position = this.songs.findIndex(song => song.title === title)
            console.log(position)
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
        }
    },
    watch:{
        playing:function(){
            this.playing ? this.audioPage.play() : this.audioPage.pause()
        },
        position:function(){
            this.totalDurationSec = this.audioPage.duration
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

<style scoped>
.cent-align{
    text-align:center;
}
</style>
