<template>
  <div class="submit">
    <div class="heard">
      <span @click="onClickLeft">返回</span>
      <p>订单结算</p>
      <span @click="goChangeSite">选择地址</span>
    </div>
    <div class="site">
      <p class="title">地址信息</p>
      <van-address-list
        v-model="chosenAddressId"
        :list="list"
        :switchable="false"
        default-tag-text="默认"
        add-button-text="立即结算"
        @edit="edit"
        @add="closeAccount"
      />
    </div>
    <div class="conter">
      <p class="title">订单信息</p>
      <div class="playform" v-for="(v, k) in submidata" :key="k">
        <div class="conter">
          <div class="pimg">
            <img :src="v.small_img" />
          </div>
          <div class="p-txt">
            <p class="name">
              {{ v.name }}<span class="rule">{{ v.rule }}</span>
            </p>
            <p>{{ v.enname }}</p>
            <p>
              <i>￥</i>{{ v.price
              }}<span class="much">数量:×{{ v.count }}</span>
            </p>
          </div>
        </div>
      </div>
      <div class="sumMuy">
        <div class="time">
          <p><span>共计:</span>{{ num }}件</p>
          <p>{{ time }}</p>
        </div>
        <div class="sum">
          <span
            >合计:<i>{{ total }}</i></span
          >
        </div>
      </div>
    </div>

    <div class="botn">
      <van-popup
        v-model="show"
        round
        closeable
        position="bottom"
        :style="{ height: '50%' }"
      >
        <van-address-list
          v-model="chosenAddressId2"
          :list="list2"
          default-tag-text="默认"
          @select="selectadd"
          @add="onAdd"
        />
      </van-popup>
    </div>
  </div>
</template>
<script>
import "../assets/less/submit.less";
import "../assets/less/playform.less";
export default {
  name: "Submit",
  data() {
    return {
      //   默认地址信息
      list: [],
      chosenAddressId: "",
      // 显示地址列表
      show: false,
      // 定单内容sid
      sids: [],
      // 订单内容
      submidata: [],
      // 总金
      total: 0,
      // 总数量
      num: 0,
      // 时间
      time: "",

      chosenAddressId2: "2",
      list2: [],
    };
  },
  created() {
    this.getordersite();
    if(this.$route.query.sids == undefined){
      return
    }
    this.sids = this.$route.query.sids.split("-");
    this.getcloseData();
  },
  methods: {
    onClickLeft() {
      this.$router.push({ name: "ShopCat" });
    },
    // 选择地址
    onAdd() {
      this.$router.push({ name: "Delivery" });
    },
    goChangeSite() {
      this.show = true;
    },
    showPopup() {
      this.show = true;
    },
    selectadd(item) {
      this.list = [item];
      this.show = false;
    },
    // 编辑地址
    edit({ aid }) {
      this.$router.push({ name: "Address", params: { aid } });
    },
    // 获取以保存收货地址
    getordersite() {
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
        method: "get",
        url: "/findAddress",
        params: {
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
            return this.$router.push({ name: "Login" });
          }

          if (res.data.code === 20000) {
            res.data.result.forEach((v) => {
              v.address = `${v.province}${v.city}${v.county}${v.addressDetail}`;
              v.isDefault = !!v.isDefault; //转换成布尔值
              this.list2.push(v);
              if (v.isDefault) {
                this.list.push(v);
              }
            });
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

    // 订单内容
    getcloseData() {
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
        method: "get",
        url: "/commitShopcart",
        params: {
          tokenString,
          sids: JSON.stringify(this.sids),
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

          if (res.data.code === 50000) {
            this.submidata = res.data.result;
            this.sum();
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

    // 总金额
    sum() {
      let total = 0;
      let num = 0;
      this.submidata.forEach((v) => {
        total += v.count * v.price;
        num += v.count;
      });
      this.total = parseFloat(total);
      this.num = num;
      this.getTime();
    },

    // 获取当前时间
    getTime() {
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      let hours = date.getHours();
      let muin = date.getMinutes();
      month = month > 10 ? month : "0" + month;
      day = day > 10 ? day : "0" + day;
      hours = hours > 10 ? hours : "0" + hours;
      muin = muin > 10 ? muin : "0" + muin;
      this.time = year + "/" + month + "/" + day + "-" + hours + ":" + muin;
    },

    // 结算订单
    closeAccount() {
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
      console.log(...this.sids);

      this.$http({
        method: "post",
        url: "/pay",
        data: {
          tokenString,
          sids:JSON.stringify(this.sids),
          phone: this.list.tel,
          address: this.list.address,
          receiver: this.list.name,
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

          if (res.data.code === 60000) {
            this.$router.push({path:'/main'})
            this.$root.global.swap = 1;
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
  },
};
</script>