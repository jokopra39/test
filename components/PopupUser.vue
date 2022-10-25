<template>
  <v-dialog v-model="dialog" persistent max-width="75%">
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
          <v-form ref="form" lazy-validation v-model="valid" class="pr-2 pl-2">
            <v-row>
              <v-col cols="4">
                Username
                <v-text-field
                  v-model="form.Username"
                  label=""
                  placeholder=""
                  type="text"
                  class="mb-3 input-master"
                  hide-details="auto"
                  :rules="[rulesUsername.required]"
                  :persistent-placeholder="true"
                ></v-text-field>
              </v-col>
              <v-col>
                Email
                <v-text-field
                  v-model="form.Email"
                  label=""
                  placeholder=""
                  type="text"
                  class="mb-3 input-master"
                  hide-details="auto"
                  :persistent-placeholder="true"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="4">
                Name
                <v-textarea
                  rows="1"
                  cols="50"
                  hint=""
                  v-model="form.Name"
                  label=""
                  placeholder=""
                  type="text"
                  class="mb-3 input-master"
                  hide-details="auto"
                  :rules="[rulesUsername.required]"
                  :persistent-placeholder="true"
                ></v-textarea>
                <!-- <v-text-field
                  v-model="form.Name"
                  label=""
                  placeholder=""
                  type="text"
                  class="mb-3 input-master"
                  hide-details="auto"
                  :rules="[rulesUsername.required]"
                  :persistent-placeholder="true"
                ></v-text-field> -->
              </v-col>

              <v-col cols="4">
                Password
                <v-text-field
                  v-model="form.Password"
                  label=""
                  placeholder=""
                  type="text"
                  class="mb-3 input-master"
                  :rules="isCreate ? [rulesUsername.required] : []"
                  hide-details="auto"
                  :persistent-placeholder="true"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                Role
                <v-autocomplete
                  single-line
                  v-model="form.Role"
                  :items="roleList"
                  :rules="[rulesUsername.required]"
                  label="Please select one"
                  dense
                  class="combo-height"
                  item-text="name"
                  item-value="value"
                  hide-details="auto"
                  :return-object="false"
                ></v-autocomplete>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-divider class="mt-4 mb-1"></v-divider>
        <v-card-actions class="pt-0">
          <v-col class="text-right">
            <v-btn
              color="cyan darken-3"
              class="mr-3"
              @click="closeModal()"
              outlined
            >
              Cancel
            </v-btn>
            <v-btn color="cyan darken-3" dark @click="eventSave()">
              Save
            </v-btn>
          </v-col>
        </v-card-actions>
      </v-skeleton-loader>
    </v-card>
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
    payloadID: "",
    rulesUsername: {
      required: (value) => !!value || "This field is required.",
    },
    roleList: [
      {
        name: "ADMIN",
        value: "ADMIN",
      },
      {
        name: "USER",
        value: "USER",
      },
      {
        name: "PSTATUS",
        value: "PSTATUS",
      },
      {
        name: "SEKERTARIS",
        value: "SEKERTARIS",
      },
      {
        name: "INSPEKTUR",
        value: "INSPEKTUR",
      },
    ],
    form: {
      Username: "",
      Email: "",
      Name: "",
      Password: "",
      Role: "",
    },
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
      let nthis = this.form;
      nthis.Username = "";
      nthis.Name = "";
      nthis.Email = "";
      nthis.Password = "";
      nthis.Role = null;
      this.$refs.form.reset();
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
    eventSave: function () {
      if (this.$refs.form.validate()) {
        let payload = this.form;
        if (!this.isCreate) {
          payload.ID = this.payloadID;
        }
        this.$emit("eventSave", this.isCreate, payload);
      }
    },
  },
};
</script>
<style>
.combo-height {
  margin-top: 22px !important;
}
</style>