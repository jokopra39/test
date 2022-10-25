<template>
  <div>
    <v-row dense>
      <v-col cols="12">
        <v-popup-grid
          :isShow="dialogHistory"
          :items="dataHistory"
          :headers="headersHistory"
          :isLoading="sekeleton"
          title="Files"
          @closeModal="closeModal()"
        >
          <template v-slot:view_no="{ index }">
            {{ index + 1 }}
          </template>
          <template v-slot:view_Filename="{ item }">
            <div v-if="item.Filename == ''" style="text-align: center">-</div>
            <!-- <div
              v-else
              style="cursor: pointer"
              @click="download(item.Filename)"
            >
              <v-icon>mdi-download-box</v-icon> {{ item.Filename }}
            </div> -->
            <v-icon>mdi-download-box</v-icon>
            <a v-bind:href="LHPUrl(item.Filename)" download>{{item.Filename}}</a>
          </template>
        </v-popup-grid>
        <v-card>
          <v-card-text class="card-text-history">
            <v-skeleton-loader
              :loading="revisi.loading"
              type="list-item-two-line"
            >
              <!-- <v-col cols="12">
                  <v-row>
                    <v-col cols="2" style="margin-top: auto">
                      Nomor LHP : <span style="float: right">700 /</span>
                    </v-col>
                    <v-col cols="2">
                     
                        <v-text-field
                      
                          v-model="inputan"
                          hide-details="auto"
                          dense
                          required
                          :readonly="iSReadOnly"
                        ></v-text-field>
                     
                    </v-col>
                    <v-col cols="1" style="margin-top: auto"> /ITDA. </v-col>
                    <v-col cols="2">
                      
                        <v-text-field
                         
                          v-model="inputanNo"
                          hide-details="auto"
                          dense
                          required
                          :readonly="iSReadOnly"
                        ></v-text-field>
                     
                    </v-col>
                    <v-col
                      cols="5"
                      style="margin: 7px 0px 0px 0px; text-align: right"
                    >
                      <v-icon aria-hidden="false">
                        mdi-download-box-outline
                      </v-icon>
                      <span style="cursor: pointer" @click="download">{{
                        fileDownload
                      }}</span>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="2" style="margin: 13px 0px 0px 0px">
                      Tanggal LHP
                    </v-col>
                    <v-col cols="2">
                      <v-menu
                        v-model="tglLhp"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            style="padding: 0; margin-top: 0px"
                            v-model="computedDateFormatted"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="date"
                          @input="tglLhp = false"
                        ></v-date-picker>
                      </v-menu>
                    </v-col>
                    <v-col cols="1" style="margin: 13px 0px 0px 0px">
                      OPD
                    </v-col>
                    <v-col cols="2">
                      <v-select
                        v-model="opd"
                        :items="opdData"
                        item-text="Name"
                        item-value="ID"
                        dense
                      >
                      </v-select>
                    </v-col>
                    <v-col
                      cols="2"
                      style="margin: 13px 0px 0px 0px; text-align: right"
                    >
                      Upload LHA
                    </v-col>
                    <v-col cols="3">
                      <v-file-input
                        style="padding: 0; margin-top: 2px"
                        v-model="uploadLHA"
                        placeholder="Upload your documents"
                        label="File input"
                        accept=".doc,.docx,.pdf"
                        prepend-icon="mdi-paperclip"
                      >
                        <template v-slot:selection="{ text }">
                          <v-chip small label color="primary">
                            {{ text }}
                          </v-chip>
                        </template>
                      </v-file-input>
                    </v-col>
                  </v-row>
                </v-col> -->
              <v-col cols="12">
                <un-grid :items="Temuan" :headers="temuanTindakLanjut">
                  <template v-slot:view_no="{ index }">
                    {{ index + 1 }}
                  </template>
                  <template v-slot:view_jumlahFile="{ item }">
                    <v-chip
                      class="ma-2"
                      color="primary"
                      style="cursor: pointer"
                      @click="detailFile(item)"
                    >
                      {{ item.Files != null ? item.Files.length : 0 }}
                    </v-chip>
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
                  <template v-slot:view_action="{ item, col, index }">
                    <v-btn
                      disable
                      v-if="$cookie.get('userRole') == 'INSPEKTUR'"
                      x-small
                      class="teal--text"
                    >
                      <v-icon small>mdi-cancel</v-icon>
                    </v-btn>
                    <div v-else>
                      <v-btn
                        :disabled="
                          item.StatusTemuan > 0 && item.StatusTemuan < 7
                        "
                        x-small
                        class="teal--text"
                        @click="detailTemuan(item, col, index)"
                      >
                        <v-icon small>mdi-pencil</v-icon>
                      </v-btn>
                      <!-- <v-btn
                        v-if="item.StatusTemuan == 0"
                        :disabled="
                          item.StatusTemuan > 0 && item.StatusTemuan < 7
                        "
                        x-small
                        class="teal--text"
                        @click="deleteDetailTemuan(item, col, index)"
                      >
                        <v-icon small>mdi-delete</v-icon>
                      </v-btn> -->
                    </div>
                  </template>
                </un-grid>
                <!-- <v-simple-table dense>
                        <template v-slot:default>
                          <thead>
                            <tr>
                              <th
                                v-for="(header, index) in temuanTindakLanjut"
                                :key="header.text + index"
                                :width="header.width"
                                :class="
                                  header.align == 'center' ? 'text-center' : ''
                                "
                              >
                                {{ header.text }}
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="(item, index) in Temuan" :key="index">
                              <td>
                                {{ index + 1 }}
                              </td>
                              <td>
                                {{ Temuan[index].KeteranganTemuan }}
                              </td>
                              <td>
                                {{ Temuan[index].NilaiTemuan }}
                              </td>
                              <td>
                                {{ Temuan[index].KeteranganRekomendasi }}
                              </td>
                              <td class="text-center">
                                {{ Temuan[index].NilaiRekomendasi }}
                              </td>
                              <td class="text-center">
                                {{ Temuan[index].StatusTemuan }}
                              </td>
                              <td class="text-center"></td>
                              <td class="text-center">
                                <v-btn
                                  x-small
                                  class="teal--text"
                                  @click="detailTemuan(Temuan[index])"
                                >
                                  <v-icon small>mdi-pencil</v-icon>
                                </v-btn>
                              </td>
                            </tr>
                          </tbody>
                        </template>
                      </v-simple-table> -->
              </v-col>
            </v-skeleton-loader>
          </v-card-text>
        </v-card>
      </v-col>
      <!-- dialog -->
      <v-row justify="center">
        <v-dialog v-model="dialog" persistent max-width="800px">
          <v-card>
            <v-card-title>
              <span class="text-h5">Revisi</span>
              <v-chip
                v-if="showRevisi"
                close
                color="orange"
                label
                outlined
                class="ml-3"
                @click:close="showRevisi = false"
              >
                Revisi : {{ textRevisi }}
              </v-chip>
            </v-card-title>
            <v-card-text>
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-skeleton-loader
                  :loading="isLoading"
                  type="table-heading, list-item-two-line, image, table-tfoot"
                >
                  <v-row>
                    <v-col cols="12">
                      <v-simple-table dense>
                        <template v-slot:default>
                          <thead>
                            <tr>
                              <th class="text-left" width="25px">No</th>
                              <th class="text-left">Upload File</th>
                              <th class="text-left">Keterangan</th>
                              <th class="text-left" width="120px">Tanggal</th>
                              <th class="text-center" width="30px">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr
                              v-for="(item, index) in dataUploadFile"
                              :key="index"
                            >
                              <td>
                                <!-- nomor -->
                                {{ index + 1 }}
                              </td>
                              <td>
                                {{ item.Filename }}
                              </td>
                              <td>{{ item.Keterangan }}</td>
                              <td>{{ item.TanggalHTL }}</td>

                              <td class="text-center">
                                <v-btn
                                  x-small
                                  class="teal--text"
                                  @click="deleteFile(item)"
                                >
                                  <v-icon small>mdi-delete</v-icon>
                                </v-btn>
                              </td>
                            </tr>
                          </tbody>
                        </template>
                      </v-simple-table>
                    </v-col>
                    <v-col cols="3" style="margin: 13px 0px 0px 0px"
                      >File
                    </v-col>
                    <v-col cols="9">
                      <v-file-input
                        style="padding: 0"
                        v-model="uploadLHA"
                        :rules="[(v) => !!v || 'File upload harus diisi!']"
                        placeholder="Upload your documents"
                        label="File input"
                        accept=".doc,.docx,.pdf"
                        prepend-icon="mdi-paperclip"
                      >
                        <template v-slot:selection="{ text }">
                          <v-chip small label color="primary">
                            {{ text }}
                          </v-chip>
                        </template>
                      </v-file-input>
                    </v-col>
                    <v-col cols="3" style="margin: 7px 0px 0px 0px"
                      >Keterangan
                    </v-col>
                    <v-col cols="9">
                      <v-text-field
                        style="margin-top: -22px"
                        :rules="[(v) => !!v || 'Keterangan harus diisi!']"
                        required
                        v-model="keterangan"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="3" style="margin: 10px 0px 0px 0px"
                      >Tanggal
                    </v-col>
                    <v-col cols="9">
                      <v-menu
                        v-model="tglLhp"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            style="padding: 0; margin-top: 0px"
                            v-model="computedDateFormatted"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="date"
                          @input="tglLhp = false"
                        ></v-date-picker>
                      </v-menu>
                    </v-col>

                    <!-- <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      label="Legal middle name"
                      hint="example of helper text only on focus"
                    ></v-text-field>
                  </v-col> -->
                  </v-row>
                </v-skeleton-loader>
              </v-form>
              <!-- <small>*indicates required field</small> -->
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="dialog = false"
                :disabled="disableBtn"
              >
                Tutup
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="saveData"
                :disabled="disableBtn"
              >
                Simpan
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="saveAjukan"
                :disabled="disableBtn"
              >
                Simpan & Ajukan
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </v-row>
    <!-- button -->
    <!-- <v-row>
      <v-col cols="12" class="text-right">
        <v-btn large @click="$router.push('/tindaklanjut')">
          <span class="">Batal</span>
        </v-btn>
        <v-btn
          class="mx-3"
          color="cyan white--text"
          large
          @click="saveTemuan('save')"
          :loading="saving"
        >
          <span>Simpan</span>
        </v-btn>
        <v-btn
          color="primary"
          large
          @click="saveTemuan('saveandSubmit')"
          :loading="savingandsubmit"
        >
          <span class="">Simpan & Proses OPD</span>
        </v-btn>
      </v-col>
    </v-row> -->
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
    dialog: false,
    saving: false,
    savingandsubmit: false,
    loading: false,
    isLoading: false,
    isEdit: false,
    header: {},
    keterangan: "",
    opd: "",
    inputanNo: "",
    inputan: "",
    fileDownload: "Belum upload file",
    uploadLHA: null,
    uploadLHAFilename: "",
    Filename: "",
    TemuanId: "",
    showRevisi: false,
    textRevisi: "",
    valid: true,
    payload: {},
    TanggalHTL: "",
    tglLhp: false,
    dataUploadFile: [],
    pushUploadFile: { Filename: "", Keterangan: "", TanggalHTL: "" },
    dialogHistory: false,
    sekeleton: false,
    dataHistory: [],
    rowTemuan: 0,
    disableBtn: false,
    headersHistory: [
      {
        text: "No",
        value: "no",
        width: "70px",
        align: "center",
        sortable: false,
        slotNo: "no",
      },
      {
        text: "Upload File",
        value: "Filename",
        width: "70px",
        align: "center",
        sortable: false,
        slotName: "Filename",
      },
      {
        text: "Keterangan",
        value: "Keterangan",
        width: "70px",
        align: "center",
        sortable: false,
      },
      {
        text: "Tanggal",
        value: "TanggalHTL",
        width: "70px",
        align: "center",
        sortable: false,
      },
    ],
    userData: [
      { text: "test", value: "satu" },
      { text: "test2", value: "satu2" },
    ],
    date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    temuanTindakLanjut: [
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
        value: "action",
        width: "140px",
        text: "Action",
        align: "center",
        sortable: false,
        slotName: "action",
      },
    ],
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
      },
    ],
    revisi: {
      items: [{ align: "right" }, { align: "left" }],
      loading: false,
    },
  }),
  head() {
    return {
      title: "DASHBOARD:ID",
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
    closeModal() {
      this.dialogHistory = false;
    },
    LHPUrl(filename){
      return process.env.baseUrl+"download/temuan/"+filename
    },
    download(v) {
      let link = document.createElement("a");
      let url = process.env.baseUrl;
      link.href = `${url}download/temuan/${v}`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    detailFile(item) {
      this.TemuanId = item.ID;
      this.sekeleton = true;
      this.dialogHistory = true;
      if (item.Files.length > 0) {
        this.loadGridRevisi();
      } else {
        this.dataHistory = [];
        this.sekeleton = false;
      }
    },
    detailTemuan(val, col, idx) {

      // untuk menampilkan review (jika ada)
      if (val.ReviewText == "" || val.ReviewText == undefined) {
        this.showRevisi = false;
        this.textRevisi = "";
      } else {
        this.showRevisi = true;
        this.textRevisi = val.ReviewText;
      }

      this.dialog = true;
      this.isLoading = true;
      this.disableBtn = false;
      // }/api/tindaklanjut/history/617123466432ec2747cf846e
      this.uploadLHA = null;
      this.keterangan = "";
      this.rowTemuan = idx;
      this.date = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10);
      // console.log("as", val);

      // Filename: "20211101_150748.docx"
      // Keterangan: "tes netes 2"
      this.TanggalHTL = this.date;
      this.TemuanId = val.ID;

      let param = {
        IsReview: false,
      };
      this.$axios
        .post(`api/tindaklanjut/filelist/${val.ID}`, param)
        .then((res) => {
          // this.$axios.get(`api/tindaklanjut/history/${val.ID}`).then((res) => {
          //console.log("ressss", res.data.Data);
          //this.payload = res.data.Data;
          //let dataTemuan = res.data.Data.Temuan;
          this.dataUploadFile = res.data.Data;
          //console.log("data file", res.data.Data);
          this.isLoading = false;
          this.$refs.form.resetValidation();
        })
        .catch((e) => {
          this.$store.commit("setSnackbar", {
            active: true,
            text: e,
          });
        })
        .finally(() => {});
    },
    async deleteDetailTemuan(val, col, idx) {
      const res = await this.$confirm("Apakah yakin untuk menghapus temuan?", {
        title: "Confirm",
        color: "warning",
        icon: "mdi-alert",
      });
      if (res) {
        this.$axios
          .delete(`api/tindaklanjut/temuan/${val.ID}`)
          .then((res) => {
            this.$store.commit("setSnackbar", {
              active: true,
              text: res.data.Message,
            });
            this.loadData();
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
    async deleteFile(val) {
      // var txt;
      // var r = confirm("Apakah yakin untuk menghapus file?");
      const res = await this.$confirm("Apakah yakin untuk menghapus file?", {
        title: "Confirm",
        color: "warning",
        icon: "mdi-alert",
      });
      if (res) {
        console.log(res);
        this.$axios.delete(`api/tindaklanjut/file/${val.ID}`).then((res) => {
          this.$store.commit("setSnackbar", {
            active: true,
            text: res.data.Message,
          });
          this.loadData();
          this.loadGridRevisi();
          //this.dialog = false
        });
      }
      // if (r == true) {
      //   this.$axios.delete(`api/tindaklanjut/history/${val.ID}`).then((res) => {
      //     this.$store.commit("setSnackbar", {
      //       active: true,
      //       text: res.data.Message,
      //     });
      //   });
      // } else {
      //   return;
      // }
      // console.log("v9", val);
    },
    saveUploadFile(data) {
      //console.log("111");
      // this.dataPdf = {'payload':this.payload, 'url':this.getApi};
      data.payload.Limit = -1;
      this.$axios.post(data.url, data.payload).then(
        (r) => {
          this.updateItems(r.data.Data);
        },
        (e) => {
          this.$store.commit("setSnackbar", {
            active: true,
            text: e,
          });
        }
      );
    },
    setSave(param) {
      this.$axios
        .post(`/api/tindaklanjut/files/${this.TemuanId}`, param)
        .then((res) => {
          console.log("lop", res);

          //this.dataUploadFile.push(param);
          this.$store.commit("setSnackbar", {
            active: true,
            text: res.data.Message,
          });
          this.loadGridRevisi();
          
          this.disableBtn = false;
          // this.$dialog.notify.success(res.data.Message, {
          //   ...this.app.notification,
          // });
          // this.$router.push("/tindaklanjut");
        })
        .catch((e) => {
          this.$store.commit("setSnackbar", {
            active: true,
            text: e,
          });

          this.disableBtn = false;
        })
        .finally(() => {
          this.disableBtn = false;
          // this.saving = false;
          // this.savingandsubmit = false;
        });
    },
    loadGridRevisi() {
      let paramLoad = {
        IsReview: false,
      };
      this.$axios
        .post(`api/tindaklanjut/filelist/${this.TemuanId}`, paramLoad)
        .then((res) => {
          this.dataUploadFile = res.data.Data;
          this.dataHistory = this.dataUploadFile;
          //this.TanggalHTL = null
          this.date = new Date(
            Date.now() - new Date().getTimezoneOffset() * 60000
          )
            .toISOString()
            .substr(0, 10);
          this.uploadLHA = null;
          this.keterangan = "";
          this.sekeleton = false;
          if (!this.dialogHistory) {
            this.$refs.form.resetValidation();
          }
          //this.dialog = false;
          this.loadData();
        })
        .catch((e) => {
          this.$store.commit("setSnackbar", {
            active: true,
            text: e,
          });
        })
        .finally(() => {});
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
          vm.Filename = file.name;
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
              Value: ["ADMIN"],
            },
          ],
        },
      };

      this.$axios.post(`api/userTL/list`, param).then((res) => {
        this.userData = res.data.Data;
      });
    },
    filterUser(idUser) {
      // let newUser = this.userData.filter(function (el) {
      //   return el.ID.includes(idUser);
      // });
      // return newUser[0].Name;
      let newUser = this.userData.filter(function (el) {
        return el.ID != undefined ? el.ID.includes(idUser) : "";
      });
      return newUser.length > 0 ? newUser[0].Name : "";
    },
    async saveAjukan() {
      //console.log("newpwayload", this.payload);
      this.disableBtn = true;
      let countFile =
        this.dataUploadFile != null ? this.dataUploadFile.length : 0;
      if (countFile == 0 && this.uploadLHA == null) {
        await this.$confirm(`Silahkan memasukkan File minimal Satu!`, {
          title: "Warning",
          color: "red",
          icon: "mdi-alert",
          buttonTrueText: null,
          buttonFalseText: "Kembali",
        });
        this.disableBtn = false;
      } else if(countFile == 0 && this.keterangan == ""){
        await this.$confirm(`Keterangan harus diisi!`, {
          title: "Warning",
          color: "red",
          icon: "mdi-alert",
          buttonTrueText: null,
          buttonFalseText: "Kembali",
        });
        this.disableBtn = false;
      }
      else {
        const res = await this.$confirm(
          "Apakah anda yakin untuk simpan dan ajukan temuan?",
          {
            title: "Confirm",
            color: "warning",
            icon: "mdi-alert",
          }
        );
        if (res) {
          // console.log(res);

          let param = {};
          param.Keterangan = this.keterangan;
          param.TanggalHTL = this.date;
          if (this.uploadLHA != null) {
            this.getBase64(this.uploadLHA).then(
              (data) => (
                (param.UploadedFileBase64 = data),
                (param.Filename = this.Filename),
                this.setSaveAjukan(param)
              )
            );
          } else {
            this.setSaveAjukan(param);
          }
          //end
        } else {
          this.disableBtn = false;
        }
      }
    },
    setSaveAjukan(param) {
      if (param.Keterangan != "" && this.uploadLHA != null) {
        this.$axios
          .post(`/api/tindaklanjut/files/${this.TemuanId}`, param)
          .then((res) => {
            //console.log("ok", this.payload);
            // loadData() {
            let id = this.$route.params.id;
            //console.log("data", id);
            this.$axios.get(`api/tindaklanjut/${id}`).then((res) => {
              let dataTemuan = res.data.Data.Temuan;
              //console.log("data123", res);
              this.payload = res.data.Data;
              this.Temuan = dataTemuan;
              let newPayload = this.payload;
              newPayload.Temuan[this.rowTemuan].StatusTemuan = 1;
              this.$axios
                .post(`api/tindaklanjut`, newPayload)
                .then((res) => {
                  this.$store.commit("setSnackbar", {
                    active: true,
                    text: res.data.Message,
                  });
                  this.dialog = false;
                  this.loadGridRevisi();
                  this.loadData();
                })
                .catch((e) => {
                  this.$store.commit("setSnackbar", {
                    active: true,
                    text: e,
                  });
                })
                .finally(() => {
                  this.disableBtn = false;
                });
            });
            //}
          })
          .catch((e) => {
            this.$store.commit("setSnackbar", {
              active: true,
              text: e,
            });
          })
          .finally(() => {});
      } else {
        let newPayload = this.payload;
        newPayload.Temuan[this.rowTemuan].StatusTemuan = 1;
        this.$axios
          .post(`api/tindaklanjut`, newPayload)
          .then((res) => {
            this.$store.commit("setSnackbar", {
              active: true,
              text: res.data.Message,
            });
            this.dialog = false;
            this.loadGridRevisi();
            this.loadData();
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
    saveData() {
      this.disableBtn = true;
      // const valid = await this.$refs.tindaklanjut.validate();
      if (!this.$refs.form.validate()) return;
      // let condition = c;
      // if (condition == "save") {
      //   this.saving = true;
      // } else {
      //   this.savingandsubmit = true;
      // }

      //console.log("pppp", this.$refs.form.validate());

      let param = {};
      //   "ID": "",

      // "Filename": "",
      param.Keterangan = this.keterangan;
      param.TanggalHTL = this.date;
      // "UploadedFileBase64":

      if (this.uploadLHA != null) {
        this.getBase64(this.uploadLHA).then(
          (data) => (
            //console.log("lllllll", data),
            (param.UploadedFileBase64 = data),
            (param.Filename = this.Filename),
            this.setSave(param)
          )
        );
      } else {
        this.setSave(param);
      }
    },
    loadData() {
      let id = this.$route.params.id;
      //console.log("data", id);
      this.$axios.get(`api/tindaklanjut/${id}`).then((res) => {
        let dataTemuan = res.data.Data.Temuan;
        //console.log("data123", res);
        this.payload = res.data.Data;
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

 
  