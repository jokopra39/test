<template>
  <div>
    <slot name="slotHeader" :grantInfo="grant"></slot>:
    <span>{{ testProps }}</span>
  </div>
</template>
<script>
export default {
  props: {
    testProps: String,
  },
  data: () => ({
    grant: { access: "admin", name: "administrator" },
  }),
  created() {
    this.clickEmit();
  },
  methods: {
    clickEmit() {
      this.$emit("getEmit", this.grant);
    },
  },
};
</script>