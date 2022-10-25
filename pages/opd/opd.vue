<template>
  <v-row>
    <v-col cols="12">
      <!-- <v-row>
        <v-col cols="2">
          <v-menu
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="computedStartDate"
                label="Tanggal"
                persistent-hint
                prepend-icon="mdi-calendar"
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="date"
              no-title
              @input="menu = false"
            ></v-date-picker>
          </v-menu>
        </v-col>
        <v-col cols="1" class="align-bottom">S/D</v-col>
        <v-col cols="2">
          <v-menu
            ref="menu2"
            v-model="menu2"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="computedEndDate"
                label="Tanggal"
                persistent-hint
                prepend-icon="mdi-calendar"
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="date2"
              no-title
              @input="menu2 = false"
            ></v-date-picker>
          </v-menu>
        </v-col>
        <v-col
          cols="4"
          offset-md="3"
          offset-sm="3"
          class="pr-1 pa-4 text-right"
        >
          <client-only>
            <vue-html2pdf
              :show-layout="controlValue.showLayout"
              :float-layout="controlValue.floatLayout"
              :enable-download="controlValue.enableDownload"
              :preview-modal="controlValue.previewModal"
              :filename="controlValue.filename"
              :paginate-elements-by-height="
                controlValue.paginateElementsByHeight
              "
              :pdf-quality="controlValue.pdfQuality"
              :pdf-format="controlValue.pdfFormat"
              :pdf-orientation="controlValue.pdfOrientation"
              :pdf-content-width="controlValue.pdfContentWidth"
              :manual-pagination="controlValue.manualPagination"
              :html-to-pdf-options="htmlToPdfOptions"
              @progress="onProgress($event)"
              ref="html2Pdf"
            >
              <pdf-content @domRendered="domRendered()" slot="pdf-content" />
            </vue-html2pdf>
            <controls-container
              :progress="progress"
              @generateReport="getDataPdf()"
              :data-pdf="dataPdf"
            />
          </client-only>
          <v-btn
            :loading="loading3"
            :disabled="loading3"
            color="blue-grey"
            class="ma-2 white--text"
            @click="exportExcel"
            min-width="120px"
          >
            EXCEL
            <v-icon right dark> mdi-file-excel </v-icon>
          </v-btn>
        </v-col>
      </v-row> -->
      <c-grid
        :load-url="getApi"
        :grid-header="header"
        :set-payload="payload"
        :set-new-payload="gridRefresh"
        :set-items="itemsGrid"
        :set-role="setRole"
        :setDatefield="listDateField"
        :setNumberfield="listNumberField"
        @getItems="updateItems"
        @getRefresh="refeshGrid"
        :event.sync="event"
      >
        <template v-slot:view_file="{ item }">
          <div style="text-align: center; cursor:pointer;"  
            @click="download(item.UploadedLHAName)">
           <v-icon v-if="item.UploadedLHAName" size="18px">mdi-download-box</v-icon> 
           <a v-bind:href="LHPUrl(item.UploadedLHAName)" download>{{item.UploadedLHAName}}</a>
          </div>
        </template>
        <template v-slot:view_action="{ item }">
          <div style="text-align: center">
            <v-btn
              v-if="item.Status > 0"
              class=""
              icon
              color="blue"
              @click="detailItem(item)"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn v-else disabled icon color="blue">
              <v-icon>mdi-pencil</v-icon>
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
export default {
  name: "opd",
  components: {
    CGrid: Grid,
    PdfContent,
    ControlsContainer,
  },
  head() {
    return {
      title: "OPd",
    };
  },
  mounted() {
    this.$store.commit("setLastRetrieval", 9000);
    // var ref = this;
    // this.$axios.get("/api/skpd/retrievaldata").then(function(response){
    //   console.log(response.data)
    //   ref.lastRetrieval = response.data.Data.date
    // })
  },
  data: () => ({
    title: "OPD",
    dataPdf: {},
    setRole: ["ADMIN", "PSTATUS", "SEKERTARIS"],
    date: new Date(Date.now()).toISOString().substr(0, 10),
    date2: new Date(Date.now()).toISOString().substr(0, 10),
    menu: false,
    modal: false,
    menu2: false,
    lastRetrieval: "",
    loading3: false,
    getApi: "/api/tindaklanjut/list",
    listDateField: ["TanggalLHP"],
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
    // CreatedBy: "5eed4dcfe6792432f00db410"
    // CreatedDate: "2021-10-21T02:45:31.424Z"
    // ID: "6170d44b846bdc2ba8d61e34"
    // Jabatan: "KT"
    // Jenis: 1
    // LastUpdatedDate: "2021-10-27T04:06:14.689Z"
    // NoLHP: "700-1-ITDA.01"
    // Requestor: "KetuaTim"
    // RptId: "616d2cadebc274b89bdc0514"
    // RuangLingkup: "cek rpt ke dua"
    // Status: 1
    // TanggalLHP: "2021-10-27"
    // Temuan: [{ID: "617123466432ec2747cf846e", TindakLanjutID: "6170d44b846bdc2ba8d61e34",…},…]
    // Tujuan: "untuk percobaan ke dua"
    // UpdatedBy: "5eed4dcfe6792432f00db410"
    // UploadedLHABase64: ""
    // UploadedLHAName: "20211021_130523.docx"
    // UserId: "6170e48cbf3ce0e79b44ec68"
    // UserOPDId: "6172d0485494023bef2b3355"
    header: [
      {
        text: "",
        value: "no",
        width: "70px",
        align: "center",
        sortable: false,
      },
      {
        text: "No LHP",
        value: "NoLHP",
        width: "255px",
        align: "center",
        sortable: false,
      },
      {
        text: "Tgl. LHP",
        value: "TanggalLHP",
        width: "136px",
        align: "center",
        sortable: false,
      },
      {
        text: "Temuan",
        value: "Temuan",
        width: "210px",
        align: "center",
        sortable: false,
      },
      {
        text: "Sesuai",
        value: "Sesuai",
        width: "200px",
        align: "center",
        sortable: false,
        class: "success black--text",
      },
      {
        text: "Belum Sesuai",
        value: "BlmSesuai",
        width: "200px",
        align: "center",
        sortable: false,
        class: "red black--text",
      },
      {
        text: "Belum Ditindaklanjuti",
        value: "BlmDitindakLanjuti",
        width: "200px",
        align: "center",
        sortable: false,
        class: "yellow black--text",
      },
      {
        text: "Tidak Dapat Ditindaklanjuti",
        value: "TdDitindakLanjuti",
        width: "200px",
        align: "center",
        sortable: false,
        class: "grey black--text",
      },
      {
        text: "Diproses",
        value: "Diproses",
        width: "200px",
        align: "center",
        sortable: false,
      },
      {
        text: "File",
        value: "file",
        width: "240px",
        align: "center",
        slotName: "file",
        sortable: false,
      },
      {
        text: "Action",
        value: "action",
        width: "200px",
        align: "center",
        slotName: "action",
        sortable: false,
      },
    ],
    payload: {
      Skip: 0,
      Limit: 10,
      Orders: ["-CreatedDate"],
      Filter: {
        Logic: "$and",
        Filters: [
          // {
          //   Field: "tanggal",
          //   Operator: "$gte",
          //   Value: new Date(Date.now()).toISOString().substr(0, 10),
          // },
          // {
          //   Field: "tanggal",
          //   Operator: "$lte",
          //   Value: new Date(Date.now()).toISOString().substr(0, 10),
          // },
        ],
      },
      Keyword: "",
      KeywordFields: [],
    },
    // mainHeader: [
    //   { text: "NO", colspan: 1, border: true, rowspan: false },
    //   { text: "NAMA SEKOLAH", colspan: 1, border: true, rowspan: true },
    //   { text: "ANGGARAN", colspan: 1, border: true, rowspan: true },
    //   { text: "REALISASI", colspan: 6, border: false },
    //   { text: "UANG KAS TUNAI", colspan: 2, border: true, rowspan: true },
    // ],
    // topHeader: [
    //   { text: "", colspan: 1, border: true },
    //   { text: "SIPKD", colspan: 12, border: false },
    // ],
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
  },
  watch: {},
  methods: {
    async detailItem(item) {
      let url = this.$route.path;
      let urlFirst = url.split("/");
      this.$router.push(`/${urlFirst[1]}/${item.ID}`);
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
    updateItems(data) {
      let addStatus = [];
      function myFunction(item, index) {
        let opr =
          (item.belanja_modal / item.total_uang_kas == 0
            ? 1
            : item.total_uang_kas) * 100;
        if (item.uang_kas_tunai > 10000000 && opr >= 97) {
          item.status = "A";
          item.tindakan = "OK";
        } else if (
          item.uang_kas_tunai >= 10000000 &&
          item.uang_kas_tunai < 50000000 &&
          opr >= 97
        ) {
          item.status = "B";
          item.tindakan = "Monitoring kas";
        } else if (item.uang_kas_tunai > 50000000 && opr >= 97) {
          item.status = "C";
          item.tindakan = "Pemeriksaan keputusan kas";
        } else if (item.uang_kas_tunai <= 10000000 && opr < 97) {
          item.status = "D";
          item.tindakan = "Monitoring aset dan persediaan";
        } else if (
          item.uang_kas_tunai <= 10000000 &&
          item.uang_kas_tunai <= 50000000 &&
          opr < 97
        ) {
          item.status = "E";
          item.tindakan = "Monitoring kas, aset dan persediaan";
        } else if (item.uang_kas_tunai > 50000000 && opr >= 85 && opr < 97) {
          item.status = "F";
          item.tindakan = "Pemeriksaan kepatuhan kas, aset dan persediaan";
        } else if (item.uang_kas_tunai <= 10000000 && opr < 85) {
          item.status = "G";
          item.tindakan = "Pemeriksaan kepatuhan aset dan persediaan";
        } else if (
          item.uang_kas_tunai >= 10000000 &&
          item.uang_kas_tunai <= 50000000 &&
          opr < 85
        ) {
          item.status = "H";
          item.tindakan = "Pemeriksaan kepatuhan kas, aset dan persediaan";
        } else if (item.uang_kas_tunai > 50000000 && opr < 85) {
          item.status = "I";
          item.tindakan = "Pemeriksaan kepatuhan kas, aset dan persediaan";
        } else {
          item.status = opr;
        }
        addStatus.push(item);
      }
      data.forEach(myFunction);
      this.itemsGrid = addStatus;
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
    getDataPdf(data) {
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
    LHPUrl(filename){
      return process.env.baseUrl+"download_tindaklanjut/"+filename
    },
    download(v) {
      let link = document.createElement("a");
      let url = process.env.baseUrl;
      link.href = `${url}download_tindaklanjut/${v}`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
  },
};
</script>
<style>
.align-bottom {
  text-align: center;
  line-height: 67px;
}
</style>