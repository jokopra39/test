<template>
  <div>
    <v-row dense>
      <!-- datail Files-->
      <v-popup-grid
        :isShow="isShow"
        :items="items"
        :isLoading="sekeleton"
        :headers="headersFiles"
        title="History"
        @closeModal="closeModal()"
      >
        <template v-slot:view_no="{ index }">
          {{ index + 1 }}
        </template>
        <template v-slot:view_Filename="{ item }">
          <div v-if="item.Filename == ''" style="text-align: center">-</div>
          <div v-else style="cursor: pointer" @click="download(item.Filename)">
            <v-icon>mdi-download-box</v-icon> {{ item.Filename }}
          </div>
        </template>

        <template v-slot:view_TanggalHTL="{ item }">
          {{ $moment(item.TanggalHTL, "YYYY-MM-DD").format("DD-MMM-YYYY") }}
        </template>
        <template v-slot:view_CreatedBy="{ item }">
          {{ historyStatus(item.IsReview, item.IsReject) }}
          {{ filterUser(item.CreatedBy) }}
        </template>
      </v-popup-grid>
      <v-col cols="12">
        <v-card>
          <v-card-text class="card-text-history">
            <v-skeleton-loader
              :loading="revisi.loading"
              type="list-item-two-line"
            >
              <v-col cols="12">
                <v-skeleton-loader :loading="loading" type="table">
                  <un-grid :items="Temuan" :headers="temuanTindakLanjut">
                    <template v-slot:view_no="{ index }">
                      {{ index + 1 }}
                    </template>
                    <template v-slot:view_jumlahFile="{ item }">
                      {{ item.Files != null ? item.Files.length : 0 }}
                    </template>
                    <template v-slot:view_StatusPhase="{ item }">
                      <!-- <span v-if="item.StatusPhase < 6"> -->
                      <span>
                        {{
                          statusStringPhase(
                            item.StatusTemuan,
                            item.StatusPhase,
                            item.VerifikatorId
                          )
                        }}
                      </span>
                      <!-- <v-chip
                        v-else
                        :color="item.StatusPhase == 6 ? 'orange' : 'green'"
                      >
                        {{
                          statusStringPhase(
                            item.StatusTemuan,
                            item.StatusPhase,
                            item.VerifikatorId
                          )
                        }}
                      </v-chip> -->
                    </template>
                    <template v-slot:view_StatusTemuan="{ item }">
                      <span>
                        {{ statusStringTemuan(item.StatusTemuan) }}
                      </span>
                    </template>
                    <template v-slot:view_history="{ item }">
                      <div style="text-align: center">
                        <v-btn
                          class=""
                          icon
                          color="blue"
                          @click="detailHistory(item)"
                        >
                          <v-icon>mdi-history</v-icon>
                        </v-btn>
                      </div>
                    </template>
                    <template v-slot:view_action="{ item }">
                      <v-btn
                        :disabled="cekStatus(item.StatusPhase)"
                        x-small
                        class="teal--text"
                        @click="detailTemuan(item)"
                      >
                        <v-icon small>mdi-pencil</v-icon>
                      </v-btn>
                    </template>
                  </un-grid>
                </v-skeleton-loader>
              </v-col>
            </v-skeleton-loader>
          </v-card-text>
        </v-card>
      </v-col>
      <!-- dialog -->
      <v-row justify="center">
        <v-dialog v-model="dialog" persistent max-width="600px">
          <v-card>
            <v-card-title>
              <span class="text-h5">Revisi</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="3" style="margin: 19px 0px 0px 0px"
                    >Keterangan
                  </v-col>
                  <v-col cols="9">
                    <v-textarea
                      name="input-7-1"
                      value=""
                      rows="2"
                      v-model="keterangan"
                    ></v-textarea>
                  </v-col>
                  <v-col
                    v-if="$cookie.get('userRole') == 'PSTATUS'"
                    cols="3"
                    style="margin: 13px 0px 0px 0px"
                  >
                    Status
                  </v-col>
                  <v-col v-if="$cookie.get('userRole') == 'PSTATUS'" cols="9">
                    <v-select
                      v-model="statusTemuan"
                      :items="opdData"
                      item-text="text"
                      item-value="value"
                      :change="changeStatus()"
                      dense
                    >
                    </v-select>
                  </v-col>
                </v-row>
              </v-container>
              <!-- <small>*indicates required field</small> -->
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="dialog = false" :disabled="disableBtn">
                Tutup
              </v-btn>
              <template v-if="!hideBtnApprove">
                <v-btn
                  color="blue darken-1"
                  text
                  @click="approveTemuan('approve')"
                  :disabled="disableBtn"
                >
                  Approve
                </v-btn>
              </template>
              <template v-if="!hideBtnReject">
                <v-btn
                  color="blue darken-1"
                  text
                  @click="approveTemuan('reject')"
                  :disabled="disableBtn"
                >
                  Reject
                </v-btn>
              </template>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </v-row>
  </div>
