<style scoped>
    .tab {
        margin-right:2em
    }
</style>
<template>
    <div>
        <br>
        <span class="tab">事件</span>
        <Input v-model="eventId" placeholder="请输入..." style="width: 150px" class="tab"/>
        <span class="tab">key:</span>
        <Input v-model="key" placeholder="请输入..." style="width: 200px" class="tab"/>
        <span class="tab">value:</span>
        <Input v-model="value" placeholder="请输入..." style="width: 300px" class="tab"/>
        <Button type="error" @click="remove">删除</Button>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                eventId: this.buildEventId,
                key: this.buildKey,
                value: this.buildValue,

            }
        },
        props: {
            buildEventId: {
              type: String
            },
            buildKey: {
                type: String
            },
            buildValue:{
                type: String
            }
        },
        methods: {
            remove: function () {
                this.$emit('remove', this.eventId, this.buildKey);
                console.log(this.eventId)
                console.log(this.buildKey)
            }
        }
    }
</script>