<template>
  <div class="lunbo">
   <ul>
     <li v-for="(v,i) in images" :key="i"></li>
   </ul>
  </div>
</template>
<script>
export default {
  name: "Lunbo",
  data() {
    return {
      images: [
        "../assets/img/轮播(1).jpg",
        "../assets/img/轮播(2).jpg",
        "../assets/img/轮播(3).jpg",
        "../assets/img/轮播(4).jpg",
        "../assets/img/轮播(5).jpg",
      ],
    };
  },
};
</script>
<style lang="less">
.lunbo {
  .my-swipe {
    .van-swipe-item {
      img {
      }
    }
  }
}
</style>