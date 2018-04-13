<template>
<div>
    <Tabs :value="name1">
        <TabPane label="标签一" name="name1">标签一的内容</TabPane>
        <TabPane label="标签二" name="name2">标签二的内容</TabPane>
        <TabPane label="标签三" name="name3">标签三的内容</TabPane>
    </Tabs>
    <button @click='fn'>test</button>
    <p v-show=''>hhhhh</p>
</div>
</template>
<script>
    export default {
      data(){
        return {
          name1:'name3'
        }
      },
      methods:{
        fn(){
          console.log(this.name1)
          this.name1='name1'
          console.log(this.name1+'\n')
        }
      }
    }
</script>