</template>

<script>
import Grid from "@/components/table/Ungrid";
export default {
  components: {
    unGrid: Grid,
    VPopupGrid: () => import("@/components/PopupGrid.vue"),
  },
  data: () => ({
    saving: false,
    hideBtnApprove: false,
    hideBtnReject: false,
    dialog: false,
    sekeleton: false,
    idTemuan: "",
    savingandsubmit: false,
    loading: false,
    isEdit: false,
    header: {},
    statusTemuan: "",
    inputanNo: "",
    inputan: "",
    fileDownload: "Belum upload file",
    uploadLHA: null,
    uploadLHAFilename: "",
    payload: {},
    items: [],
    tglLhp: false,
    payload: {},
    keterangan: "",
    opdData: [
      { text: "Sesuai", value: 2 },
      { text: "Belum Sesuai", value: 3 },
      { text: "Tidak Dapat Ditindaklanjuti", value: 4 },
    ],
    userData: [
      { text: "test", value: "satu" },
      { text: "test2", value: "satu2" },
    ],
    date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    temuanTindakLanjut: [
      // {
      //   text: "No",
      //   value: "no",
      //   width: "20px",
      //   align: "center",
      //   sortable: false,
      //   slotNo: "no",
      // },
      // {
      //   text: "Temuan",
      //   width: "10%",
      //   align: "center",
      // },
      // {
      //   text: "Nilai",
      //   width: "10%",
      //   align: "center",
      // },
      // {
      //   text: "Rekomendasi",
      //   width: "10%",
      //   align: "center",
      // },
      // {
      //   text: "Nilai",
      //   width: "10%",
      //   align: "center",
      // },
      // {
      //   text: "Status",
      //   width: "10%",
      //   align: "center",
      // },
      // {
      //   text: "Jumlah File",
      //   width: "10%",
      //   align: "center",
      // },
      // {
      //   text: "History",
      //   value: "history",
      //   width: "120px",
      //   align: "center",
      //   sortable: false,
      //   slotName: "history",
      // },
      // {
      //   text: "Keterangan",
      //   width: "10%",
      //   align: "center",
      // },
      // {
      //   text: "Action",
      //   width: "5%",
      //   align: "center",
      // },
      {
        text: "No",
        value: "no",
        width: "20px",
        align: "center",
        sortable: false,
        slotNo: "no",
      },
      {
        value: "KeteranganTemuan",
        width: "150px",
        text: "Temuan",
        align: "center",
      },
      {
        value: "NilaiTemuan",
        width: "150px",
        text: "Nilai",
        align: "center",
      },
      {
        value: "KeteranganRekomendasi",
        width: "150px",
        text: "Rekomendasi",
        align: "center",
      },
      {
        value: "NilaiRekomendasi",
        width: "150px",
        text: "Nilai",
        align: "center",
      },
      {
        value: "StatusPhase",
        width: "150px",
        text: "Tahapan Approval",
        align: "center",
        slotName: "StatusPhase",
      },
      {
        value: "StatusTemuan",
        width: "150px",
        text: "Status",
        align: "center",
        slotName: "StatusTemuan",
      },
      {
        value: "jumlahFile",
        width: "150px",
        text: "Jumlah File",
        align: "center",
        slotName: "jumlahFile",
      },
      {
        text: "History",
        value: "history",
        width: "120px",
        align: "center",
        sortable: false,
        slotName: "history",
      },
      {
        value: "action",
        width: "100px",
        text: "Action",
        align: "center",
        slotName: "action",
      },
    ],
    // kertaskerja: {
    //   ID: "",
    //   Filename: "",
    //   KertasKerjaId: "",
    //   UploadedKPBase64: "",
    // },
    Temuan: [
      {
        CreatedDate: null,
        ID: "",
        KeteranganRekomendasi: "",
        KeteranganTemuan: "",
        LastUpdatedDate: "",
        NilaiRekomendasi: "",
        NilaiTemuan: "",
        StatusTemuan: 0,
        TindakLanjutID: "",
        UpdatedBy: "",
        Files: [],
      },
    ],
    //     CreatedBy: (...)
    // CreatedDate: (...)
    // Files: Array(1)
    // ID: (...)
    // KeteranganRekomendasi: (...)
    // KeteranganTemuan: (...)
    // LastUpdatedDate: (...)
    // NilaiRekomendasi: (...)
    // NilaiTemuan: (...)
    // StatusPhase: (...)
    // StatusTemuan: (...)
    // TindakLanjutID: (...)
    // UpdatedBy: (...)
    // VerifikatorId: (.
    headersFiles: [
      {
        text: "No",
        value: "no",
        width: "5%",
        sortable: false,
        slotNo: "no",
      },
      {
        value: "Filename",
        text: "Upload File",
        width: "20%",
        sortable: false,
        slotName: "Filename",
      },
      {
        value: "Keterangan",
        text: "Keterangan",
        sortable: false,
        width: "20%",
      },
      {
        value: "TanggalHTL",
        text: "Tanggal",
        width: "10%",
        sortable: false,
        slotName: "TanggalHTL",
      },
      {
        value: "CreatedBy",
        text: "",
        width: "20%",
        sortable: false,
        slotName: "CreatedBy",
      },
    ],
    isShow: false,
    revisi: {
      items: [{ align: "right" }, { align: "left" }],
      loading: false,
    },
    
    disableBtn: false,
  }),
  head() {
    return {
      title: "OPD:ID",
    };
  },
  computed: {
    iSReadOnly() {
      return false;
    },
    computedDateFormatted() {
      return this.formatDate(this.date);
    },
  },
  methods: {
    changeStatus() {
      let status = this.statusTemuan == "" ? 0 : this.statusTemuan;
      if (this.$cookie.get("userRole") == "ADMIN") {
        this.hideBtnApprove = false;
        this.hideBtnReject = false;
      } else if (this.$cookie.get("userRole") == "PSTATUS") {
        switch (status) {
          case 0:
            this.hideBtnApprove = true;
            this.hideBtnReject = true;
            break;
          case 2:
            this.hideBtnApprove = false;
            this.hideBtnReject = true;
            break;
          case 3:
            this.hideBtnApprove = true;
            this.hideBtnReject = false;
            break;
          case 4:
            this.hideBtnApprove = false;
            this.hideBtnReject = true;
        }
      } else if (this.$cookie.get("userRole") == "INSPEKTUR") {
        this.hideBtnApprove = false;
        this.hideBtnReject = false;
      } else {
        this.hideBtnApprove = false;
        this.hideBtnReject = true;
      }
    },
    historyStatus(IsReview, IsReject) {
      let statusText = "";
      if (!IsReview) {
        statusText = "uploaded by ";
      } else {
        statusText = IsReject ? "rejected by " : "approved by ";
      }

      return statusText;
    },
    cekStatus(statusPhase) {
      let activeButton = "";
      switch (parseInt(statusPhase)) {
        case 3:
          activeButton = "ADMIN";
          break;
        case 4:
          activeButton = "PSTATUS";
          break;
        case 5:
          activeButton = "SEKERTARIS";
          break;
        case 6:
          activeButton = "INSPEKTUR";
          break;

        default:
          activeButton = "";
          break;
      }
      // console.log('tes netes', activeButton, this.$cookie.get('userRole'))
      if (activeButton != this.$cookie.get("userRole")) {
        return true;
      }

      return false;
    },
    statusStringTemuan(StatusTemuan) {
      let statusTemuan = parseInt(StatusTemuan);
      let statusString = "";
      
      switch (statusTemuan) {
        case 2:
          statusString = "Sesuai"
          break;
        case 4:
          statusString = "Tidak Dapat Ditindaklanjuti"
          break;
      
        default:
          statusString = "-";
          break;
      }

      return statusString;
    },
    statusStringPhase(StatusTemuan, StatusPhase, VerifikatorId) {
      let statusTemuan = parseInt(StatusTemuan);
      let statusPhase = parseInt(StatusPhase);
      let statusString = "";
      if (statusTemuan == 0) {
        statusString = "Draft";
      } else if (statusTemuan >= 1 && statusTemuan < 7) {
        switch (statusPhase) {
          case 3:
            statusString = "Review " + this.filterUser(VerifikatorId);
            break;
          case 4:
            statusString = "Review Pengubah Status";
            break;
          case 5:
            statusString = "Review Sekretaris";
            // statusString =
            //   statusTemuan == 2
            //     ? "Sesuai"
            //     : statusTemuan == 3
            //     ? "Belum Sesuai"
            //     : "Tidak Dapat Ditindaklanjuti";
            break;
          case 6:
            statusString = "Review Inspektur";
            // statusString =
            //   statusTemuan == 2
            //     ? "Sesuai"
            //     : statusTemuan == 3
            //     ? "Belum Sesuai"
            //     : "Tidak Dapat Ditindaklanjuti";
            break;
          case 7:
            statusString = "Selesai";
            // statusString =
            //   statusTemuan == 2
            //     ? "Sesuai"
            //     : statusTemuan == 3
            //     ? "Belum Sesuai"
            //     : "Tidak Dapat Ditindaklanjuti";
            break;
          default:
            statusString = "";
        }
      } else {
        statusString = "Rejected";
      }
      return statusString;
    },
    filterUser(idUser) {
      let newUser = this.userData.filter(function (el) {
        return el.ID != undefined ? el.ID.includes(idUser) : "";
      });
      return newUser.length > 0 ? newUser[0].Name : "";
    },
    // /temuan/approve/{id}

    // 	var correctAppRole string
    // 	if temuan.StatusPhase == 1 {
    // 		correctAppRole = "ADMIN"
    // 	}
    // 	if temuan.StatusPhase == 2 {
    // 		correctAppRole = "PSTATUS"
    // 	}
    // 	if temuan.StatusPhase == 3 {
    // 		correctAppRole = "SEKERTARIS"
    // 	}
    // 	if temuan.StatusPhase == 4 {
    // 		correctAppRole = "INSPEKTUR"
    // 	}

    //   	StatusTemuanDraft    = StatusTemuan(0) // status temuan masih draft
    // StatusTemuanDiajukan = StatusTemuan(1) // status temuan sudah diajukan oleh KT di simwas
    // StatusTemuanSesuai   = StatusTemuan(2) // pakai status ini jika sudah sesuai

    // StatusTemuanBelumSesuai       = StatusTemuan(3) // pakai status ini jika belum sesuai
    // StatusTemuanBelumTindakLanjut = StatusTemuan(4) // pakai status ini jika belum ditindaklanjuti
    // StatusTemuanTidakTindakLanjut = StatusTemuan(5) // pakai status ini jika tidak dapat ditindaklanjuti

    // StatusTemuanReject = StatusTemuan(6) // pakai status ini jika Reject

    // StatusPhaseOPD         = StatusTemuan(0) // temuan masih di review OPD
    // StatusPhaseVerifikator = StatusTemuan(1) // diajukan ke verifikator untuk di approve
    // StatusPhasePstatus     = StatusTemuan(2) // diajukan ke pengubah status untuk update status : "sesuai" || "belum sesuai" || "tidak dapat ditindak lanjuti" (status temuan)
    // StatusPhaseSekertaris  = StatusTemuan(3) // diajukan ke sekertaris
    // StatusPhaseInspektur   = StatusTemuan(4) // diajukan ke inspektur
    // StatusPhaseSelesai     = StatusTemuan(5) // temuan selesai
    download(v) {
      let link = document.createElement("a");
      let url = process.env.baseUrl;
      link.href = `${url}download/temuan/${v}`;
      link.click();
    },
    detailHistory(item) {
      this.sekeleton = true;
      //console.log("item3", item);
      this.isShow = true;
      let newPayload = { IsReview: true };
      this.$axios
        .post(`api/tindaklanjut/historylist/${item.ID}`, newPayload)
        .then((res) => {
          this.items = res.data.Data;
          this.sekeleton = false;
        })
        .catch((e) => {
          this.$store.commit("setSnackbar", {
            active: true,
            text: e,
          });
        })
        .finally(() => {});
    },
    async approveTemuan(set) {
      this.disableBtn = true;
      let newPayload = {
        IsReject: set == "approve" ? false : true,
        Keterangan: this.keterangan,
        StatusTemuan:
          this.statusTemuan == ""
            ? null
            : set != "approve"
            ? null
            : this.statusTemuan,
      };
      if (
        this.$cookie.get("userRole") == "PSTATUS" &&
        this.statusTemuan == ""
      ) {
        await this.$confirm(`Status harus dipilih!`, {
          title: "Warning",
          color: "red",
          icon: "mdi-alert",
          buttonTrueText: null,
          buttonFalseText: "Kembali",
        });
        this.disableBtn = false;
      } else {
        let res = await this.$confirm(
          `Apakah anda yakin untuk ${set} temuan?`,
          {
            title: "Confirm",
            color: "warning",
            icon: "mdi-alert",
          }
        );
        if (res) {
          //console.log(res);
          this.$axios
            .post(
              `api/tindaklanjut/temuan/approve/${this.idTemuan}`,
              newPayload
            )
            .then((res) => {
              this.$store.commit("setSnackbar", {
                active: true,
                text: res.data.Message,
              });
              this.loadData();
              this.dialog = false;
              this.disableBtn = false;
            })
            .catch((e) => {
              this.$store.commit("setSnackbar", {
                active: true,
                text: e,
              });
              this.disableBtn = false;
            })
            .finally(() => {});
        } else {
          this.disableBtn = false;
        }
      }
    },
    closeModal() {
      this.isShow = false;
    },
    async showFiles(data) {
      //console.log("data_popup", data);
      this.items = data;
      this.isShow = true;
    },

    detailTemuan(val) {
      this.keterangan = "";
      this.dialog = true;
      this.disableBtn = false;
      this.idTemuan = val.ID;
      this.changeStatus();
      //console.log("as", val);
    },
    setSave(param) {
      this.$axios
        .post(`/tindaklanjut`, param)
        .then((res) => {
          this.$dialog.notify.success(res.data.Message, {
            ...this.app.notification,
          });
          this.$router.push("/tindaklanjut");
        })
        .catch((error) => {
          this.$dialog.notify.error(error, {
            ...this.app.notification,
          });
        })
        .finally(() => {
          this.saving = false;
          this.savingandsubmit = false;
        });
    },
    reset() {
      this.$refs.form.reset();
    },
    initTemuan() {
      return {
        //CreatedDate: this.date,
        ID: "",
        KeteranganRekomendasi: "",
        KeteranganTemuan: "",
        //LastUpdatedDate: "",
        NilaiRekomendasi: "",
        NilaiTemuan: "",
        StatusTemuan: 0,
        TindakLanjutID: "",
        UpdatedBy: "",
        Files: [],
      };
    },
    addTemuan() {
      this.Temuan.push(this.initTemuan());
    },
    deleteTemuan(id) {
      this.$axios
        .delete("/tindaklanjut/temuan/" + id)
        .then((res) => {
          this.$dialog.notify.success(res.data + "Data berhasil di hapus", {
            ...this.app.notification,
          });
        })
        .catch((error) => {
          this.$dialog.notify.error(error, {
            ...this.app.notification,
          });
        });
    },
    async removeTemuan(index) {
      let id = this.Temuan[index].ID;
      if (id != "") {
        const confirmation = await this.$dialog.confirm({
          text: "Apakah anda yakin menghapus data?",
        });
        if (!confirmation) return;
        this.deleteTemuan(id);
      }

      this.Temuan.splice(index, 1);
    },
    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${day}-${month}-${year}`;
    },
    getBase64(file) {
      if (file != "") {
        var vm = this;
        return new Promise((resolve, reject) => {
          //console.log("lp", file);
          vm.uploadLHAFilename = file.name;
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () =>
            resolve(reader.result.substr(reader.result.indexOf(",") + 1));
          reader.onerror = (error) => reject(error);
        });
      }
    },
    async getDataUser() {
      let param = {
        Orders: ["Name"],
        Filter: {
          Logic: "$and",
          Filters: [
            {
              Field: "Role",
              Operator: "$in",
              Value: ["USER", "ADMIN", "PSTATUS", "SEKERTARIS", "INSPEKTUR"],
            },
          ],
        },
      };

      this.$axios.post(`api/userTL/list`, param).then((res) => {
        this.userData = res.data.Data;
      });
    },
    loadData() {
      let id = this.$route.params.id;
      this.$axios
        .get(`api/tindaklanjut/temuan/myapproval/${id}`)
        .then((res) => {
          let dataTemuan = res.data.Data;
          this.Temuan = dataTemuan;
        });
    },
  },
  created() {
    let url = this.$route.params.id;
    //console.log("id-app", url);
    this.getDataUser();
  },
  async mounted() {
    this.loadData();
  },
  watch: {
    date() {
      this.dateFormatted = this.formatDate(this.date);
    },
  },
};
</script>

<style lang="scss" scoped>
.card-text-history {
  max-height: 486px;
  overflow: auto;
}
</style>

 
  