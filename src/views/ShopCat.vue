<template>
  <div class="shopcat">
    <div class="heard">
      <span @click="onClickLeft">返回</span>
      <p>购物车</p>
      <span @click="onClickRight" v-if="getShopCutData.length > 0">{{
        editor ? "完成" : "编辑"
      }}</span>
    </div>
    <!-- 内容列表 -->
    <div class="center">
      <van-empty
        v-show="getShopCutData.length <= 0"
        class="custom-image"
        image="https://img.yzcdn.cn/vant/custom-empty-image.png"
        description="怎么能空空的呢？"
      >
        <div class="guang" @click="goshoping">逛一逛呗</div>
      </van-empty>
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        offset="100"
        @load="onLoad"
        v-show="getShopCutData.length > 0"
      >
        <div
          class="ulList"
          v-for="(item, index) in getShopCutData"
          :key="index"
        >
          <van-swipe-cell :disabled="editor ? false : true">
            <div class="list">
              <van-checkbox
                class="chose"
                v-model="item.isChecked"
                @click="simpleSelect"
                icon-size="18px"
                checked-color="#8f5105"
              ></van-checkbox>
              <div class="imgPg">
                <img :src="item.small_img" />
              </div>
              <div class="tets">
                <h2>{{ item.name }}</h2>
                <p>{{ item.enname }}</p>
                <p>{{ item.rule }}</p>
              </div>
              <div class="much">
                <p>
                  <i>￥</i><span>{{ item.price }}</span>
                </p>
                <div>
                  <i
                    @click="
                      updataCuttMinus(
                        item.sid,
                        item.count-- <= 1 ? (item.count = 1) : item.count
                      )
                    "
                    >-</i
                  >
                  <span>{{ item.count }}</span>
                  <i
                    @click="
                      updataCuttAdd(
                        item.sid,
                        item.count++ >= 99 ? (item.count = 99) : item.count
                      )
                    "
                    >+</i
                  >
                </div>
              </div>
            </div>
            <template #right>
              <van-button
                square
                type="danger"
                text="删除"
                class="delete-button"
                @click="removePrice([item.sid], index)"
              />
            </template>
          </van-swipe-cell>
        </div>
      </van-list>
    </div>
    <!-- 结算 -->
    <div class="buttomChose" v-if="getShopCutData.length > 0">
      <van-submit-bar
        class="allSet"
        :price="total"
        button-text="提交订单"
        button-color="#8f5105"
        @submit="onSubmit"
        v-show="!editor"
      >
        <van-checkbox
          v-model="checked"
          checked-color="#8f5105"
          @click="chagneAll"
          >全选</van-checkbox
        >
      </van-submit-bar>

      <!-- 编辑状态 -->
      <van-submit-bar
        class="allSet"
        :price="total"
        button-color="#8f5105"
        button-text="删除"
        @submit="removeallprice"
        v-show="editor"
      >
        <van-checkbox
          v-model="checked"
          checked-color="#8f5105"
          @click="chagneAll"
          >全选</van-checkbox
        >
      </van-submit-bar>
    </div>
  </div>
</template>
<script>
import "../assets/less/shopCat.less";

