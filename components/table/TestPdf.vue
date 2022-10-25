<template>
  <div>
    <div
      style="
        text-align: center;
        padding: 10px;
        font-size: 13px;
        font-weight: bold;
      "
    >
      MONITORING AKUNTABILTIAS KEUANGAN PERANGKAT DAERAH
    </div>
    <div style="text-align: left; padding-bottom: 10px; font-size: 12px;">
      Periode : {{ $store.state.getPage.filter }}
    </div>
    <table
      class="export-pdf"
      style="width: 100%; font-size: 12px;"
      cellpadding="0"
      cellspacing="0"
      ref="tbl"
    >
      <tr>
        <th rowspan="3" style="text-align: center">No</th>
        <th rowspan="3" style="text-align: center">NAMA PERANGKAT DAERAH</th>
        <th colspan="8" style="text-align: center">SKPID</th>
      </tr>
      <tr>
        <th rowspan="2" style="text-align: center">ANGGARAN</th>
        <th colspan="6" style="text-align: center">REALISASI</th>
        <th rowspan="2">UANG KAS TUNAI</th>
      </tr>
      <tr>
        <th>BELANJA OPERASI LAINNYA</th>
        <th>BELANJA PERSEDIAAN</th>
        <th>BELANJA MODAL</th>
        <th>BELANJA TIDAK TERDUGA</th>
        <th>TOTAL REALISASI</th>
        <th>%</th>
      </tr>
      <template v-for="(entry, i) in $store.state.getPage.data">
        <template v-if="++i% 12 == 0">
          <div :key="i + 'space'" class="html2pdf__page-break"></div>
        </template>
        <tr :key="i">
          <td style="width: 100px">{{ i }}</td>
          <td style="width: 800px">{{ entry.nama_organisasi }}</td>
          <td style="width: 800px; text-align: right">
            {{ numberWithCommas(entry.anggaran) }}
          </td>
          <td style="width: 800px; text-align: right">
            {{ numberWithCommas(entry.belanja_operasi_lainnya) }}
          </td>
          <td style="width: 800px; text-align: right">
            {{ numberWithCommas(entry.belanja_persediaan) }}
          </td>
          <td style="width: 800px; text-align: right">
            {{ numberWithCommas(entry.belanja_modal) }}
          </td>
          <td style="width: 800px; text-align: right">
            {{ numberWithCommas(entry.belanja_tidak_terduga) }}
          </td>
          <td style="width: 800px; text-align: right">
            {{ numberWithCommas(entry.jumlah_realisasi) }}
          </td>
          <td style="width: 800px; text-align: right">
            {{ numberWithCommas(entry.persentase) }}
          </td>
          <td style="width: 800px; text-align: right">
            {{ numberWithCommas(entry.uang_kas_tunai) }}
          </td>
        </tr>
      </template>
    </table>
  </div>
</template>
<script>
export default {
  mounted() {
    this.tableHeight = this.$refs.tbl.clientHeight;
  },
  data: () => ({
    tableHeight: 0,
  }),
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
  },
};
</script>
<style scoped>
th,
td {
  padding: 3px;
  border: 1px solid black;
  border-collapse: collapse;
}
th {
  text-align: center;
}
.export-pdf >>> .html2pdf__page-break {
  margin-bottom: 12px;
}
</style>