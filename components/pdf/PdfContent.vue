<template>
  <section class="pdf-content" style="font-size: 8px">
    <section class="report-info" style="padding: 10px 16px 10px 10px">
      <template v-if="$store.state.getPage.title == 'SKPD'">
        <skpd></skpd>
      </template>
      <template v-else-if="$store.state.getPage.title == 'SEKOLAH'">
        <sekolah></sekolah>
      </template>
    </section>
  </section>
</template>

<script>
// this.$store.commit("setPage", {'title':this.title, 'data': this.itemsGrid, 'filter': this.formatDate(this.date)+' S/D '+this.formatDate(this.date2)});
import Test from "@/components/table/TestPdf";
export default {
  props: {
    loadUrl: String,
    //getPage: String
  },
  components: {
    Test
  },
  data() {
    return {};
  },
  watch: {
    getPage(data) {
      conosle.log("page====", this.$store.state.getPage);
    },
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.$emit("domRendered");
      }, 1000);
    });
  },
};
</script>

