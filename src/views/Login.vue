<template>
  <div class="login">
    <!-- 注册/登录页头部栏 -->
    <div class="hear">
      <div class="logo"></div>
      <div class="brandName">Nescafe Coffee</div>
      <button class="btn" @click="onClickRight">
        <router-link to="/home">先逛逛</router-link>
      </button>
    </div>
    <!-- 登录/注册信息conter -->
    <div class="wirthMassage">
      <h1>Nescafe 随时欢迎你！</h1>
      <h4>Please login to your accounts</h4>
      <van-form class="conter">
        <van-field
          v-model="userLoginMassege.username"
          name="用户名"
          label="用户名："
          placeholder="输入手机号/邮箱地址"
          :rules="[{ required: true, message: '请填写用户名' }]"
        />
        <van-field
          v-model="userLoginMassege.password"
          type="password"
          name="密码"
          label="密 码："
          placeholder="密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        />
        <div class="forget">
          <span @click="findPassword">忘记密码</span>
        </div>
        <div class="keepBnt">
          <div class="one" @click="loginUp">登录</div>
          <div class="two" @click="onShow">注册</div>
        </div>
      </van-form>
    </div>

    <div class="register" v-show="changeShowform">
      <transition name="showForm" appear>
        <div class="regConter" v-show="changeShowform">
          <div class="cax" @click="offe">×</div>
          <van-form class="inputTy">
            <van-field
              class="input"
              v-model="userReginMassege.username"
              name="手机号"
              label="手机号:"
              placeholder="输入手机号"
            />
            <van-field
              class="input"
              v-model="userReginMassege.password"
              type="password"
              name="密码"
              label="密 码："
              placeholder="密码"
            />
            <van-field
              class="input"
              v-model="userReginMassege.nikname"
              name="昵称"
              label="昵称："
              placeholder="昵称"
            />
          </van-form>
          <div class="setUp" @click="setUpData">提交</div>
        </div>
      </transition>
    </div>

    <!-- 找回密码 -->
    <van-popup
      v-model="show"
      closeable
      position="bottom"
      round
      :style="{ width: '100%', height: '50%' }"
    >
      <div class="findpass">
        <p>找回密码</p>
        <div class="inputs">
          邮<i></i>箱:<input
            type="text"
            v-model="email"
            placeholder="请输入邮箱号"
          /><br />
          验证码:<input
            type="text"
            v-model="verification"
            placeholder="请输入验证码"
          /><br />
          <span class="settime" @click="getverification">获取验证码</span>
          <div class="next" @click="goreset">下一步</div>
        </div>
      </div>
    </van-popup>

    <!-- 提交新密码 -->
    <van-popup
      v-model="showtwo"
      closeable
      position="bottom"
      round
      :style="{ width: '100%', height: '50%' }"
    >
      <div class="findpass">
        <p>找回密码</p>
        <div class="inputs">
          手机号:<input
            type="text"
            v-model="phoneNumber"
            placeholder="请输入手机号"
          /><br />
          新密码:<input
            type="text"
            v-model="newpassword"
            placeholder="请输入新密码"
          /><br />
          <div class="next" @click="goreset">提交</div>
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script>
import "../assets/less/login.less";
import { utils } from "../assets/js/utils";
// import { Toast } from "vant";

export default {
  name: "Login",
  data() {
    return {
      show: false,
      showtwo: false,
      // 显示或隐藏注册表单
      changeShowform: false,
      // 用户登录信息
      userLoginMassege: {
        username: "",
        password: "",
      },
      // 用户注册信息
      userReginMassege: {
        username: "",
        password: "",
        nikname: "",
      },
      // 邮箱
      email: "",
      // 验证码
      verification: "",
      // 注册时的手机号
      phoneNumber: "",
      // 新密码
      newpassword: "",
    };
  },
  methods: {
    onClickRight() {
      console.log("返回");
    },
    offe() {
      this.changeShowform = false;
    },
    // 显示或隐藏注册表单
    onShow() {
      this.changeShowform = true;
    },
    // 登录账号
    loginUp() {
      //发起登录请求
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });
      this.$http({
        method: "post",
        url: "/login",
        data: {
          password: this.userLoginMassege.password,
          phone: this.userLoginMassege.username,
        },
      })
        .then((res) => {
          this.$toast.clear();
          if (res.data.code === 200) {
            // let st = res.data.token
            // console.log(st)
            this.$cookies.set("tokenString", res.data.token, "1d");
            // console.log(this.$cookies.keys())
            this.$router.push({ path: "/main" });
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
          console.log("err==>", err);
        });
    },
    // 提交注册数据
    setUpData() {
      // 验证表单信息规则
      let regular = {
        username: {
          value: this.userReginMassege.username,
          reg: /^1[3-9]\d{9}$/,
          error: "所填手机号码无效",
        },
        password: {
          value: this.userReginMassege.password,
          reg: /^[a-zA-Z]\w{5,15}$/,
          error: "需要6~16位之间,首字符要为字母开头",
        },
        nikname: {
          value: this.userReginMassege.nikname,
          reg: /^[\u4e00-\u9fa5A-Za-z0-9]{1,10}$/,
          error: "昵称职称汉字字母数字组合1~10位",
        },
      };
      // 验证表单
      if (!utils.validateForm(regular)) {
        return;
      } else {
        // 隐藏注册表单
        this.changeShowform = false;
      }
      // 请求加载
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });
      // 请求数据验证
      this.$http({
        method: "post",
        url: "/register",
        data: {
          nickName: this.userReginMassege.nikname,
          password: this.userReginMassege.password,
          phone: this.userReginMassege.username,
        },
      }).then((res) => {
        this.$toast.clear();
        if (res.data.code == 100) {
          for (let k in this.userReginMassege) {
            this.userReginMassege[k] = "";
          }
        } else {
          this.$toast({
            message: res.data.msg,
            forbidClick: true,
            duration: 3000,
          }).catch((err) => {
            this.$toast.clear();
            console.log("err ==> ", err);
          });
        }
      });
    },

    // 忘记密码
    findPassword() {
      this.show = true;
    },

    //获取验证码
    getverification() {
      this.$http({
        method: "post",
        url: "/emailValidCode",
        data: {
          email: this.email,
        },
      }).then((res) => {
        if (res.data.code == "J001") {
          this.updatatime();
        }
      });
    },

    // 验证码倒计时
    updatatime() {
      let timeconter = document.querySelector(".settime");
      let times = 120;
      let timeclare = null;
      timeclare = setInterval(() => {
        timeconter.innerHTML = times-- + "s";
        if (times == 0) {
          clearInterval(timeclare);
          timeconter.innerHTML = "获取验证码";
        }
      }, 1000);
    },

    // 进入重置密码
    goreset() {
      this.$http({
        method: "post",
        url: "/retrievePassword",
        data: {
          phone: this.phoneNumber,
          password: this.newpassword,
        },
      }).then((res) => {
        if(res.data.code == "L001")
        this.showtwo = true;
        this.show = false;
      });
    },
  },
};
</script>
<style lang="less">
</style>