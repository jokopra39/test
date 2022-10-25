<template>
  <v-row>
    <v-col class="text-center">
      <span>Test ungrid</span>
      <un-grid >
        <!-- <template v-slot:slotHeader="{ grantInfo }">
          {{ grantInfo.name }}
        </template> -->
        <template v-slot:view_carbs="{item}">{{ item.carbs+'gh' }}</template>
        <template v-slot:view_actions="{item}">{{ item.actions+'osdsekekeke' }}</template>
      </un-grid>
    </v-col>
  </v-row>
</template>
<script>
import unGrid from "@/components/table/Ungrid";
export default {
  components: {
    unGrid,
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