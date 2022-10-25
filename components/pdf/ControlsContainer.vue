<template>
  <!-- <section class="control-container"> -->
  <!-- <button
      :disabled="isGenerating"
      class="generate-btn"
      @click="$emit('generateReport')"
    >
      {{ "Generate PDF" }}
    </button> -->
  <v-btn
    color="blue-grey"
    class="ma-2 white--text"
    min-width="120px"
    :disabled="isGenerating"
    @click="$emit('generateReport')"
  >
    PDF
    <v-icon right dark> mdi-file-pdf-box</v-icon>
  </v-btn>

  <!-- <section class="progress-container">
      <div class="progress-bar">
        <div class="progress" :style="`width: ${progress}%;`" />
      </div>

      <section class="generating-label" v-if="progress !== 0">
        <span class="label-title">
          {{ progress === 100 ? "PDF Generated" : "Generating PDF" }}
        </span>

        <span class="label-progress">
          {{ `${progress} %` }}
        </span>
      </section>
    </section> -->
  <!-- </section> -->
</template>

<script>
export default {
  props: {
    progress: {
      type: Number,
      default: 0,
    },
    dataPdf: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      controls: [],
    };
  },
  computed: {
    isGenerating() {
      return this.progress !== 0 && this.progress !== 100;
    },
  },
  watch: {
    dataPdf(data) {
      //console.log("dataPdf", data);
      //this.getDataPdf(data);
    },
  },
  methods: {
    getDataPdf(data) {
      //console.log("111");
      // this.dataPdf = {'payload':this.payload, 'url':this.getApi};
      data.payload.Limit = -1;
      this.$axios.post(data.url, data.payload).then(
        (r) => {
          this.updateItems(r.data.Data);
        },
        (e) => {}
      );
    },
    updateItems(data) {
      let addStatus = [];
      function myFunction(item, index) {
        let nilaiAset = item.nilai_aset == 0 ? 1 : item.nilai_aset;
        let belanjaModal = item.belanja_modal == 0 ? 1 : item.belanja_modal;
        let opr = (nilaiAset / belanjaModal) * 100;
        if (item.uang_kas_tunai <= 10000000 && opr >= 97) {
          item.status = "A";
          item.tindakan = "OK";
        } else if (
          item.uang_kas_tunai >= 10000000 &&
          item.uang_kas_tunai <= 50000000 &&
          opr >= 97
        ) {
          item.status = "B";
          item.tindakan = "Monitoring kas";
        } else if (item.uang_kas_tunai > 50000000 && opr >= 97) {
          item.status = "C";
          item.tindakan = "Pemeriksaan keputusan kas";
        } else if (item.uang_kas_tunai <= 10000000 && opr >= 85 && opr < 97) {
          item.status = "D";
          item.tindakan = "Monitoring aset dan persediaan";
        } else if (
          item.uang_kas_tunai >= 10000000 &&
          item.uang_kas_tunai <= 50000000 &&
          opr >= 85 &&
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
      //this.itemsGrid = addStatus;
      let ndata = "";
      if (this.$store.state.getPage.title == "SKPD") {
        ndata = addStatus;
      } else {
        ndata = data;
      }
      this.$store.commit("setPage", {
        title: this.$store.state.getPage.title,
        data: ndata,
        filter: this.$store.state.getPage.filter,
      });
      //console.log("addStatus", addStatus);
    },
    setInput(e, key, inputType) {
      let value = e.target.value;
      if (inputType === "checkbox") {
        value = e.target.checked;
      }
      if (inputType === "number") {
        value = e.target.value ? parseFloat(e.target.value) : 0;
      }
      //this.$set(this.controlValue, key, value)
    },
  },
};
</script>

