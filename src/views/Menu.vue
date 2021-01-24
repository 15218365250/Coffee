<template>
  <div class="menu">
    <div class="heard">
      <p>菜单</p>
    </div>
    <div class="conter">
      <div class="listTitle">
        <van-tabbar v-model="active" :fixed="false" active-color="#8f5105">
          <van-tabbar-item
            v-for="(item, index) in tabbarData"
            :key="index"
            :dot="item.dot"
            @click="getclassifyData(item.title, item.type)"
          >
            <span>{{ item.title }}</span>
            <template #icon="props">
              <img
                :src="props.active ? item.icon.active : item.icon.inactive"
              />
            </template>
          </van-tabbar-item>
        </van-tabbar>
      </div>
      <div class="listForm">
        <ul>
          <li v-for="val in allMenuData" :key="val.pid" @click="xianList(val.pid)">
            <div class="imgPg">
              <img :src="val.smallImg" />
            </div>
            <div class="tets">
              <h2>{{ val.name }}</h2>
              <p>{{ val.enname }}</p>
              <p>{{ val.rule }}</p>
              <p class="much">
                <i>￥</i><span>{{ val.price }}</span>
              </p>
            </div>
            <div class="textSay">{{ val.desc }}</div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import "../assets/less/menu.less";
export default {
  name: "Menu",
  data() {
    return {
      active: 0,
      // 商品数据
      allMenuData: [],
    };
  },

  computed: {
    tabbarData() {
      return [
        {
          title: "推荐",
          type: "isHot",
          icon: {
            active: require("../assets/img/coffee(推荐2).svg"),
            inactive: require("../assets/img/coffee(推荐).svg"),
          },

          to: "",
        },
        {
          title: "拿铁",
          type: "latte",
          icon: {
            active: require("../assets/img/Coffee(拿铁2).svg"),
            inactive: require("../assets/img/Coffee(拿铁).svg"),
          },
          to: "",
        },
        {
          title: "咖啡",
          type: "coffee",
          icon: {
            active: require("../assets/img/coffee(咖啡2).svg"),
            inactive: require("../assets/img/coffee(咖啡).svg"),
          },
          to: "",
        },
        {
          title: "瑞纳冰",
          type: "rena_ice",
          icon: {
            active: require("../assets/img/coffee(瑞纳冰2).svg"),
            inactive: require("../assets/img/coffee(瑞纳冰).svg"),
          },
          dot: false,
          to: "",
        },
      ];
    },
  },

  mounted() {
    this.$root.global.swap = 2;
    this.getData('推荐','isHot')
  },

  methods: {
    // 点击切换类型
    getclassifyData(name, type) {
      this.getData(name,type);
    },
    // 获取对应分类商品
    getData(name,type) {
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
      // 获取菜单类型
      this.$http("/type")
        .then((res) => {
          this.$toast.clear();

          if (res.data.code == 700) {
            return;
          }

          if (res.data.code === 400) {
            // 成功后获取对应类型的商品列表
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

            let keytype = "type";
            // 推荐类型要转换
            if (name == "推荐") {
              keytype = "isHot";
              type = 1;
            }

            this.$http({
              method: "get",
              url: "/typeProducts",
              params: {
                key: keytype,
                value: type,
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
                // 获取成功
                if (res.data.code === 500) {
                  this.allMenuData = [];
                  console.log(res);
                  this.allMenuData = res.data.result;
                }
              })
              .catch((err) => {
                this.$toast.clear();
                console.log("err==>", err);
              });
          }
        })
        .catch((err) => {
          this.$toast.clear();
          console.log("err==>", err);
        });
    },

    // 商品详情
    xianList(vid){
    
      this.$root.global.prociData = {};
      this.$root.global.showform = true;
      this.$http("/productDetail?pid=" + vid).then((res) => {
        this.$root.global.prociData = res.data.result[0];
      });
    }
  },
};
</script>