 <template>
  <v-row>
    <v-col cols="9">
      <v-list-item class="ml-n3">
        <v-hover>
          <v-btn @click="setBack(setPageIcon)" color="cyan" dark fab small>
            <v-icon>{{ setPageIcon }} </v-icon>
          </v-btn>
        </v-hover>
        <v-list-item-content class="py-0 ml-2">
          <v-list-item-title class="text-uppercase text--secondary">{{
            setPageTitle
          }}</v-list-item-title>
          <v-list-item-subtitle class="text--disabled">
            <v-breadcrumbs class="px-2 py-0 float-right">
              <template v-slot:divider>
                <v-icon>mdi-chevron-right</v-icon>
              </template>
            </v-breadcrumbs>
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-col>
    <!-- <v-col cols="3"
      ><div style="float: right; margin-top: 10px">
        Last retrieval {{ $store.state.lastRetrieval }}
      </div></v-col
    > -->
  </v-row>
</template>
<script>
export default {
  data: () => ({
    get: [],
    lastRetrieval: "",
  }),
  props: {
    setPageTitle: String,
    setPageIcon: {
      type: String,
      required: false,
      default: () => {
        return "mdi-database-search";
      },
    },
  },
  methods:{
    setBack(val){
        if(val == 'mdi-arrow-left-circle'){
            this.$router.back()
        }
    }
  },
  watch: {
    setPageIcon: function (val) {
      let url = this.$route.path;
      let urlFirst = url.split("/");
      //console.log("val", this.setPageTitle, urlFirst[1])
    },
  },
  computed: {},
};
</script>