export default {
  name: "ShopCat",
  data() {
    return {
      // 全选或者取消全选
      checked: false,
      // 改变编辑状态
      editor: false,

      // 是否加载，首次不触发懒加载
      loading: true,

      // 是否全部加载完毕
      finished: false,

      // 数据截取开始位置
      start: 0,

      // 截取数量
      count: 6,

      // 购物车全部数据
      getShopCutAllData: [],
      //购物车数据
      getShopCutData: [],

      // 商品总价格
      total: 0,

      // 购物车总条数
      catAllmuch: this.$root.global,
    };
  },

  mounted() {
    this.$root.global.swap = 3;
    // 查询用户购物车信息
    this.getUserprict();

    // 获取购物车总数量
    this.getShopCutAll();

    this.getCuttmuch();
  },
  beforeUpdated() {
    this.getUserprict();
  },
  updated() {
    this.grossPrice();

    this.getCuttmuch();
  },

  methods: {
    // 返回
    onClickLeft() {
      this.$router.push({ path: "/main" });

      // 改变底部导航图标高亮
      this.$root.global.swap = 1;
    },

    // 编辑
    onClickRight() {
      this.editor = !this.editor;
    },

    // // 获取购物车总数量
    getShopCutAll() {
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
      this.$http("/shopcartCount?tokenString=" + tokenString)
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

          if (res.data.code === 4000) {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 0,
            });
          }
        })
        .catch((err) => {
          this.$toast.clear();
          console.log("err==>", err);
        });
    },

    // 查询用户购物车信息
    getUserprict() {
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

      this.$http("/findAllShopcart?tokenString=" + tokenString)
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

          if (res.data.code === 5000) {
            res.data.result.forEach((v) => {
              v.isChecked = false;
            });

            this.getShopCutAllData = res.data.result;

            this.getShopCutData = this.getShopCutAllData.slice(
              this.start,
              this.start + this.count
            );

            this.start += this.count;

            if (this.getShopCutAllData.length < this.count) {
              this.finished = true;
              return;
            }

            this.loading = false;
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

    // 获取购物车总条数数量
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
              duration: 1000,
            });
            return this.$router.push({ name: "Login" });
          }

          if (res.data.code === 8000) {
            this.$root.global.cutmusch = res.data.result;
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
          console.log("err ==> ", err);
        });
    },

    // 改变选择状态
    // 全选
    chagneAll() {
      this.getShopCutData.forEach((v) => {
        v.isChecked = this.checked;

        this.grossPrice();
      });
    },
    // 单选
    simpleSelect() {
      for (let i = 0; i < this.getShopCutData.length; i++) {
        this.grossPrice();
        if (!this.getShopCutData[i].isChecked) {
          this.checked = false;
          return;
        }
      }
      this.checked = true;
    },

    // 修改购物车数量(-)
    updataCuttMinus(sid, count) {
      let tokenString = this.$cookies.get("tokenString");

      if (!tokenString) {
        return this.$router.push({ name: "Login" });
      }

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        //请求方式
        method: "POST",
        url: "/modifyShopcartCount",
        data: {
          tokenString,
          sid,
          count,
        },
      })
        .then((res) => {
          this.$toast.clear();

          if (res.data.code == 700) {
            this.getShopCutAll();
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 1000,
            });
            return this.$router.push({ name: "Login" });
          }

          if (res.data.code === 6000) {
            this.grossPrice();
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
          console.log("err ==> ", err);
        });
    },
    // 修改购物车数量(+)
    updataCuttAdd(sid, count) {
      let tokenString = this.$cookies.get("tokenString");

      if (!tokenString) {
        return this.$router.push({ name: "Login" });
      }

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        //请求方式
        method: "POST",
        url: "/modifyShopcartCount",
        data: {
          tokenString,
          sid,
          count,
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
            return this.$router.push({ name: "Login" });
          }

          if (res.data.code === 6000) {
            this.grossPrice();
          } else {
            this.getShopCutAll();
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 1000,
            });
          }
        })
        .catch((err) => {
          this.$toast.clear();
          console.log("err ==> ", err);
        });
    },

    // 删除购物车商品
    removePrice(sids, index) {
      let tokenString = this.$cookies.get("tokenString");

      if (!tokenString) {
        return this.$router.push({ name: "Login" });
      }

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        //请求方式
        method: "POST",
        url: "/deleteShopcart",
        data: {
          tokenString,
          sids: JSON.stringify(sids),
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
            return this.$router.push({ name: "Login" });
          }

          if (res.data.code == 7000) {
            if (index != undefined) {
              this.getShopCutData.splice(index, 1);
            } else {
            
              for (let i = 0; i < this.getShopCutData.length; i++) {
                if (this.getShopCutData[i].isChecked) {
                  this.getShopCutData.splice(i, 1);
                  i--;
                }
              }
            }
          }

          this.$toast({
            message: res.data.msg,
            forbidClick: true,
            duration: 1000,
          });
        })
        .catch((err) => {
          this.$toast.clear();
          console.log("err ==> ", err);
        });
    },

    // 删除勾选的所以商品
    removeallprice() {
      let rm = [];
      // 遍历购物车里面的所有内容并筛选出勾选状态的商品
      this.getShopCutData.forEach((v) => {
        if (v.isChecked) {
          rm.push(v.sid);
        }
      });
      this.removePrice(rm);
    },

    // 计算价格
    grossPrice() {
      let total = 0;
      this.getShopCutData.forEach((v) => {
        if (v.isChecked) {
          total += v.price * v.count;
        }
      });

      this.total = total * 100;
      //  console.log(this.total);
    },

    // 加载更多
    onLoad() {
      setTimeout(() => {
        console.log("加载更多。。。。");

        let data = this.getShopCutData.slice(
          this.start,
          this.start + this.count
        );

        this.getShopCutData.push(...data);

        this.start += this.count;

        if (data.length < this.count) {
          console.log("已经加载完毕...");
          this.finished = true;
          return;
        }
        this.loading = false;
      }, 1000);
    },

    // 逛一逛
    goshoping() {
      this.$root.global.swap = 1;
      this.$router.push("/main");
    },

    // 提交订单
    onSubmit() {
      //  获取选择商品信息
      let sids = [];

      // 遍历取出选择的商品信息
      this.getShopCutData.forEach((v) => {
        if (v.isChecked) {
          sids.push(v.sid);
        }
      });
      this.$router.push({name:'Submit',query:{sids: sids.join('-')}})
    },
  },
};
</script>