<template>
  <div class="home">
    <keep-alive exclude='ShopCat,Address'>
      <router-view :title="title[0]"></router-view>
    </keep-alive>

    <!-- 商品详细信息 -->
    <ParL />
    <!-- bottom -->
    <div class="Mnavigation">
      <ul>
        <router-link to="/main" tag="li">
          <div class="ico-main">
            <div
              @click="con(1)"
              :class="{ con: this.$root.global.swap == 1 }"
              class="img-ico"
            ></div>
            <p>首页</p>
          </div>
        </router-link>
        <router-link to="/overderForm" tag="li">
          <div class="ico-main">
            <div
              @click="con(2)"
              :class="{ con: this.$root.global.swap == 2 }"
              class="img-ico"
            ></div>
            <p>菜单</p>
          </div>
        </router-link>
        <router-link to="/shopCat" tag="li">
          <van-badge
            :content="
              this.$root.global.cutmusch > 0 ? this.$root.global.cutmusch : ''
            "
          >
            <div class="ico-main">
              <div
                @click="con(3)"
                :class="{ con: this.$root.global.swap == 3 }"
                class="img-ico"
              ></div>
              <p>购物车</p>
            </div>
          </van-badge>
        </router-link>

        <router-link to="/myself" tag="li">
          <div class="ico-main">
            <div
              @click="con(4)"
              :class="{ con: this.$root.global.swap == 4 }"
              class="img-ico"
            ></div>
            <p>我的</p>
          </div>
        </router-link>
      </ul>
    </div>
  </div>
</template>
<script>
import ParL from "../components/Particulars";
import "../assets/less/home.less";
export default {
  name: "Home",
  components: {
    ParL,
  },
  data() {
    return {
      // 改变底部图标
      // swap: this.$root.global.swap,
      title: ["热卖推荐"],
    };
  },

beforeEnter: (to, from, next) => {
  this.getCuttmuch();
  next()
},

  methods: {
    con(val) {
      this.$root.global.swap = val;
    },

    // 获取购物车总数量
    getCuttmuch() {
      let tokenString = this.$cookies.get("tokenString");
      if (!tokenString) {
        return this.$router.push({ name: "Login" });
      }

      // 加载
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });
      this.$http("/shopcartRows?tokenString=" + tokenString)
        .then((res) => {
          this.$toast.clear();
          console.log(res);
          if (res.data.code == 700) {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 3000,
            });
            return this.$router.push({ name: "Login" });
          }

          if (res.data.code === 8000) {
            this.$root.global.cutmusch = res.data.result;
          } else {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 3000,
            });
          }
        })
        .catch((err) => {
          this.$toast.clear();
          console.log("err ==> ", err);
        });
    },
  },
};
</script>
