<template>
  <div class="address">
    <div class="heard">
      <span @click="onClickLeft">返回</span>
      <p>{{ aid ? "编辑地址" : "新增地址" }}</p>
    </div>

    <div class="conter">
      <van-address-edit
        :area-list="areaList"
        show-postal
        :show-delete="!!aid"
        show-set-default
        show-search-result
        :detail-maxlength="40"
        :area-columns-placeholder="['请选择', '请选择', '请选择']"
        :address-info="aiddeliverInfor"
        @save="save"
        @delete="onDelete"
      />
    </div>
  </div>
</template>
<script>
// import { Toast } from "vant";
import "../assets/less/address.less";
import area from "../assets/js/area.js";

export default {
  name: "Address",
  data() {
    return {
      // 省市区的数据
      areaList: area,
      // 编辑地址的初始值
      aiddeliverInfor: {},
      // 编辑地址的aid
      aid: "",
    };
  },
  created() {
    //截取路由参数
    this.aid = this.$route.params.aid;
    if (this.aid) {
      this.modification();
    }
  },

  methods: {
    onClickLeft() {
      this.$router.push({name:'Delivery'});
    },

    // 保存地址
    save(val) {
      //   Toast("保存成功");

      let tokenString = this.$cookies.get("tokenString");

      if (!tokenString) {
        return this.$router.push({ name: "Login" });
      }

      let data = { ...val, tokenString };
      data.isDefault = Number(data.isDefault);
      delete data.country;

      // 加载
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.$http({
        method: "post",
        url: this.aid ? "/editAddress" : "/addAddress",
        data,
      })
        .then((res) => {
          this.$toast.clear();

          console.log(res);
          if (res.data.code == 700) {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 1000,
            });
            return this.$router.push({ name: "Login" });
          }

          if (res.data.code === 30000 || res.data.code === 9000) {
            this.$router.push({ name: "Delivery" });
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

    // 删除地址
    onDelete() {
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
        url: "/deleteAddress",
        data: {
          aid: this.aid,
          tokenString,
        },
      })
        .then((res) => {
          this.$toast.clear();
          console.log(res);
          if (res.data.code == 700) {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 1000,
            });
            return this.$router.push({ name: "Login" });
          }

          if (res.data.code === 10000) {
            this.$router.push({ name: "Delivery" });
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

    // 修改地址指定地址(aid)
    modification() {
      //查询地址数据
      let tokenString = this.$cookies.get("tokenString");
     
      if (!tokenString) {
        return this.$router.push({ name: "Login" });
      }

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.$http({
        method: "get",
        url: "/findAddressByAid",
        params: {
          tokenString,
          aid: this.aid,
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

          if (res.data.code === 40000) {
            let data = res.data.result[0];

            // this.aiddeliverInfor = {};
            data.isDefault = !!data.isDefault;

            this.aiddeliverInfor = data;
         
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
  },
};
</script>