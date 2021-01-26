<template>
  <div class="myorder">
    <div class="heard">
      <span @click="onClickLeft">返回</span>
      <p>我的订单</p>
    </div>
    <div class="conter">
      <div class="bgColor"></div>
      <div class="conter-main">
        <van-tabs
          v-model="active"
          background="#beae9b"
          title-active-color="#fff"
          @change="changeOrderStatus"
        >
          <van-tab v-for="(v, k) in tabs" :key="k" :title="v.title">
            <div class="orderlist" v-if="orderData.length > 0">
              <div
                class="order-box"
                v-for="(item, index) in orderData"
                :key="index"
              >
                <div class="pay-box" v-if="item.status === 2">
                  <p>{{ item.oid }}</p>
                  <span>已完成</span>
                  <van-icon
                    name="delete-o"
                    size="20"
                    @click="removeOrder(item.oid, index)"
                  />
                </div>
                <div class="pay-box" v-if="item.status === 1">
                  <p>{{ item.oid }}</p>
                  <span @click="confirmOrder(item, index)">确认收货</span>
                </div>
                <div>
                  <PlayForm
                    v-for="(v2, i2) in item.data"
                    :key="i2"
                    :product="v2"
                  />
                </div>
                <div class="much">
                  <span>总数量:{{ item.proInfo.count }}</span>
                  <span>合计:{{ item.proInfo.total }}</span>
                </div>
              </div>
            </div>
            <div v-else>
                  <van-empty
                    class="custom-image"
                    image="https://img.yzcdn.cn/vant/custom-empty-image.png"
                    description="没有了"
                  />
                </div>
          </van-tab>
        </van-tabs>
      </div>
    </div>
  </div>
</template>
<script>
import "../assets/less/myorder.less";
import PlayForm from "../components/PlayForm";
export default {
  name: "Myorder",
  components: {
    PlayForm,
  },
  data() {
    return {
      active: 0,

      tabs: [
        {
          title: "全部",
          status: 0,
        },
        {
          title: "进行中",
          status: 1,
        },
        {
          title: "已完成",
          status: 2,
        },
      ],
      //   订单数据
      orderData: [],
    };
  },
  created() {
    this.getAllorder(0);
  },

  methods: {
    //   返回
    onClickLeft() {
      this.$router.go(-1);
    },
    // 查询订单

    getAllorder(status) {
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
        url: "/findOrder",
        params: {
          tokenString,
          status,
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

          if (res.data.code === 70000) {
            console.log(res);

            let products = [];
            let oids = [];

            // 先查询订单号，并合并相同的订单号
            res.data.result.forEach((v) => {
              v.small_img = v.samallImg;
              if (oids.indexOf(v.oid) === -1) {
                let o = {
                  oid: v.oid,
                  status: v.status,
                  proInfo: {
                    date: v.updateAt,
                    count: 0,
                    total: 0,
                  },
                  data: [],
                };

                oids.push(v.oid);
                products.push(o);
              }
            });

            // 通过oid查找对应的订单产品
            products.forEach((value) => {
              res.data.result.forEach((item) => {
                if (value.oid === item.oid) {
                  value.data.push(item);
                  value.proInfo.count += item.count;
                  value.proInfo.total += item.count * item.price;
                }
              });
            });

            this.orderData = products;
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
    //切换订单状态
    changeOrderStatus(name) {
      this.getAllorder(name);
    },
    //确认订单
    confirmOrder(item, index) {
      let tokenString = this.$cookies.get("tokenString");

      if (!tokenString) {
        console.log("浏览器token不存在");
        return this.$router.push({ name: "Login" });
      }

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        //请求方式
        method: "post",
        url: "/receive",
        data: {
          tokenString,
          oid: item.oid,
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

          if (res.data.code === 80000) {
            item.status = 2;

            if (this.activeTabIndex === 1) {
              //移除当前tab的订单数据
              this.orderData.splice(index, 1);
            }
          }

          this.$toast({
            message: res.data.msg,
            forbidClick: true,
            duration: 2000,
          });
        })
        .catch((err) => {
          this.$toast.clear();
          console.log("err ==> ", err);
        });
    },

    //删除订单
    removeOrder(oid, index) {
      let tokenString = this.$cookies.get("tokenString");

      if (!tokenString) {
        console.log("浏览器token不存在");
        return this.$router.push({ name: "Login" });
      }

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        //请求方式
        method: "post",
        url: "/removeOrder",
        data: {
          tokenString,
          oid,
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

          if (res.data.code === 90000) {
            this.orderData.splice(index, 1);
          }

          this.$toast({
            message: res.data.msg,
            forbidClick: true,
            duration: 2000,
          });
        })
        .catch((err) => {
          this.$toast.clear();
          console.log("err ==> ", err);
        });
    },
  },
};
</script>