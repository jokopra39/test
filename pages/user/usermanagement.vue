<template>
  <v-row>
    <v-col cols="12">
      <v-popup-user
        ref="dialogUser"
        :isShow="dialogUser"
        :title="titlePopup"
        :is-create="isCreate"
        @eventSave="preSaveUser"
        @closeModal="closeModal()"
      >
      </v-popup-user>
      <v-row>
        <v-col>
          <v-btn
            class="mb-2"
            color="blue darken-1"
            text
            @click="actionUser('Tambah User', '')"
          >
            Tambah
          </v-btn>
        </v-col>
        <v-col class="text-right pr-2">
          <filter-dialog @resetFilter="resetFilter">
            <template #inputFilter>
            <v-text-field
              v-model="filter.username"
              hide-details
              outlined
              dense
              class="mb-3"
              placeholder="Cari berdasarkan username"
              label="Username"
            ></v-text-field>
            <v-select
              v-model="filter.role"
              :items="roleList"
              item-text="name"
              item-value="value"
              hide-details
              outlined
              dense
              class="mb-3"
              placeholder="Cari berdasarkan role"
              label="Role"
            ></v-select>
        </template>
          </filter-dialog>
        </v-col>
      </v-row>
      <c-grid
        :load-url="getApi"
        :grid-header="setHeaderGrid()"
        :set-payload="payload"
        :set-new-payload="gridRefresh"
        :set-role="setRole"
        :set-items="itemsGrid"
        :filterGrid="filterUpdate"
        :default-short="defaultShort"
        :setDatefield="listDateField"
        :setNumberfield="listNumberField"
        @getRefresh="refeshGrid"
        :event.sync="event"
      >
        <template v-slot:view_Username="{ item }">
          <div style="text-align: left">
            {{ item.Username }}
          </div>
        </template>
        <template v-slot:view_Email="{ item }">
          <div style="text-align: left">
            {{ item.Email }}
          </div>
        </template>
        <template v-slot:view_Name="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <div
                v-bind="attrs"
                v-on="on"
                class="text-truncate"
                style="text-align: left; max-width: 320px;"
              >
                {{ item.Name }}
              </div>
            </template>
            <span>{{ item.Name }}</span>
          </v-tooltip>
        </template>
        <template v-slot:view_Role="{ item }">
          <div style="text-align: left">
            {{ item.Role }}
          </div>
        </template>
        <template v-slot:view_action="{ item }">
          <div style="text-align: center">
            <v-btn icon color="blue" @click="detailUser(item)">
              <v-icon size="15">mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon color="blue" @click="deleteUser(item)">
              <v-icon size="15">mdi-delete</v-icon>
            </v-btn>
          </div>
        </template>
      </c-grid>
    </v-col>
  </v-row>
</template>
  <script>
