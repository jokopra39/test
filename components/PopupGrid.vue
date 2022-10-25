<template>
  <v-dialog
    v-model="dialog"
    persistent
    @click:outside="closeModal()"
    max-width="75%"
  >
    <v-card>
      <v-card-title class="cyan darken-3"
        ><!-- lighten-5  -->
        <span v-if="title != ''" style="color: white">{{ title }}</span>
        <v-spacer></v-spacer>
        <v-btn color="white" icon @click="closeModal()">
          <v-icon>mdi-close</v-icon>
        </v-btn> </v-card-title
      ><v-skeleton-loader
        :loading="isLoading"
        type="table-heading, list-item-two-line, image, table-tfoot"
      >
        <v-card-text class="content-wrapper">
          <v-data-table
            :headers="headers"
            :items="items"
            hide-default-footer
            disable-pagination
            class="content"
          >
            <template
              v-for="(col, idx) in headers"
              v-slot:[`item.${col.value}`]="{ item, index }"
            >
              <div :key="'k-item-data-' + idx">
                <template
                  v-if="col.slotName != undefined && col.slotNo == undefined"
                >
                  <slot :name="viewName + col.value" v-bind="{ item, col }">
                  </slot>
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
        </v-card-text>
      </v-skeleton-loader>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "v-popup-grid",
  props: {
    isShow: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    isLoading: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
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
    title: {
      type: String,
      default: () => {
        return "";
      },
    },
    onClose: {
      type: Function,
      default: () => ({}),
    },
    dateDisplayFormat: {
      type: String,
      default: "DD MMMM YYYY",
    },
  },
  data: () => ({
    viewName: "view_",
    dialog: false,
  }),
  watch: {
    isShow: function () {
      this.dialog = this.isShow;
    },
    dialog: function (val) {
      if (!val) this.onClose();
    },
  },
  mounted() {
    this.dialog = this.isShow;
  },
  methods: {
    closeModal() {
      this.dialog = false;
      this.$emit("closeModal");
    },
    formatDate(date, fmt) {
      return moment(date).format(fmt);
    },
    getTanggalTerbit(date, format) {
      return new Date(date) != "Invalid Date"
        ? this.formatDate(date, format)
        : "";
    },
    getPeriode(start, end, format) {
      let dateStart =
        new Date(start) != "Invalid Date"
          ? this.formatDate(new Date(start), format)
          : "";
      let dateEnd =
        new Date(end) != "Invalid Date"
          ? this.formatDate(new Date(end), format)
          : "";
      return dateStart + " - " + dateEnd;
    },
  },
};
</script>