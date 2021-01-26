<template>
  <div class="myself">
    <div class="heard">
      <span class="userIMg"><img :src="userMassage.userImg" alt=""></span>
      <p>用户中心</p>
      <span @click="goseting">设置</span>
    </div>
    <div class="conter">
      <div class="top">
        <div class="userImg"><img :src="userMassage.userImg"></div>
        <div class="desc">{{userMassage.desc}}</div>
      </div>
      <div class="bottom">
        <div>
          <div class="personalData">
            <p>个人资料</p>
            <p><span>昵称:</span>{{ userMassage.nickName }}</p>
            <p><span>账号:</span>{{ userMassage.phone }}</p>
            <p><span>ID:</span>{{ userMassage.userId }}</p>
          </div>
          <div class="myorder" @click="showmyorders">
            <p>我的订单</p>
          </div>
        </div>
        <div>
          <div class="myfavorite" @click="showmyfavorite">
            <p>我的收藏</p>
          </div>
          <div class="administration" @click="onclickmap">
            <p>地址管理</p>
          </div>
        </div>
      </div>
    </div>
    <div>
      <!-- 我的收藏 -->
      <van-popup
        v-model="mycollect"
        position="bottom"
        round
        closeable
        :style="{ height: '50%' }"
      >
        <div class="mycl">
          <ul>
            <li
              v-for="val in collectData"
              :key="val.id"
              @click="goDetails(val.pid)"
            >
              <div class="productImg">
                <img :src="val.smallImg" />
              </div>
              <div class="massage">
                <p class="cname">{{ val.name }}</p>
                <p class="ename">{{ val.enname }}</p>
                <span><i>￥</i>{{ val.price }}</span>
              </div>
            </li>
          </ul>
        </div>
      </van-popup>
      
      
    </div>
  </div>
</template>
<script>
import "../assets/less/myself.less";
export default {
  name: "Myself",
  data() {
    return {
      // 用户信息
      userMassage: {},

      // 显示隐藏
      mycollect: false,

      // 收藏商品信息
      collectData: [],
    };
  },

  created() {
    this.$root.global.swap = 4;
    this.getUser();
    this.getcollectData();
  },
  methods: {
    goseting() {
      let userMassage = this.userMassage;
      this.$router.push({ name: "SettingUp", params: { massge: userMassage } });
    },
    // 获取用户信息
    getUser() {
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

      this.$http("/findAccountInfo?tokenString=" + tokenString)
        .then((res) => {
          this.$toast.clear();
          if (res.data.code == 700) {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 1000,
            });
            return this.$router.push({ name: "Login" });
          }
          console.log(res)
          if (res.data.code === "B001") {
            res.data.result[0].phone =
              res.data.result[0].phone.slice(0, 3) +
              "*****" +
              res.data.result[0].phone.slice(8, 11);

            this.userMassage = res.data.result[0];
          } else {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 1000,
            });
          }
        })
        .catch((err) => {
          this.$toast.clear();
          console.log("err==>", err);
        });
    },
    // 显示我的订单
    showmyorders() {

      this.$router.push({name:'Myorder'});
    },
    // 显示我的收藏
    showmyfavorite() {
      this.mycollect = true;
    },

    // 获取收藏商品信息
    getcollectData() {
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

      this.$http("/findAllLike?tokenString=" + tokenString)
        .then((res) => {
          this.$toast.clear();
          if (res.data.code == 700) {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 1000,
            });
            return this.$router.push({ name: "Login" });
          }

          if (res.data.code === 2000) {
            
            this.collectData = res.data.result;
          } else {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 1000,
            });
          }
        })
        .catch((err) => {
          this.$toast.clear();
          console.log("err==>", err);
        });
    },

    // 点击打开详情
    goDetails(keyId) {
      this.mycollect = false;
      this.$root.global.prociData = {};
      this.$root.global.showform = true;
      this.$http("/productDetail?pid=" + keyId).then((res) => {
        this.$root.global.prociData = res.data.result[0];
      });
    },

    // 点击地址管理
    onclickmap(){
      this.$router.push({name:'Delivery'})
    }
  },
};
</script>