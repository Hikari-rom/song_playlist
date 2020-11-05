<template>
    <div>
        <!-- ontimeupdate="updateBar()" -->
            <ul>
                <li v-for="song in songs" :key="song.title">
                    {{song.title}}
                </li>
            </ul>
            <p> Titre en cours : {{actualSong.title}} </p>
            <v-img height="150" :src="actualSong.cover"></v-img>
            <v-btn @click="goToPrev()">Prev</v-btn>
            <v-btn @click="togglePlaying()">Play</v-btn>
            <v-btn @click="goToNext()">Next</v-btn>
            <v-progress-linear v-model="timer"></v-progress-linear>
            <!-- {{timer}} / {{totalDuration}} -->
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
        // getDuration(){
        //     this.totalDurationSec = Math.floor(this.audioPage.duration)
        //     let minDuration = Math.floor( this.totalDurationSec / 60)
        //     let secDuration = Math.floor(this.totalDurationSec - minDuration * 60)
        //     this.totalDuration = `${minDuration} : ${secDuration}`
        // },
        goToNext(){

            if(!this.playing)
            {
                this.playing = !this.playing
            }
            let next = this.findNeighbors(this.actualSong.title).next
            if(next.title !== undefined)
            {
                this.actualSong = next
                this.audioPage.src = this.actualSong.mp3
                this.totalDurationSec = this.audioPage.duration
            }
        },
        goToPrev(){
            if(!this.playing)
            {
                this.playing = !this.playing
            }
            let prev = this.findNeighbors(this.actualSong.title).prev
            if(prev.title !== undefined)
            {
                this.actualSong = prev
                this.audioPage.src = this.actualSong.mp3
                this.totalDurationSec = this.audioPage.duration
            }
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
        }
    },
    created(){
        this.actualSong = this.songs[0]
    },
    mounted(){
        this.audioPage = new Audio(this.actualSong.mp3)
        // setInterval(this.getTimerDuration,5000)
        // console.log("coucou")
        this.audioPage.loadedmetadata = () => {
            this.totalDurationSec = this.audioPage.duration
        }
        this.audioPage.ontimeupdate = () => {
            this.timer = this.audioPage.currentTime
        }
    }
}
</script>