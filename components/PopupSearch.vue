<template>
  <v-dialog v-model="dialog" persistent fullscreen hide-overlay>
    <div class="bg-dialog">
      <div class="text-right">
        <v-btn color="white" icon @click="closeModal()">
          <v-icon size="22px">mdi-close</v-icon>
        </v-btn>
      </div>
      <div class="text-center text-white space-search">
        <div class="mt-12">
          <div class="text-title mt-12">{{ title }}</div>
          <div>
            <input
              type="text"
              v-model="inputSearch"
              placeholder="Artist / Album / Title"
              class="inp-search inp mt-6"
            />
          </div>
          <div>
            <div>
              <button
                class="inp btn-search-dialog mt-5"
                @click="actionSearch"
                type="button"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </v-dialog>
</template>
    
    <script>
export default {
  name: "v-popup-user",
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
    isCreate: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
  },
  data: () => ({
    viewName: "view_",
    dialog: false,
    valid: true,
    inputSearch: "",
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
    resetForm: function () {
      this.inputSearch = "";
    },
    closeModal() {
      this.dialog = false;
      this.$emit("closeModal");
    },
    showModal: function (v) {
      //console.log(v)
      let nthis = this.form;
      nthis.Username = v.Username;
      nthis.Name = v.Name;
      nthis.Email = v.Email;
      nthis.Password = v.Password;
      nthis.Role = v.Role;
      this.payloadID = v.ID;
      this.dialog = true;
    },
    actionSearch: function () {
      this.$emit("getValueSearch", this.inputSearch);
    },
  },
};
</script>
  <style>
.combo-height {
  margin-top: 22px !important;
}
.bg-dialog {
  height: 100%;
  background-color: rgba(28, 28, 45, 0.9) !important;
}
.text-white {
  color: white;
}
.text-right {
  text-align: right;
}
.inp-search {
  background-color: #fff;
}
.space-search {
  margin-top: 170px;
}
.inp {
  text-align: center;
  padding: 8px;
  width: 300px;
  border-radius: 20px;
}
.btn-search-dialog {
  border: none;
  color: white;
  text-decoration: none;
  background-image: linear-gradient(98deg, #712bda, #a45deb);
}
.text-title {
  font-family: Roboto;
  font-size: 20px;
}
</style>