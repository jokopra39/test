<template>
  <v-row>
    <v-col class="text-center">
      <span>Document</span>
      <t-comp @getEmit="updateEmit" :test-props="setProps">
        <template v-slot:slotHeader="{ grantInfo }">
          {{ grantInfo.name }}
        </template>
      </t-comp>
      <div>{{ dataEmit }}</div>
      <div>{{ setDataProps }}</div>
    </v-col>
  </v-row>
</template>
<script>
import tComp from "@/components/TestComponent";
export default {
  components: {
    tComp,
  },
  data: () => ({
    getObj: [],
    setProps: "this data from props",
    setDataProps: {},
  }),
  computed: {
    dataEmit: {
      get() {
        return "oke";
      },
      set(v) {},
    },
  },
  methods: {
    updateEmit(data) {
      this.setDataProps = data;
    },
  },
};
</script>