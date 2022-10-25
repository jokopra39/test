<template>
  <v-app light>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-item style="margin-bottom: 8px">
          <template v-if="!miniVariant">
            <v-list-item-content
              v-show="!miniVariant"
              style="margin-left: -7px"
            >
              <div id="title-text" style="min-width: 200px">{{nameApp}}</div>
            </v-list-item-content>
            <v-btn icon @click.stop="miniVariant = !miniVariant">
              <v-icon
                >mdi-{{ `chevron-${miniVariant ? "right" : "left"}` }}</v-icon
              >
            </v-btn>
          </template>
          <template v-else>
            <v-btn
              icon
              @click.stop="miniVariant = !miniVariant"
              style="margin-left: -7px"
            >
              <v-icon
                >mdi-{{ `chevron-${miniVariant ? "right" : "left"}` }}</v-icon
              >
            </v-btn>
          </template>
        </v-list-item>
        <v-divider />
        <v-list-item-group v-model="selectedItem" color="primary">
          <template v-for="(item, i) in allMenu">
            <template v-if="item.role.includes($cookie.get('userRole'))">
              <v-list-item :key="i" class="mymenu" @click="getMenu(item)">
                <v-list-item-action>
                  <v-icon small>{{ item.icon }}</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title v-text="item.title" />
                </v-list-item-content>
              </v-list-item>
            </template>
          </template>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-spacer />
      <v-menu offset-y min-width="150">
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" icon @click="checkLastLogin">
            <v-avatar>
              <v-icon large>mdi-account-circle</v-icon>
            </v-avatar>
          </v-btn>
        </template>
        <v-list dense max-width="250px">
          <v-list-item class="mymenu">
            <v-list-item-content class="text-center">
              <v-list-item-title>{{
                $cookie.get("userName")
              }}</v-list-item-title>
              <v-list-item-subtitle>
                User Login <br />—
                <span class="caption">{{ lastLog }}</span>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-divider />

          <v-list-item @click="toggleMode">
            <v-list-item-icon>
              <v-icon v-if="!$vuetify.theme.dark">mdi-weather-night</v-icon>
              <v-icon v-else>mdi-weather-sunny</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title style="font-size: 12px">
                <strong
                  v-text="'Mode ' + (!$vuetify.theme.dark ? 'gelap' : 'terang')"
                ></strong>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-divider />

          <v-list-item @click="logout">
            <v-list-item-icon>
              <v-icon>mdi-logout</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title style="font-size: 12px"
                >Keluar</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-main>
      <!-- snackbar -->
      <div class="text-center">
        <v-snackbar
          v-model="snackbar"
          right
          top
          color="primary"
          :timeout="timeout"
        >
          {{ $store.state.infoText }}

          <template v-slot:action="{ attrs }">
            <v-btn color="yellow" text v-bind="attrs" @click="snackbar = false">
              Close
            </v-btn>
          </template>
        </v-snackbar>
      </div>

      <v-container fluid class="pl-6 pr-6">
        <v-alert
          v-if="$store.state.errorText != ''"
          type="error"
          dense
          transition="scale-transition"
          dismissible
        >
          <v-row align="center">
            <v-col class="grow"> error : {{ $store.state.errorText }} </v-col>
          </v-row>
        </v-alert>
        <header-page :setPageTitle="pageTitle" :setPageIcon="pageIcon" />
        <v-divider class="pt-3" />
        <Nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import HeaderPage from "@/components/layout/HeaderPage";
