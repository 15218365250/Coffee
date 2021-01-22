<template>
  <div>我的</div>
</template>
<script>
export default {
  name: "Myself",
  mounted() {
    this.$root.global.swap = 4;
  },
};
</script>