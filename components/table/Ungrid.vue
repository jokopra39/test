 <template>
  <v-data-table
    dense
    :headers="headers"
    :items="items"
    hide-default-footer
    disable-pagination
    item-key="name"
    class="elevation-1"
  >
    <template
      v-for="(col, idx) in headers"
      v-slot:[`item.${col.value}`]="{ item, index }"
    >
      <div :key="'k-item-data-' + idx">
        <template v-if="col.slotName != undefined && col.slotNo == undefined">
          <slot :name="viewName + col.value" v-bind="{ item, col, index }"> </slot>
        </template>
        <template v-else-if="col.slotNo != undefined">
          <slot :name="viewName + col.value" v-bind="{ index }"> </slot>
        </template>
        <template v-else>
          {{ item[col.value] }}
        </template>
      </div>
    </template>
  </v-data-table>
</template>
<script>
export default {
  data: () => ({
    get: [],
    viewName: "view_",
    headersManual: [
      {
        text: "Dessert (100g serving)",
        align: "start",
        sortable: false,
        value: "name",
        field: "name",
      },
      { text: "Calories", value: "calories" },
      { text: "Fat (g)", value: "fat" },
      {
        text: "Carbs (g)",
        value: "carbs",
        slotName: "carbs",
        field: "carbs",
      },
      { text: "Protein (g)", value: "protein" },
      { text: "Action", value: "actions", slotName: "actions" },
    ],
    desserts: [
      {
        name: "Frozen Yogurt",
        calories: 159,
        fat: 6.0,
        carbs: 24,
        protein: 4.0,
        iron: "1%",
        actions: "123",
      },
      {
        name: "Ice cream sandwich",
        calories: 237,
        fat: 9.0,
        carbs: 37,
        protein: 4.3,
        iron: "1%",
        actions: "dkhjgjui",
      },
      {
        name: "Eclair",
        calories: 262,
        fat: 16.0,
        carbs: 23,
        protein: 6.0,
        iron: "7%",
        actions: "dkhjgjui",
      },
      {
        name: "Cupcake",
        calories: 305,
        fat: 3.7,
        carbs: 67,
        protein: 4.3,
        iron: "8%",
        actions: "dkhjgjui",
      },
      {
        name: "Gingerbread",
        calories: 356,
        fat: 16.0,
        carbs: 49,
        protein: 3.9,
        iron: "16%",
        actions: "dkhjgjui",
      },
    ],
  }),
  props: {
    items: {
      type: Array,
      default: () => {
        return [];
      },
    },
    headers: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  methods: {
    setBack(val) {
      if (val == "mdi-arrow-left-circle") {
        this.$router.back();
      }
    },
  },
  watch: {
    setPageIcon: function (val) {
      let url = this.$route.path;
      let urlFirst = url.split("/");
      //console.log("val", this.setPageTitle, urlFirst[1])
    },
  },
  computed: {
    listCustomSlotNames() {
      return this.listCustomFields.map((x) => {
        return "view_" + x;
      });
    },
  },
};
</script>