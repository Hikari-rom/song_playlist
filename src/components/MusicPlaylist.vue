<template>
    <div>
    List of Songs
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
                <template
                 v-slot:body="{ items }">
                <tbody>
                    <tr
                        v-for="song in items"
                        :key="song.id">
                        <td> {{song.title}}</td>
                        <td @click="goToArtistDetails(song.artist.id)">{{song.artist.firstName}} {{song.artist.lastName}}</td>
                        <td>
                            <v-btn icon><v-icon @click="checkFavorites(song.id)" :class="{'isFav':song.favorite===true}">mdi-heart</v-icon></v-btn>
                            <v-btn icon><v-icon @click="addToWaitingList(song.id)">mdi-playlist-plus</v-icon></v-btn>
                        </td>
                    </tr>
                </tbody>
                </template>
            </v-data-table>

            
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
    </div>
</template>
<script>
export default {
    name: 'MusicPlaylist',
    data:()=>({
        search:'',
    }),
    props:{
        songs:Array,
        favorites:Array,
        waitingList:Array,
    },
    methods:
    {
        checkFavorites(id)
        {
            let index = this.songs.findIndex(song => song.id === id)
            let indexFav = this.favorites.findIndex(song => song.id === this.songs[index].id)

            if( indexFav === -1 ){
                this.$emit('update:favorites',this.favorites.push(this.songs[index]))
                // this.favorites.push(this.songs[index])
                // this.songs[index].favorite = true
            }
            else
            {
                this.favorites.splice(indexFav, 1)
                this.songs[index].favorite = false
            }
        },
        addToWaitingList(id){
            console.log(id)
            this.waitingList.push(this.songs.find(song => song.id === id))
        },
        goToArtistDetails(artistId){
            this.$router.push({name:'Artiste', params:{artistId} })
        }
    },
    computed:{
        headers:function(){
            return [
                {
                    text: 'Title',
                },
                {
                    text: 'Artiste',
                },
                {
                    text: 'Actions',
                }
            ]
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