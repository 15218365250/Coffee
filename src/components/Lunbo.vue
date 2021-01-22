<template>
  <div class="lunbo">
    <ul>
      <li v-for="(v, key) in images" :key="key">
        <img :src="v" />
      </li>
    </ul>
    <div class="punctuation">
      <i v-for="(v, i) in images" :key="i" :class="{ con: cont == i }"></i>
    </div>
  </div>
</template>
<script>
export default {
  name: "Lunbo",
  data() {
    return {
      images: [
        "./static/img/轮播(1).jpg",
        "./static/img/轮播(2).jpg",
        "./static/img/轮播(3).jpg",
        "./static/img/轮播(4).jpg",
        "./static/img/轮播(5).jpg",
      ],
      // 节流开关
      timeout: true,
      cont: 1,
    };
  },
  mounted() {
    this.slideshow();
  },
  methods: {
    slideshow() {
      let num = this.images.length;
      let times = null;
      var that = this;
      let sum = 0;
      let rungo = document.querySelector(".lunbo>ul");
      times = setInterval(() => {
        if (that.timeout) {
          // that.timeout = true;
          sum++;
          if (sum >= num) {
            sum = 0;
          }
          this.cont = sum;
          rungo.style.transform = `translateX(-${sum * 100}vw)`;
        } else {
          clearInterval(times);
          that.timeout = false;
        }
      }, 5000);
    },
  },
};
</script>
<style lang="less" scope>
.lunbo {
  position: relative;
  height: 30vh;
  width: 93vw;
  border: 3px solid #8f5105;
  box-shadow: 0px 2px 6px 2px #7c5423;
  border-radius: 10px;
  overflow: hidden;
  margin: 10px 10px;
  ul {
    display: flex;
    position: absolute;
    left: 0px;
    transform: translateX(0vw);
    transition: all 1s linear;
    li {
      display: inline-block;
      border-radius: 10px;
      overflow: hidden;
      img {
        width: 100vw;
        height: 30vh;
      }
    }
  }
  .punctuation {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    i {
      display: inline-block;
      width: 8px;
      height: 5px;
      background-color: rgb(158, 158, 158);
      margin: 5px;
      border-radius: 5px;
    }
    .con {
      background: #8f5105;
    }
  }
}
</style>