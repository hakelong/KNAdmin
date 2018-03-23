<style>
span {
}
</style>
<template>
    <div>
        <h1>page</h1>
        <ul>
          <li v-for='(pvalue,pkey) in arr'  >
            
            <div v-for='(value,key) in pvalue'>
              {{value}}
            </div>
          </li>
        </ul>
    </div>
</template>

<script>
export default {
  name: 'page',
  data() {
    return {
      arr: {
        '1': {
          akey: 'aValue',
          bkey: 'bValue',
          ckey: 'cValue'
        },
        '2': {
          akey: 'aValue',
          bkey: 'bValue',
          ckey: 'cValue'
        }
      }
    }
  },
  mounted() {
    this.$delete(this.arr['1'],'akey')
  }
}
</script>