<template>
  <div class="setting">
    <div class="heard">
      <span @click="goback">返回</span>
      <p>设置</p>
    </div>
    <ul>
      <li>
        <p>
          修改昵称<span @click="showPopup"><van-icon name="arrow" /></span>
        </p>
        <div class="ipt" v-show="show">
          <input type="text" v-model="newword" placeholder="请输入昵称" />
          <button @click="onchangeNikname">确定</button>
        </div>
      </li>
      <li>
        <p>
          更换头像<span @click="showHear"><van-icon name="arrow" /></span>
        </p>
        <div v-show="heardImg">
          <div class="hearImg">
            <van-uploader :after-read="afterRead" multiple :max-count="1" />
          </div>
        </div>
      </li>
      <li>
        <p>
          修改背景图片<span @click="showBgimg"><van-icon name="arrow" /></span>
        </p>
        <div v-show="bgImg">
          <div class="hearImg">
            <van-uploader :after-read="afterBg" multiple :max-count="1" />
          </div>
        </div>
      </li>
      <li>
        <p>
          修改用户密码<span @click="showPassword"
            ><van-icon name="arrow"
          /></span>
        </p>
        <div v-show="changePassword">
          <div class="changpassword">
            旧密码:<input type="text" v-model="orderPassword" /><br />
            新密码:<input type="text" v-model="newPassword" /><br />
            确认密码:<input type="text" v-model="truePassword" />
          </div>
          <button @click="changpassword">确定</button>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import "../assets/less/settingup.less";
export default {
  name: "SettingUp",
  data() {
    return {
      show: false,
      heardImg: false,
      bgImg: false,
      changePassword: false,
      // 用户以前的信息
      massge: {},
      // 修改内容(昵称)
      newword: "",
      // 密码
      newPassword: "",
      orderPassword: "",
      truePassword: "",
    };
  },
  created() {
    this.massge = this.$route.params.massge;
  },
  methods: {
    goback() {
      this.$router.go(-1);
    },
    showPopup() {
      this.show = true;
      this.heardImg = false;
      this.bgImg = false;
      this.changePassword = false;
    },
    showHear() {
      this.heardImg = true;
      this.show = false;
      this.bgImg = false;
      this.changePassword = false;
    },
    showBgimg() {
      this.bgImg = true;
      this.heardImg = false;
      this.show = false; 
      this.changePassword = false;
    },
    showPassword() {
      this.changePassword = true;
      this.bgImg = false;
      this.heardImg = false;
      this.show = false;
    },

    // 修改昵称
    onchangeNikname() {
      if (this.newword == "") {
        return this.$toast({
          message: "输入内容为空",
          forbidClick: true,
          duration: 1000,
        });
      }
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
        url: "/updateNickName",
        data: {
          nickName: this.newword,
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

          if (res.data.code === "C001") {
            this.show = false;
            this.newword = "";
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

    // 修改密码
    changpassword() {
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

      if (this.truePassword == this.newPassword) {
        this.$http({
          method: "post",
          url: "/updatePassword",
          data: {
            password: this.newPassword,
            oldPassword: this.orderPassword,
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

            if (res.data.code === "E001") {
              this.changePassword = false;
              (this.newPassword = ""),
                (this.orderPassword = ""),
                (this.truePassword = "");
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
      } else {
        this.$toast({
          message: "密码不一致",
          forbidClick: true,
          duration: 1000,
        });
      }
    },

    // 上传头像
    afterRead(file) {
      let tokenString = this.$cookies.get("tokenString");
      let type = file.file.type.split("/")[1];
      let types = ["png", "gif", "jpg", "jpeg"];

      if (!tokenString) {
        return this.$router.push({ name: "Login" });
      }

      // 加载
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      if (types.indexOf(type) === -1) {
        return this.$toast.loading({
          message: `文件只支持:${types.join(",")}`,
          forbidClick: true,
          duration: 2000,
        });
      }

      this.$http({
        method: "post",
        url: "/updateAvatar",
        data: {
          imgType: type,
          serverBase64Img: file.content.split(",")[1],
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

          if (res.data.code == "H001") {
            this.show = false;
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

    // 上传背景
    afterBg(file){
       let tokenString = this.$cookies.get("tokenString");
      let type = file.file.type.split("/")[1];
      let types = ["png", "gif", "jpg", "jpeg"];

      if (!tokenString) {
        return this.$router.push({ name: "Login" });
      }

      // 加载
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      if (types.indexOf(type) === -1) {
        return this.$toast.loading({
          message: `文件只支持:${types.join(",")}`,
          forbidClick: true,
          duration: 2000,
        });
      }

      this.$http({
        method: "post",
        url: "/updateUserBg",
        data: {
          imgType: type,
          serverBase64Img: file.content.split(",")[1],
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

          if (res.data.code == "I001") {
            this.bgImg = false;
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
    }
  },
};
</script>