<template>
  <div class="delivery">
    <div class="heard">
      <span @click="onClickLeft">返回</span>
      <p>地址管理</p>
    </div>

    <div class="conter">
      <div class="addlit">
        <van-address-list
          v-model="chosenAddressId"
          :list="list"
          :switchable="false"
          default-tag-text="默认"
          default-tag-text-color="#8f5105"
          @add="onAdd"
          @edit="onEdit"
        />
      </div>
    </div>
  </div>
</template>
<script>
import "../assets/less/delivery.less";
// import { Toast } from "vant";
export default {
  name: "Delivery",

  data() {
    return {
      chosenAddressId: "1",
      list: [],
    };
  },

  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.getDelivered();
    });
  },
  methods: {
    onClickLeft() {
      this.$router.push({name:'Submit'});
    },
    // 新增地址
    onAdd() {
      this.$router.push({ name: "Address" });
    },
    // 编辑地址
    onEdit({ aid }) {
      this.$router.push({ name: "Address", params: { aid } });
    },

    // 获取已存储的收货地址
    getDelivered() {
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
            });

            this.list = res.data.result;
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