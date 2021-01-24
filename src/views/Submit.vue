<template>
  <div class="submit">
    <div class="heard">
      <span @click="onClickLeft">返回</span>
      <p>订单结算</p>
      <span @click="goChangeSite">选择地址</span>
    </div>
    <div class="site">
      <van-address-list
        v-model="chosenAddressId"
        :list="list"
        :switchable="false"
        default-tag-text="默认"
        @edit="edit"
      />
    </div>
    <div class="conter">订单内容</div>
  </div>
</template>
<script>
import "../assets/less/submit.less";
export default {
  name: "Submit",
  data() {
    return {
      //   默认地址信息
      list: [],
      chosenAddressId:1
    };
  },
  mounted() {
    this.getordersite();
  },
  methods: {
    onClickLeft() {
      this.$router.push({name:'ShopCat'});
    },
    // 选择地址
    goChangeSite() {
      this.$router.push({ name: "Delivery" });
    },
    // 编辑地址
    edit({aid}){
        this.$router.push({name:'Address',params: { aid }})
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
  },
};
</script>