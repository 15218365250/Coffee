<template>
  <div class="main">
    <!-- 头部搜索 -->
    <div class="header">
      <div class="logo"></div>
      <div class="seach">
        <input type="text" v-model="keyword" placeholder="搜索商品" />
        <i @click="lestGo"></i>
      </div>
    </div>
    <div class="searchList">
      <ul>
        <li
          v-for="v in searchTip"
          :key="v.pid"
          @click="onKeyworder({ name: v.name, pid: v.pid })"
        >
          {{ v.name }}
        </li>
      </ul>
    </div>
    <!-- 轮播 -->
    <Lunbo />
    <!-- 热卖推荐 -->
    <Title :title="title" />
    <div class="hostSale">
      <ul>
        <li v-for="val in hotData" :key="val.id" @click="goDetails(val.pid)">
          <div class="productImg">
            <img :src="val.smallImg" />
          </div>
          <div class="massage">
            <p class="cname">{{ val.name }}</p>
            <p class="ename">{{ val.enname }}</p>
            <span><i>￥</i>{{ val.price }}</span>
          </div>
          <div class="ico">hot</div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import "../assets/less/home.less";
import "../assets/less/main.less";
import Lunbo from "../components/Lunbo";
import Title from "../components/Title";

export default {
  name: "Main",
  props: ["title"],
  components: {
    Lunbo,
    Title,
  },
  data() {
    return {
      // 热推产品数据
      hotData: [],
      // 搜索关键字
      keyword: "",
      // 搜索提示
      searchTip: [],
      // 搜索商品的pid
      searchPid: "",
    };
  },
  mounted() {
    // 获取热销产品
    this.$http({
      method: "get",
      url: "/typeProducts?key=isHot&value=1",
    }).then((res) => {
      this.hotData = res.data.result;
    });
  },
  watch: {
    keyword: function () {
      this.getSearchData();
      
    },
  },
  methods: {
    // 点击获取相应的商品详情
    goDetails(keyId) {
      this.$root.global.prociData = {};
      this.$root.global.showform = true;
      this.$http("/productDetail?pid=" + keyId).then((res) => {
        this.$root.global.prociData = res.data.result[0];
      });
    },

    // 获取搜索信息
    getSearchData() {
      console.log(this.keyword);
      this.$http("/search?name=" + this.keyword).then((res) => {
        let sear = res.data.result;
        this.searchTip = [];
        sear.forEach((v) => {
          this.searchTip.push({ name: v.name, pid: v.pid });
        });
        if(this.keyword == ''){
          this.searchTip = [];
        }
        
      });
    },

    // 点击对应提示标题赋值输入框
    onKeyworder(arryVul) {
      this.keyword = arryVul.name;
      this.searchPid = arryVul.pid;
    },

    // // 开始搜索
    lestGo() {
      let keyId = this.searchPid;
      this.$root.global.prociData = {};
      this.$root.global.showform = true;

      this.$http("/productDetail?pid=" + keyId).then((res) => {
        this.$root.global.prociData = res.data.result[0];
      });
      setTimeout(()=>{
        this.keyword = '';
      },1000)
    },
  },
};
</script>