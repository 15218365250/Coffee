export default {
    // 获取购物车总数量
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
                console.log("100=>", res);
                this.$toast.clear();
                if (res.data.code == 700) {
                    this.$toast({
                        message: res.data.msg,
                        forbidClick: true,
                        duration: 3000,
                    });
                    return this.$router.push({ name: "Login" });
                }

                if (res.data.code === 4000) {
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
                console.log("err==>", err);
            });
    
    }
}
