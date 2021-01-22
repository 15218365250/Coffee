<template>
  <div class="title">
    <h2 @click="ct">{{ title }}</h2>
  </div>
</template>
<script>
export default {
  name: "Title",
  props: ["title"],
  methods: {
    ct() {
      this.$http("/typeProducts").then((data) => {
        console.log(data);
      });
    },
  },
};
</script>
<style lang="less" scope>
.title {
  width: 100%;
  text-align: left;
  background-color: #8f5105;
  padding: 5px;
  margin-top: 5px;
  box-sizing: border-box;
  border-left: 5px solid rgb(85, 47, 1);
  h2 {
    display: inline-block;
    color: #f8d7ac;
  }
}
</style>