<template>
    <div>
        <!-- ontimeupdate="updateBar()" -->
            <p> Titre en cours : {{actualSong.title}} </p>
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
        timer:0,
        timerPercent: 0,
        actualSong:{},
        audioPage: null,
        totalDuration: "",
        totalDurationSec: 0,
        position: 1,
        volume: 1
    }),
    props:{
        songs:Array,
        waitingList: Array,
        playing: Boolean,
    },
    methods:{
        togglePlaying() {
            this.$emit('update:playing',!this.playing)
            // this.playing = !this.playing
            this.totalDurationSec = this.audioPage.duration
        },
        goToPercent(value){
            let alreadyPlaying = false
            if(!this.playing)
            {
                this.$emit('update:playing',!this.playing)
                // this.playing = !this.playing
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
                this.$emit('update:playing',!this.playing)
                // this.playing = !this.playing
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
                let next = this.findNeighbors(this.position).next
                console.log(next)
                if(next.title !== undefined)
                {
                    this.actualSong = next
                    this.audioPage.src = this.actualSong.mp3
                    this.position++
                }
            }
            // alreadyPlaying && (this.playing = !this.playing)
            alreadyPlaying && (this.$emit('update:playing',!this.playing))
        },
        goToPrev(){
            let alreadyPlaying = false
            if(!this.playing)
            {
                this.$emit('update:playing',!this.playing)
                // this.playing = !this.playing
                alreadyPlaying = true
            }
            let prev = this.findNeighbors(this.position).prev
            if(prev.title !== undefined)
            {
                this.actualSong = prev
                this.audioPage.src = this.actualSong.mp3
                this.position--
            }
            // alreadyPlaying && (this.playing = !this.playing)
            alreadyPlaying && (this.$emit('update:playing',!this.playing))
        },
        findNeighbors(id){
            let resultat = this.songs.findIndex( song => song.id === id);
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
        goToSong(id){
            let position = this.songs.findIndex(song => song.id === id);
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