import menu from "@/data/menu.json";
export default {
  components: {
    HeaderPage,
  },
  props: {
    userLogin: String,
  },
  created() {
    this.getAllMenu();
    this.$vuetify.theme.dark = this.$cookie.get("dark");
    if (this.$cookie.get("auth") == "") {
      this.$router.push("/auth/login");
    }
  },
  data() {
    return {
      nameApp: "Test Logique",
      text: "My timeout is set to 2000.",
      timeout: 2000,
      selectedItem: 0,
      clipped: false,
      drawer: true,
      fixed: false,
      pageTitle: "Dashboard",
      pageIcon: "",
      lastLog: "",
      items: menu,
      allMenu: [],
      miniVariant: true,
      right: true,
      rightDrawer: false,
      backHistory: false,
      dataPageIcon: "",
      dataPageTitle: "",
    };
  },
  computed: {
    snackbar: {
      get() {
        return this.$store.state.snackbar;
      },

      set(nv) {
        this.$store.commit("setSnackbar", nv);
      },
    },
  },
  methods: {
    confirmOke() {
      this.$store.commit("setConfirmOke", 1);
    },
    fetchEventsList() {
      //this.lastLogin();
    },
    title() {
      let route = this.currentLayoutRoute();
      return route.name || "";
    },
    subtitle() {
      let route = this.currentLayoutRoute();
      return route.subname || "";
    },
    icon() {
      let route = this.currentLayoutRoute();
      return route.icon || "mdi-cube-outline";
    },
    toggleMode() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      this.$cookie.set("dark", this.$vuetify.theme.dark);
    },
    async logout() {
      this.$store.commit("clearAuth");
      this.$router.push("/auth/login");
      this.$cookie.set("lastLogin", "");
    },
    getMenu(nv) {
      this.$store.commit("setErrorText", "");
      if (typeof this.selectedItem === 'undefined') {
        setTimeout(() => {
          this.selectedItem = Number(nv.no);
        }, 300);
      }else{
        setTimeout(() => {
          this.selectedItem = Number(nv.no);
        }, 350);
      }
      this.$router.push(`${nv.to}`);
    },
    checkLastLogin() {
      let moment = this.$moment;
      let a = moment(new Date());
      let b = moment(this.$cookie.get("lastLogin"));
      let lastLoginUser = "";
      if (a.diff(b, "minutes") < 1) {
        let getLastLogin = a.diff(b, "seconds");
        lastLoginUser = getLastLogin + " detik yang lalu";
      } else if (a.diff(b, "minutes") > 0 && a.diff(b, "minutes") < 60) {
        let getLastLogin = a.diff(b, "minutes");
        lastLoginUser = getLastLogin + " menit yang lalu";
      } else if (a.diff(b, "minutes") >= 60) {
        let getLastLogin = a.diff(b, "hours");
        lastLoginUser = getLastLogin + " jam yang lalu";
      }
      this.lastLog = lastLoginUser;
    },
    filterRoute(item) {
      let newOpd = this.allMenu.filter(function (el) {
        return el.to.includes(item);
      });
      return newOpd;
    },
    getRoute() {
      let url = this.$route.path;
      let newUrl = this.filterRoute(url);

      let urlFirst = url.split("/");
      let filterMenu = this.allMenu;
      let getTo = filterMenu.filter(function (el) {
        return el.to.includes(url);
      });
      let getNo = filterMenu.filter(function (el) {
        return el.name.includes(urlFirst[1]);
      });
      if (newUrl.length === 0) {
        //console.log(1);
        this.backHistory = false;
        this.pageIcon = "mdi-arrow-left-circle";
        this.pageTitle = "Edit Data " + urlFirst[1];
        this.selectedItem = getNo[0] !== undefined ? Number(getNo[0].no) : "";
      } else {
        //console.log(2);
        this.dataPageIcon = getTo[0].icon;
        this.backHistory = true;
        this.pageIcon = this.dataPageIcon;
        this.pageTitle = getTo[0].title;
        this.selectedItem = Number(getNo[0].no);
      }
    },
    getAllMenu: function () {
      this.allMenu = this.filterMenu();
      this.getRoute();
    },
    filterMenu: function () {
      let menuFiltered = [];
      let menu = this.items;
      for (let i in menu) {
        if (menu[i].role.includes(this.$cookie.get("userRole"))) {
          menuFiltered.push(menu[i]);
        }
      }
      for (let s in menuFiltered) {
        menuFiltered[s].no = s;
      }
      //console.log("mm", menuFiltered);
      return menuFiltered;
    },
  },
  watch: {
    $route() {
      this.getRoute();
    },
  },
};
</script>

<style lang="scss">
.theme--light {
  .v-main__wrap {
    background: #fafafa;
  }
}
html {
  overflow-y: auto !important;
}
body {
  font-family: Tahoma, Geneva, Verdana, sans-serif;
  font-size: 12px;
  font-weight: normal;
}
#title-text {
  font-size: 1.25rem !important;
  font-weight: 500;
  letter-spacing: 0.0125em !important;
  font-family: "Roboto", sans-serif !important;
}

.mymenu .v-list-item__action:first-child,
.v-application--is-ltr .v-list-item__icon {
  margin-right: 2px;
  font-size: 5px !important;
}

.mymenu .v-list-item__title {
  align-self: center;
  font-size: 12px;
  font-weight: 500;
  font-family: "Roboto", sans-serif !important;
}
.v-navigation-drawer {
  &__content {
    scrollbar-width: thin;

    // track
    &::-webkit-scrollbar-track {
      background: #f0f0f0;
    }

    // handle
    &::-webkit-scrollbar-thumb {
      background: #cdcdcd;
      border-radius: 50px;
    }

    // scrollbar
    &::-webkit-scrollbar {
      width: 5px;
      background-color: #f0f0f0;
    }

    // handle on hover
    &::-webkit-scrollbar-thumb:hover {
      background: #a6a6a6;
    }
  }

  .v-list-item {
    &--link {
      opacity: 0.7;
      border-radius: 0px !important;
      margin-left: 1px;
      margin-right: -8px;
      padding-left: 16px;
      padding-right: 16px;

      &::before {
        margin-top: 10px;
        margin-bottom: 10px;
        width: 15px;
        left: -8px;
        border-radius: 0 5px 5px 0;
        color: #26c6da;
      }

      &:hover::before {
        opacity: 0.2;
      }

      &.v-list-item--active {
        opacity: 1;
        &:hover::before,
        &::before {
          opacity: 1;
        }
      }
    }
  }
}
</style>
<style>
@import "@/assets/main.css";
</style>