<template v-for="slotName in list">
  <div>
    <v-data-table
      id="mytable"
      dense
      :headers="headers"
      :items="gridItems"
      item-key="name"
      class="elevation-1"
      :options.sync="options"
      :server-items-length="pageCount"
    >
      <template v-if="gridItems.length > 0" #header="{ props: {} }">
        <thead v-if="setTopHeader.length > 0">
          <tr>
            <th
              v-for="(h, i) in setTopHeader"
              :key="i"
              class="text-center td-border-style"
              v-bind:class="[h.border ? borderBottom : '']"
              :rowspan="1"
              :colspan="h.colspan"
            >
              {{ h.text }}
            </th>
          </tr>
        </thead>
        <thead v-if="setMainHeader.length > 0">
          <tr>
            <th
              v-for="(h, i) in setMainHeader"
              :key="i"
              class="text-center td-border-style"
              v-bind:class="[h.border ? borderBottom : '']"
              :rowspan="1"
              :colspan="h.colspan"
            >
              <div
                v-bind:class="[
                  h.rowspan ? 'mar-12' : '',
                  h.rowspanMid ? 'mar-9' : '',
                ]"
              >
                <div v-bind:class="[h.rowspan ? valignMiddle : '']">
                  {{ h.text }}
                </div>
              </div>
            </th>
          </tr>
        </thead>
      </template>
      <!-- <template
        v-for="(col, idx) in headers"
        v-slot:[`item.${col.value}`]="{ item }"
      >
        <div :key="'k-item-data-' + idx">
          <template v-if="col.slotName != undefined">
            <slot :name="viewName + col.value" v-bind="{ item, col }"> </slot>
          </template>
          <template v-else>
            {{ item[col.value] }}
          </template>
        </div>
      </template> -->
      <template v-slot:item="{ item }">
        <tr>
          <td
            class="text-center td-border-style"
            v-for="(col, columnIndex) in headers"
            :key="columnIndex"
          >
            <template v-if="setDatefield.includes(col.value)">
              {{
                $moment(item[col.value], "YYYY-MM-DD")._isValid
                  ? $moment(item[col.value], "YYYY-MM-DD").format("DD-MMM-YYYY")
                  : col
              }}
            </template>
            <template v-else-if="col.slotName != undefined">
              <slot :name="viewName + col.value" v-bind="{ item, col }"> </slot>
            </template>
            <template v-else-if="setNumberfield.includes(col.value)">
              <div style="text-align: right">
                {{ numberWithCommas(item[col.value]) }}
              </div>
            </template>
            <template v-else-if="col.value == 'Temuan'">
              <div style="text-align: center">
                {{ item[col.value].length }}
              </div>
            </template>
            <template v-else-if="col.value == 'action'">
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

            <template v-else-if="col.value == 'actionDescription'">
              <div style="text-align: center">
                <v-btn
                  v-if="item.Status > 1"
                  small
                  depressed
                  dark
                  color="primary"
                  @click="detailItem(item)"
                >
                  {{ item.ActiveApprove }}
                </v-btn>
                <v-btn v-else disabled small depressed> 0 </v-btn>
              </div>
            </template>
            <template
              v-else-if="col.value == 'status' && item[col.value] == 'A'"
            >
              <v-layout justify-center>
                <v-avatar color="green" size="12"></v-avatar>
              </v-layout>
            </template>
            <template
              v-else-if="col.value == 'status' && item[col.value] == 'B'"
            >
              <v-layout justify-center>
                <v-avatar color="yellow" size="12"></v-avatar
              ></v-layout>
            </template>
            <template
              v-else-if="col.value == 'status' && item[col.value] == 'C'"
            >
              <v-layout justify-center>
                <v-avatar color="red" size="12"></v-avatar
              ></v-layout>
            </template>
            <template
              v-else-if="col.value == 'status' && item[col.value] == 'D'"
            >
              <v-layout justify-center>
                <v-avatar color="yellow" size="12"></v-avatar>&nbsp;
                <v-avatar color="yellow" size="12"></v-avatar
              ></v-layout>
            </template>
            <template
              v-else-if="col.value == 'status' && item[col.value] == 'E'"
            >
              <v-layout justify-center>
                <v-avatar color="yellow" size="12"></v-avatar>&nbsp;
                <v-avatar color="yellow" size="12"></v-avatar>&nbsp;
                <v-avatar color="yellow" size="12"></v-avatar
              ></v-layout>
            </template>
            <template
              v-else-if="col.value == 'status' && item[col.value] == 'F'"
            >
              <v-layout justify-center>
                <v-avatar color="red" size="12"></v-avatar>&nbsp;
                <v-avatar color="red" size="12"></v-avatar>&nbsp;
                <v-avatar color="red" size="12"></v-avatar
              ></v-layout>
            </template>
            <template
              v-else-if="col.value == 'status' && item[col.value] == 'G'"
            >
              <v-layout justify-center>
                <v-avatar color="red" size="12"></v-avatar>&nbsp;
                <v-avatar color="red" size="12"></v-avatar
              ></v-layout>
            </template>
            <template
              v-else-if="col.value == 'status' && item[col.value] == 'H'"
            >
              <v-layout justify-center>
                <v-avatar color="red" size="12"></v-avatar>&nbsp;
                <v-avatar color="red" size="12"></v-avatar>&nbsp;
                <v-avatar color="red" size="12"></v-avatar
              ></v-layout>
            </template>
            <template
              v-else-if="col.value == 'status' && item[col.value] == 'I'"
            >
              <v-layout justify-center>
                <v-avatar color="red" size="12"></v-avatar>&nbsp;
                <v-avatar color="red" size="12"></v-avatar>&nbsp;
                <v-avatar color="red" size="12"></v-avatar
              ></v-layout>
            </template>
            <template v-else>
              <div style="text-align: center">
                {{ item[col.value] }}
              </div>
            </template>
          </td>
        </tr>
      </template>
    </v-data-table>
    <!-- dialog -->
    <v-row justify="center">
      <v-dialog v-model="dialog" persistent max-width="800px">
        <v-card>
          <v-card-title>
            <span class="text-h5">History</span>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-simple-table dense>
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th class="text-left" width="25px">No</th>
                        <th class="text-left">User</th>
                        <th class="text-left">Status</th>
                        <th class="text-left">Keterangan</th>
                        <th class="text-left" width="120px">Tanggal</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in dataHistory" :key="index">
                        <td>
                          <!-- nomor -->
                          {{ index + 1 }}
                        </td>
                        <td>
                          {{ item.User }}
                        </td>
                        <td class="text-center">
                          {{ item.Status }}
                        </td>
                        <td>{{ item.Keterangan }}</td>
                        <td>{{ item.TanggalHTL }}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-col>

              <!-- <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      label="Legal middle name"
                      hint="example of helper text only on focus"
                    ></v-text-field>
                  </v-col> -->
            </v-row>
            <!-- <small>*indicates required field</small> -->
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialog = false">
              Tutup
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>
<script>
export default {
  props: {
    loadUrl: String,
    gridHeader: {
      type: Array,
      default: () => {
        return [];
      },
    },
    setPayload: {
      type: Object,
      default: () => {
        return {};
      },
    },
    setDatefield: {
      type: Array,
      required: true,
      default: () => {
        return [];
      },
    },
    setNumberfield: {
      type: Array,
      required: true,
      default: () => {
        return [];
      },
    },
    setItems: {
      type: Array,
      required: false,
      default: () => {
        return [];
      },
    },
    setMainHeader: {
      type: Array,
      required: false,
      default: () => {
        return [];
      },
    },
    setTopHeader: {
      type: Array,
      required: false,
      default: () => {
        return [];
      },
    },
    setNewPayload: {
      type: Array,
      default: () => {
        return [];
      },
    },
    setAdvancedFilter: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    setRole: {
      type: Array,
      default: () => {
        return [];
      },
    },
    defaultShort: {
      type: Array,
      default: () => {
        return [];
      },
    },
    filterGrid:{
      type: Array,
      default: () => {
        return [];
      },
    }
  },
  data: () => ({
    dialog: false,
    viewName: "view_",
    dataHistory: [
      {
        User: "OPD",
        Status: "Belum Diajukan",
        Keterangan: "Belum lengkap",
        TanggalHTL: "12-11-2021",
      },
    ],
    borderBottom: "border-bottom",
    valignMiddle: "valign-middle",
    valignRowsMiddle: "mar-9",
    gridItems: [],
    headers: [],
    page: 1,
    loading: true,
    pageCount: 0,
    itemsPerPage: 10,
    options: {},
    filter: [],
    filtered: false
  }),
  computed: {},
  watch: {
    options: {
      handler() {
        this.getDataFromApi();
      },
      deep: true,
    },
    setNewPayload(data) {
      //this.filter = data;
      this.getDataFromApi();
    },
    filterGrid(){
      this.filtered = true;
      this.getDataFromApi();
    }
  },
  methods: {
    numberWithCommas(x) {
      let toFix = parseFloat(x).toFixed(2);
      let parts = toFix.toString().split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      let newFomat = parts.join("_");
      let dotFormat = newFomat.replace(/,/g, ".");
      let decFromat = dotFormat.replace(/_/g, ",");
      return decFromat;
    },
    async detailItem(item) {
      let url = this.$route.path;
      let urlFirst = url.split("/");
      //console.log("TESSS", urlFirst);
      this.$router.push(`/${urlFirst[1]}/${item.ID}`);
      // this.$router.push({name: 'opd-id', path: `/${urlFirst[1]}/${item.ID}`, component: '~pages/opd/_id.vue'})
    },
    detailHistory(id) {
      this.dialog = true;
      //MARK TEDD
      let newPayload = {};
      // this.$axios.post(`api/tindaklanjut`, newPayload).then((res) => {
      //   this.$store.commit("setSnackbar", {
      //     active: true,
      //     text: res.data.Message,
      //   });
      // });
    },
    itemsEmit() {
      this.$emit("getItems", this.gridItems);
    },
    modifyHeader() {
      if (this.gridHeader.length > 0) {
        this.headers = this.gridHeader;
      } else {
        let objHeader = this.gridItems;
        let firstForHeader = objHeader[Object.keys(objHeader)[0]];
        let headerGrid = Object.keys(firstForHeader).map((key) => {
          if (key == "ID") {
            return "";
          } else {
            return {
              text: key.split("_").join(" "),
              value: key,
              width: key.length * 17 + "px",
            };
          }
        });
        this.headers = headerGrid;
        //console.log("head", JSON.stringify(headerGrid));
      }
    },
    getDataFromApi() {
      this.loading = true;
      //console.log("header", this.defaultShort)
      //this.itemsEmit();
      this.apiCall().then((data) => {
        this.pageCount = data.total;
        this.loading = false;
      });
    },
    apiCall() {
      return new Promise((resolve, reject) => {
        const { sortBy, sortDesc, page, itemsPerPage } = this.options;
        let payload = {}
        const cPayload =  {
          Skip: 0,
          Limit: 10,
          Orders: ["-LastUpdatedDate"],
          Filter: {
            Logic: "$and",
            Filters: [],
          },
          Keyword: "",
          KeywordFields: [],
        }
        if(this.filtered){
          payload = cPayload;
        }else{
          payload = JSON.parse(JSON.stringify(this.setPayload));
        }
        
        payload.Skip = (page - 1) * itemsPerPage;
        let pageFor = this.pageCount - (page - 1) * itemsPerPage;
        if (pageFor == 0) {
          payload.Limit = itemsPerPage;
        } else if (pageFor < itemsPerPage) {
          payload.Limit = pageFor;
        } else {
          payload.Limit = itemsPerPage;
        }

        if (this.setAdvancedFilter) {
          if (this.filter.length == 0) {
            payload.Filter.Filters = [
              {
                Field: "tanggal",
                Operator: "$gte",
                Value: new Date(Date.now()).toISOString().substr(0, 10),
              },
              {
                Field: "tanggal",
                Operator: "$lte",
                Value: new Date(Date.now()).toISOString().substr(0, 10),
              },
            ];
          } else {
            payload.Filter.Filters = this.filter;
          }
        }
       
        if(this.filterGrid.length > 0){
          payload.Filter.Filters = this.filterGrid;
        }
        let valueShort = sortBy.length
        let newSortDesc = sortDesc.length
        let condSort = ""
        if(newSortDesc > 0 && !sortDesc[0]){
          condSort = "-"
        }else{
          condSort = ""
        }
        if(valueShort > 0){
          let nValShort = condSort+sortBy[0]
          payload.Orders = [nValShort]
          //console.log(sortBy[0])
        }else{
          payload.Orders = this.defaultShort
        }
        if(this.filtered){
          payload.Limit = itemsPerPage;
          payload.Skip = 0;
          this.options.page = 1
        }
        //console.log("pay", payload)
        this.$axios.post(this.loadUrl, payload).then(
          (r) => {
            this.$store.commit("setErrorText", "");
            let newRole = this.setRole.includes(this.$cookie.get("userRole"));
            this.gridItems = newRole ? [] : r.data.Data;
            this.addNo(this.gridItems, page, itemsPerPage, r.data.Total);
            this.itemsEmit();
            let items =
              this.setItems.length > 0 ? this.setItems : this.gridItems;
            const total = newRole ? 0 : r.data.Total;
            if (itemsPerPage > 0) {
              items = items.slice(
                (page - 1) * itemsPerPage,
                page * itemsPerPage
              );
            }
            setTimeout(() => {
              resolve({
                items,
                total,
              });
            }, 1000);
            if (this.gridItems.length > 0) {
              this.modifyHeader();
              this.pageCount = r.data.Total;
            } else {
              this.modifyHeader();
            }
            this.filtered = false;
          },
          (e) => {
            this.filtered = false;
            this.$tool.handleError(e);
          }
        );
      });
    },
    addNo(data, page, itemPerPage, total) {
      let setNumberRow = [];

      if (itemPerPage == -1) {
        for (let i = 0; i < data.length; i++) {
          let adjust = i + 1;
          data[i].no = adjust;
          //console.log("last", itemPerPage);
          setNumberRow.push(data[i]);
        }
      } else {
        for (let i = 0; i < data.length; i++) {
          let sNumber = itemPerPage * page;
          let sNumberData = data.length * page;
          let adjust = i + 1;
          let value = 0;
          if (sNumberData < sNumber) {
            value = total - (data.length - (i + 1));
          } else {
            value = sNumber - (data.length - adjust);
          }

          data[i].no = value;
          //console.log("last", itemPerPage);
          setNumberRow.push(data[i]);
        }
      }
      this.gridItems = setNumberRow;
    },
  },
};
</script>
<style scoped>
.theme--light#mytable >>> table th {
  border-right: thin solid rgba(0, 0, 0, 0.12);
}
.theme--light#mytable >>> table td {
  border-right: thin solid rgba(0, 0, 0, 0.12);
}
.theme--light#mytable >>> table th.border-bottom {
  border-bottom: 2px solid #ffffff;
  border-right: thin solid rgba(0, 0, 0, 0.12);
}

.theme--dark#mytable >>> table th {
  border-right: thin solid #393939;
}
.theme--dark#mytable >>> table td {
  border-right: thin solid #393939;
}
.theme--dark#mytable >>> table th.border-bottom {
  border-bottom: 2px solid rgb(30, 30, 30);
  border-right: thin solid #393939;
}
.mar-12 {
  position: relative;
  margin-top: 11px;
}
.valign-middle {
  position: absolute;
  width: 100%;
}
.mar-9 {
  position: relative;
  margin-bottom: -31px;
}
</style>