import Grid from "@/components/grid/Grid";
import PdfContent from "@/components/pdf/PdfContent";
import ControlsContainer from "@/components/pdf/ControlsContainer";
import FilterDialog from "@/components/Filterdialog";
export default {
  name: "approver",
  components: {
    CGrid: Grid,
    PdfContent,
    ControlsContainer,
    FilterDialog,
    VPopupUser: () => import("@/components/PopupUser.vue"),
  },
  head() {
    return {
      title: "USERMANAGEMENT",
    };
  },
  mounted() {
    this.$store.commit("setLastRetrieval", 9000);
  },
  data: () => ({
    title: "USERMANAGEMENT",
    dataPdf: {},
    dialog: false,
    date: new Date(Date.now()).toISOString().substr(0, 10),
    date2: new Date(Date.now()).toISOString().substr(0, 10),
    menu: false,
    isCreate: false,
    modal: false,
    menu2: false,
    lastRetrieval: "",
    loading3: false,
    getApi: "/api/userTL/list",
    listDateField: ["TanggalLHP"],
    dialogUser: false,
    titlePopup: "",
    setRole: ["USER"],
    defaultShort: ["Username"],
    dataHistory: [
      {
        User: "OPD",
        Status: "Belum Diajukan",
        Keterangan: "Belum lengkap",
        TanggalHTL: "12-11-2021",
      },
    ],
    roleList: [
          {
            name: "ADMIN",
            value: "ADMIN",
          }, {
            name: "USER",
            value: "USER",
          }, {
            name: "PSTATUS",
            value: "PSTATUS",
          }, {
            name: "SEKERTARIS",
            value: "SEKERTARIS",
          }, {
            name: "INSPEKTUR",
            value: "INSPEKTUR",
          }
        ],
    listNumberField: [
      "anggaran",
      "belanja_operasi_lainnya",
      "belanja_persediaan",
      "belanja_modal",
      "belanja_tidak_terduga",
      "jumlah_realisasi",
      "uang_kas_tunai",
      "persentase",
    ],
    gridRefresh: [],
    event: {},
    sw: [],
    //Filters : [{Field: "Name", Operator: "$contains", Value: "jh"}]
    payload: {
      Skip: 0,
      Limit: 10,
      Orders: ["-LastUpdatedDate"],
      Filter: {
        Logic: "$and",
        Filters: [],
      },
      Keyword: "",
      KeywordFields: [],
    },
    filter: {
      username: '',
      role: ''
    },
    itemsGrid: [],
    contentRendered: false,
    progress: 0,
    generatingPdf: false,
    pdfDownloaded: false,
    controlValue: {
      showLayout: false,
      floatLayout: true,
      enableDownload: true,
      previewModal: false,
      paginateElementsByHeight: 1100,
      manualPagination: false,
      filename: "sekolah",
      pdfQuality: 2,
      pdfFormat: "a4",
      pdfOrientation: "landscape",
      pdfContentWidth: "100%",
    },
  }),
  computed: {
    htmlToPdfOptions() {
      return {
        margin: 0,
        filename: "sekolah.pdf",
        image: {
          type: "jpeg",
          quality: 0.98,
        },
        enableLinks: true,
        html2canvas: {
          useCORS: true,
        },
        jsPDF: {
          unit: "in",
          format: this.controlValue.pdfFormat,
          orientation: this.controlValue.pdfOrientation,
        },
      };
    },
    computedStartDate() {
      this.checkDatefilter();
      this.gridRefresh = [
        { Field: "tanggal", Operator: "$gte", Value: this.date },
        { Field: "tanggal", Operator: "$lte", Value: this.date2 },
      ];
      return this.formatDate(this.date);
    },
    computedEndDate() {
      this.checkDatefilter();
      this.gridRefresh = [
        { Field: "tanggal", Operator: "$gte", Value: this.date },
        { Field: "tanggal", Operator: "$lte", Value: this.date2 },
      ];
      return this.formatDate(this.date2);
    },
    filterUpdate(){
      let nf = this.filter
      let nReturn = []
      if(nf.username === '' && nf.role !== ''){
        nReturn = [
          {Field: "Role", Operator: "$contains", Value: this.filter.role}
        ]
      }else if(nf.username !== '' && nf.role === ''){
        nReturn = [
          {Field: "Username", Operator: "$contains", Value: this.filter.username}
        ]
      }else if(nf.username === '' && nf.role === ''){
        nReturn = []
      }else{
        nReturn = [
          {Field: "Username", Operator: "$contains", Value: this.filter.username},
          {Field: "Role", Operator: "$contains", Value: this.filter.role}
        ]
      }
      return nReturn
    },
  },
  watch: {},
  methods: {
    closeModal() {
      this.dialogUser = false;
    },
    detailUser: function (v) {
      this.titlePopup = "Edit User";
      this.isCreate = false;
      this.$refs.dialogUser.showModal(v);
    },
    deleteUser: async function (val) {
      const res = await this.$confirm(
        `Apakah yakin untuk menghapus user ${val.Name}?`,
        {
          title: "Confirm",
          color: "warning",
          icon: "mdi-alert",
        }
      );
      if (res) {
        this.$axios
          .delete(`api/userTL/${val.ID}`)
          .then((res) => {
            this.$store.commit("setSnackbar", {
              active: true,
              text: res.data.Message,
            });
            this.refeshGrid();
          })
          .catch((e) => {
            this.$store.commit("setSnackbar", {
              active: true,
              text: e,
            });
          })
          .finally(() => {});
      }
    },
    preSaveUser: function (v, val) {
      if (v) {
        delete val["ID"];
      }
      this.saveUser(val);
      //.log("v", v, val)
    },
    saveUser: function (val) {
      this.loading = true;
      let newPayload = val;
      this.$axios
        .post(`api/userTL/`, newPayload)
        .then((res) => {
          this.$store.commit("setSnackbar", {
            active: true,
            text: res.data.Message,
          });
          this.refeshGrid();
        })
        .catch((e) => {
          this.$store.commit("setSnackbar", {
            active: true,
            text: e,
          });
        })
        .finally(() => {
          this.loading = false;
          this.$refs.dialogUser.closeModal();
        });
    },
    setHeaderGrid(v) {
      // CreatedBy: ""
      // CreatedDate: null
      // Email: ""
      // GroupID: ""
      // ID: "1"
      // IDSekolah: ""
      // Jabatan: ""
      // LastLogin: null
      // LastUpdatedDate: "2022-01-26T06:58:20.734Z"
      // NIP: ""
      // Name: "Sekretariat Daerah"
      // Password: ""
      // Role: "USER"
      // Status: 1
      // Token: ""
      // UpdatedBy: ""
      // Username: "OPD1"
      return [
        {
          text: "",
          value: "no",
          width: "30px",
          align: "left",
          sortable: false,
        },
        {
          text: "Username",
          value: "Username",
          align: "left",
          sortable: true,
          slotName: "Username",
        },
        {
          text: "Email",
          value: "Email",
          align: "left",
          sortable: true,
          slotName: "Email",
        },
        {
          text: "Name",
          value: "Name",
          align: "left",
          sortable: false,
          slotName: "Name",
        },
        {
          text: "Role",
          value: "Role",
          width: "120px",
          align: "left",
          sortable: false,
          slotName: "Role",
        },
        {
          text: "Action",
          value: "action",
          width: "120px",
          align: "center",
          slotName: "action",
          sortable: false,
        },
      ];
    },
    checkDatefilter() {
      if (this.$moment(this.date).isAfter(this.date2, "day")) {
        this.date2 = this.date;
      }
    },
    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${month}/${day}/${year}`;
    },
    refeshGrid(data) {
      //console.log("ppp", data);
      this.gridRefresh = [1, 2, 3, 3, 4];
    },
    exportExcel() {
      let payload = this.payload;
      this.$axios.post("/api/sekolah/export", payload).then(
        (r) => {
          window.open("/download/" + r.data.Data.Filename);
          //this.$axios.get('/download/'+r.data.Data.Filename,{responseType: 'blob'})
          //this.gridItems = r.data.Data;
          //this.addNo(this.gridItems, page, itemsPerPage, r.data.Total);
        },
        (e) => {}
      );
    },
    getDataPdf() {
      this.payload.Limit = 0;
      this.payload.Skip = 0;
      this.$axios.post(this.getApi, this.payload).then(
        (r) => {
          //this.updateItems(r.data.Data);
          this.downloadPdf(r.data.Data);
        },
        (e) => {}
      );
    },
    async downloadPdf(data) {
      this.$store.commit("setPage", {
        title: this.title,
        data: data,
        filter:
          this.formatDate(this.date) + " S/D " + this.formatDate(this.date2),
      });
      this.$refs.html2Pdf.generatePdf();
    },
    onProgress(progress) {
      this.progress = progress;
    },
    domRendered() {
      this.contentRendered = true;
    },
    actionUser: function (v) {
      this.isCreate = true;
      this.dialogUser = true;
      this.titlePopup = v;
      this.$nextTick(() => {
        this.$refs.dialogUser.resetForm();
      });
    },
    resetFilter: function(){
      this.filter = {
        username : '',
        role: ''
      }
    }
  },
};
</script>
  <style>
.align-bottom {
  text-align: center;
  line-height: 67px;
}
</style>