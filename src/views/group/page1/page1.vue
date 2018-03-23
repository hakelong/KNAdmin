<style>
    #build-content {
        margin: 20px 20px;
    }
</style>
<template>
    <div id="build-content">
        <h2>构建配置</h2>
        <div v-for="(buildValue, buildKey) in currentConfig">
            <li v-for="(value, key) in buildValue"
                is="page2"
                v-bind:buildEventId="buildKey"
                v-bind:buildKey="key"
                v-bind:buildValue="value"
                v-on:remove="remove">
            </li>
        </div>
        <br>
        <br>
    </div>
</template>
<script>
    import Vue from "vue";
    import page2 from '../page2/page2';
    export default {
        components:{
          page2
        },
        data () {
            return {
                currentConfig: {
                    "1" : {
                        "akey" : "aValue",
                        "bkey" : "bValue",
                        "ckey" : "cValue",
                    },
                    "2" : {
                        "akey" : "aValue",
                        "bkey" : "bValue",
                        "ckey" : "cValue",
                    }
                }
            }
        },
        methods: {
            remove: function (eventId, key) {
                // console.log(eventId + " " + key);
                Vue.delete(this.currentConfig[eventId], key);
                console.log(this.currentConfig);
            }
        },
        mounted: function () {
            
        }

    }
</script>