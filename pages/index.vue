<template>
  <v-row>
    <v-col cols="12" sm="8" md="6">
      <div style="font-size: 15px; font-weight: bold">Welcome to SIPTL</div>
    </v-col>
  </v-row>
</template>
<script>
export default {
  name: "index",
  head() {
    return {
      title: "INDEX",
    };
  },
  mounted() {
    this.$store.commit("setErrorText", "");
  },
};
</script>