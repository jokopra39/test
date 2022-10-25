<template>
  <div>
    <client-only>
      <vue-html2pdf
        :show-layout="controlValue.showLayout"
        :float-layout="controlValue.floatLayout"
        :enable-download="controlValue.enableDownload"
        :preview-modal="controlValue.previewModal"
        :filename="controlValue.filename"
        :paginate-elements-by-height="controlValue.paginateElementsByHeight"
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
      <!--  @beforeDownload="beforeDownload($event)"
        @hasDownloaded="hasDownloaded($event)"
        @startPagination="startPagination()"
        @hasPaginated="hasPaginated()" -->
      <controls-container
        :progress="progress"
        @generateReport="downloadPdf()"
      />
    </client-only>
  </div>
</template>
<script>
import PdfContent from "@/components/pdf/PdfContent";
import ControlsContainer from "@/components/pdf/ControlsContainer";
export default {
  name: "app",
  data() {
    return {
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
        filename: "Hee Hee",
        pdfQuality: 2,
        pdfFormat: "a4",
        pdfOrientation: "portrait",
        pdfContentWidth: "800px",
      },
    };
  },
  computed: {
    htmlToPdfOptions() {
      return {
        margin: 0,
        filename: "hee hee.pdf",
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
  },
  methods: {
    async downloadPdf() {
      //if (!(await this.validateControlValue())) return;
      this.$refs.html2Pdf.generatePdf();
    },
    // validateControlValue() {
    //   const paperSizes = [
    //     "a0",
    //     "a1",
    //     "a2",
    //     "a3",
    //     "a4",
    //     "letter",
    //     "legal",
    //     "a5",
    //     "a6",
    //     "a7",
    //     "a8",
    //     "a9",
    //     "a10",
    //   ];
    //   return true;
    // },
    onProgress(progress) {
      this.progress = progress;
      //console.log(`PDF generation progress: ${progress}%`);
    },
    // startPagination() {
    //   console.log(`PDF has started pagination`);
    // },
    // hasPaginated() {
    //   console.log(`PDF has been paginated`);
    // },
    // async beforeDownload({ html2pdf, options, pdfContent }) {
    //   console.log(`On Before PDF Generation`);
    // },
    // hasDownloaded(blobPdf) {
    //   console.log(`PDF has downloaded yehey`);
    //   this.pdfDownloaded = true;
    //   console.log(blobPdf);
    // },
    domRendered() {
      this.contentRendered = true;
    },
    // onBlobGenerate(blob) {
    //   console.log(blob);
    // },
  },
  components: {
    PdfContent,
    ControlsContainer,
  },
};
</script>
