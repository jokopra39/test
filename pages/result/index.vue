<template>
  <div class="bg-search">
    <div class="bar">
      <v-row>
        <v-col>
          <v-menu left bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                class="mt-3 ml-3"
                color="white"
                small
                icon
                v-bind="attrs"
                v-on="on"
              >
                <v-icon size="22px">mdi-menu</v-icon>
              </v-btn>
            </template>

            <v-list>
              <v-list-item
                v-for="n in menuItem"
                :key="n"
                @click="selectMenu(n)"
              >
                <v-list-item-title>{{ n }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-col>
        <v-col class="text-center">
          <v-img
            alt="logique"
            class="shrink img-logo py-4 mt-1"
            contain
            :src="logo"
            transition="scale-transition"
            width="72.2px"
          />
        </v-col>
        <v-col class="text-right">
          <div class="pr-2">
            <v-btn color="white" small class="mt-3" @click="showSearch" icon>
              <v-icon size="22px">mdi-magnify</v-icon>
            </v-btn>
          </div>
        </v-col>
      </v-row>
      <div class="py-7 px-2">
        <div class="text-center result-for">
          {{ resultFor }}<span class="result-val">{{ resultVal }}</span>
          <v-progress-circular
            v-if="loading"
            indeterminate
            size="20"
            color="#7b34dd"
          ></v-progress-circular>
        </div>
      </div>

      <v-list
        style="max-height: 500px; background-color: transparent"
        class="overflow-y-auto"
      >
        <template v-for="(item, i) in tempItems">
          <v-list-item :key="i">
            <v-col class="py-2 px-3">
              <v-card class="rounded-lg">
                <div class="d-flex flex-no-wrap">
                  <v-avatar class="ma-3 rounded-lg" size="100" tile>
                    <v-img :src="item.artworkUrl100"></v-img>
                  </v-avatar>
                  <div style="width: 100%">
                    <v-row class="mt-1">
                      <v-col class="artis-name"> {{ item.artistName }} </v-col>
                    </v-row>
                    <v-row class="mt-1" style="height: 46px">
                      <v-col class="track-name">
                        {{ textTruncate(item.collectionName) }}
                      </v-col>
                    </v-row>
                    <v-row cols="12">
                      <v-col>
                        <div class="d-flex flex-no-wrap justify-left floatbtn">
                          <div>
                            <v-btn
                              class="mb-1"
                              color="#10b981"
                              dark
                              rounded
                              x-small
                            >
                              {{ item.primaryGenreName }}
                            </v-btn>
                          </div>
                        </div>
                      </v-col>

                      <v-col>
                        <div class="d-flex flex-no-wrap justify-end mr-3">
                          <v-icon size="17px" color="#f5b014"
                            >mdi-currency-usd</v-icon
                          ><span class="gold">{{ item.trackPrice }}</span>
                        </div>
                      </v-col>
                    </v-row>
                  </div>
                </div>
              </v-card>
            </v-col>
          </v-list-item>
        </template>
      </v-list>
      <div class="text-center">
        <button
          @click="loadMore()"
          class="inp btn-search-result mt-4"
          type="button"
        >
          Load More
        </button>
      </div>
    </div>

    <popup-search
      ref="dialogSearch"
      :isShow="dialogSearch"
      :title="titlePopup"
      @closeModal="closeModal()"
      @getValueSearch="getValueSearch"
    >
    </popup-search>
  </div>
</template>
  <script>
import Logo from "../../static/ngmusic@2x.png";
import LogoSearch from "../../static/search@2x.png";
import LogoMenu from "../../static/menu@2x.png";
export default {
  name: "index",
  layout: "nologin",
  components: {
    PopupSearch: () => import("@/components/PopupSearch.vue"),
  },
  head() {
    return {
      title: "INDEX",
    };
  },
  data: () => ({
    logo: Logo,
    selected: [],
    logoSearch: LogoSearch,
    logoMenu: LogoMenu,
    inputSearch: "",
    menuItem: ["Home", "Search"],
    resultFor: "Search result for :",
    resultVal: "Json Mraz",
    dialogSearch: false,
    titlePopup: "Search",
    items: [],
    tempItems: [],
    loading: false,
    countPage: 0,
  }),
  mounted() {
    this.$store.commit("setErrorText", "");
    this.searchData();
  },
  methods: {
    selectMenu: function (n) {
      if (n === "Home") {
        this.$router.push("/");
      } else {
        this.showSearch();
      }
    },
    closeModal: function () {
      this.dialogSearch = false;
      this.$refs.dialogSearch.resetForm();
    },
    showSearch: function () {
      this.dialogSearch = true;
    },
    getValueSearch: function (v) {
      this.resultVal = v;
      this.closeModal();
      this.getData(v);
    },
    searchData: function () {
      this.resultVal = this.$store.state.search;
      this.getData(this.resultVal);
    },
    getData: async function (val) {
      let newPayload = {};
      this.loading = true;
      await this.$axios
        .post(
          `https://itunes.apple.com/search?term=${val}&entity=song&limit=25`,
          newPayload
        )
        .then((res) => {
          this.countPage = 0;
          let data = res.data.results;
          this.items = data;
          this.tempItems = [];
          this.loadMore();
        })
        .catch((e) => {
          this.$store.commit("setSnackbar", {
            active: true,
            text: e,
          });
        })
        .finally(() => {
          this.loading = false;
        });
    },
    textTruncate: function (v) {
      let text = v;
      if (v.length > 60) {
        text = v.substring(0, 60) + "...";
      }
      return text;
    },
    loadMore: function () {
      let tempPage = this.countPage;
      if (tempPage < 3) {
        this.loading = true;
        for (let i in this.items) {
          if (tempPage === 0 && i < 10) {
            this.tempItems.push(this.items[i]);
            this.countPage = 1;
            console.log(this.tempItems.length, tempPage);
          } else if (tempPage === 1 && i > 9 && i < 20) {
            this.tempItems.push(this.items[i]);
            this.countPage = 2;
            console.log(this.tempItems.length, tempPage);
          } else if (tempPage === 2 && i > 19 && i < 25) {
            this.tempItems.push(this.items[i]);
            this.countPage = 3;
            console.log(this.tempItems.length, tempPage);
          }
        }
        setTimeout(() => (this.loading = false), 2000);
      }
    },
  },
};
</script>
  <style>
.bg-search {
  height: 100%;
  background-color: #f8fafc;
}
.img-logo {
  margin-left: auto;
  margin-right: auto;
}
.img-logo-search {
  float: right;
}
.btn-search-result {
  border: none;
  color: #64748b;
  width: 120px !important;
  text-decoration: none;
  background-color: #e2e8f0;
  font-family: Roboto;
  font-size: 12px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: 0.43px;
}
.bar {
  position: fixed;
  height: 64px;
  width: 100%;
  box-shadow: 0 0 6px 0 rgba(148, 77, 230, 0.75);
  background-image: linear-gradient(100deg, #712bda, #a45deb 100%);
  border-radius: 0px 0px 200px 222px/33px 24px 21px 22px;
}
.text-right {
  text-align: right;
  clear: right;
}
.result-val {
  width: 91px;
  height: 21px;
  margin: 0 0 0 10px;
  font-family: Roboto;
  font-size: 18px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: 0.64px;
  color: #7b34dd;
}
.result-for {
  font-size: 14px;
  font-family: "Roboto-Regular", sans-serif;
}
.float-right {
  width: 100%;
  float: right;
  right: 0;
}
.gold {
  color: #f5b014;
}
.track-name {
  font-family: Roboto;
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: 0.5px;
  color: #334155;
}
.artis-name {
  font-family: Roboto;
  font-size: 10px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: 0.36px;
  color: #334155;
}
</style>