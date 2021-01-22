<template>
  <transition name="goDetails">
    <div class="parL" v-show="this.$root.global.showform">
      <div class="topHead">
        <span @click="onClickLeft">返回</span>
        <p>商品详情</p>
      </div>
      <div class="ImBg">
        <img :src="this.$root.global.prociData.large_img" />
      </div>
      <!-- 详情模板 -->
      <transition name="allLeave">
        <div class="allText" v-show="this.$root.global.showform">
          <div class="all_name">
            <div>
              <p>{{ this.$root.global.prociData.name }}</p>
              <p>{{ this.$root.global.prociData.enname }}</p>
            </div>
            <span><i>￥</i>{{ this.$root.global.prociData.price }}</span>
          </div>
          <div class="dosing">
            <span class="love" @click="isDeletIcoCut">
              <van-icon
                name="like-o"
                size="25"
                :color="lcou ? '#ee0a24' : '#666'"
              />
            </span>
            <p>
              <span>{{ changeMassage.temp.tem }}:</span>
              <i
                v-for="(key, index) in changeMassage.temp.chose"
                :key="index"
                class="olc"
                @click="changeTem(key, index)"
                >{{ key }}</i
              >
            </p>
            <p>
              <span>{{ changeMassage.sugar.sug }}:</span>
              <i
                v-for="(key, index) in changeMassage.sugar.chose"
                :key="index"
                @click="changeSug(key, index)"
                class="evn"
                >{{ key }}</i
              >
            </p>
          </div>
          <!-- 商品介绍 -->
          <div class="referral">
            <p>商品详情</p>
            <div class="test">{{ this.$root.global.prociData.desc }}</div>
          </div>
        </div>
      </transition>

      <van-goods-action class="cut br">
        <van-goods-action-icon
          class="cut"
          icon="chat-o"
          text="客服"
          color="#8f5105"
          dot
        />
        <van-goods-action-icon
          class="cut"
          icon="cart-o"
          text="购物车"
          color="#8f5105"
          @click="goShopChut"
          :badge="
            this.$root.global.cutmusch > 0 ? this.$root.global.cutmusch : ''
          "
        />
        <van-goods-action-button
          color="#9b6206"
          type="warning"
          text="加入购物车"
          @click="addCut()"
        />
        <van-goods-action-button
          color="#8f5105"
          type="danger"
          text="立即购买"
        />
      </van-goods-action>
    </div>
  </transition>
</template>
<script>
import "../assets/less/particulars.less";

export default {
  name: "ParL",
  data() {
    return {
      // 爱心收藏
      lcou: false,
      // 选项数据
      opsition: this.$root.global,
      //商品规格信息
      changeMassage: {
        id: {
          pid: "",
        },
        temp: {
          tem: "温度",
          chose: [],
        },
        sugar: {
          sug: "糖",
          chose: [],
        },
      },
      // 用户选择信息
      userchange: [],
      // 温度
      tem: [],
      // 糖分
      sug: [],
      // 购物车数量判断
      immediate: 0,
    };
  },
  
  watch: {
    "opsition.prociData.pid": function (newVal) {
      if (newVal == undefined) {
        return;
      }
      this.getIcoCut();
      // 选项数据
      this.$http("/productDetail?pid=" + newVal).then((res) => {
        let datas = res.data.result[0];
        this.changeMassage = {
          id: {
            pid: datas.pid,
          },
          temp: {
            tem: datas.tem_desc,
            chose: datas.tem.split("/"),
          },
          sugar: {
            sug: datas.sugar_desc,
            chose: datas.sugar.split("/"),
          },
        };
      });
      this.getCuttmuch();
    },
  },

  methods: {
    // 返回
    onClickLeft() {
      this.$root.global.showform = false;
    },

    // 选择商品规格
    changeTem(Tval, index) {
      this.tem = [];
      let Ico = document.querySelectorAll(".olc");
      for (let i = 0; i < Ico.length; i++) {
        Ico[i].className = "olc";
        Ico[index].className = "olc ico";
      }
      this.tem.push(Tval);
    },
    changeSug(Sval, index) {
      this.sug = [];
      let Ico = document.querySelectorAll(".evn");
      for (let i = 0; i < Ico.length; i++) {
        Ico[i].className = "evn";
        Ico[index].className = "evn ico";
      }
      this.sug.push(Sval);
    },

    // 取消收藏或收藏
    isDeletIcoCut() {
      // this.lcou = !this.lcou;
      if (!this.lcou) {
        // 收藏
        this.IcoCut();
      } else {
        // 取消收藏
        this.deletIcoCut();
      }
    },

    // 获取已收藏信息
    getIcoCut() {
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

      this.$http(
        "/findlike?pid=" +
          this.$root.global.prociData.pid +
          "&" +
          "tokenString=" +
          tokenString
      )
        .then((res) => {
          this.$toast.clear();

          if (res.data.code == 700) {
            // return this.$router.push({ name: "Login" });
            return;
          }

          if (res.data.code === 1000) {
            // 已收藏
            if (res.data.result.length > 0) {
              this.lcou = true;
            } else {
              this.lcou = false;
            }
          }
        })
        .catch((err) => {
          this.$toast.clear();
          console.log("err==>", err);
        });
    },

    // 爱心收藏
    IcoCut() {
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
      this.$http({
        method: "post",
        url: "/like",
        data: {
          pid: this.$root.global.prociData.pid,
          tokenString,
        },
      })
        .then((res) => {
          this.$toast.clear();

          if (res.data.code == 700) {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 3000,
            });
            return this.$router.push({ name: "Login" });
          }

          if (res.data.code === 800) {
            // 已收藏
            this.lcou = true;
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

    // 取消收藏
    deletIcoCut() {
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
      this.$http({
        method: "post",
        url: "/notlike",
        data: {
          pid: this.$root.global.prociData.pid,
          tokenString,
        },
      })
        .then((res) => {
          this.$toast.clear();

          if (res.data.code == 700) {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 3000,
            });
            return this.$router.push({ name: "Login" });
          }

          if (res.data.code === 900) {
            // 取消收藏

            this.lcou = false;
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

    // 添加购物车
    addCut() {
      let tokenString = this.$cookies.get("tokenString");
      this.userchange = [];
      // 合并选择数据
      this.userchange = this.tem.concat(this.sug);
      if (!tokenString) {
        return this.$router.push({ name: "Login" });
      }

      // 加载
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      // 判断用户是否选择了商品规格

      if (this.userchange.length <= 1) {
        // 未选择商品规格
        this.$toast({
          message: "请选择商品规格",
          forbidClick: true,
          duration: 1000,
        });

        return;
      }

      let rule = this.userchange.join("/");

      this.$http({
        method: "post",
        url: "/addShopcart",
        data: {
          pid: this.$root.global.prociData.pid,
          count: 1,
          rule: rule,
          tokenString,
        },
      })
        .then((res) => {
          
          this.$toast.clear();

          if (res.data.code == 700) {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 1000,
            });
            return;
          }

          if (res.data.code === 3000) {
            this.userchange = [];
            if (res.data.status === 1) {
              this.$root.global.cutmusch ++;
           
            }
            // 成功加入购物车
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

    // 跳转购物车页面
    goShopChut() {
      // 隐藏详情页
      this.$root.global.showform = false;

      // 改变底部导航图标高亮
      this.$root.global.swap = 3;

      // 跳转
      this.$router.push({ name: "ShopCat" });
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