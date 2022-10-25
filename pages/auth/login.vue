<template>
  <v-main>
    <div class="bg-image"></div>
    <v-snackbar
      v-model="snackbar"
      :timeout="timeout"
      color="red accent-2"
      :right=true
      :top=true
    >
      {{ text }}

      <template v-slot:action="{ attrs }">
        <v-btn
          color="white"
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
      <v-form class="fill-height" style="padding-top:13%;" ref="form" lazy-validation>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="5">
            <v-card class="elevation-12">
              <v-row no-gutters>
                <v-col
                  cols="12"
                  md="4"
                  class="flex-grow-1 flex-shrink-0 logo"
                ></v-col>
                <v-col cols="12" md="8" class="flex-grow-1 flex-shrink-0">
                  <v-card-title>
                    <v-icon color="success" left>mdi-lock</v-icon>SIPTL
                  </v-card-title>
                  <v-card-subtitle
                    >Silahkan lengakapi form dibawah ini untuk mengakses
                    aplikasi</v-card-subtitle
                  >
                  <v-card-text>
                    <v-text-field
                      ref="username"
                      v-model="username"
                      label="Username"
                      placeholder="Username"
                      name="login"
                      type="text"
                      class="mb-3"
                      hide-details="auto"
                      outlined
                      :rules="rules.select"
                      :persistent-placeholder="true"
                    ></v-text-field>

                    <v-text-field
                      ref="password"
                      v-model="password"
                      label="Password"
                      placeholder="Password"
                      type="password"
                      class="mb-3"
                      hide-details="auto"
                      outlined
                      :rules="rules.pwd"
                      :persistent-placeholder="true"
                    ></v-text-field>

                    <v-btn @click="login" :disabled="invalid">
                      <v-icon left>mdi-login</v-icon>Masuk
                    </v-btn>
                    <div class="caption mt-4 grey--text">
                      Inspektorat Daerah &mdash; Kota Bontang &mdash; Development
                      Version
                    </div>
                  </v-card-text>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-form>
  </v-main>
</template>

<script>
import menu from "@/data/menu.json";
export default {
  name: "Login",
  layout: "nologin",

  data() {
    return {
      loginDone: false,
      valid: true,
      loginMsg: "",
      username: "",
      password: "",
      invalid: false,
      loading: false,
      menu: menu,
      rules: {
        select: [(v) => !!v || "Username harus diisi"],
        pwd: [(v) => !!v || "Password harus diisi"],
      },
      snackbar: false,
      text: '',
      timeout: 2000,
    };
  },
  created() {
    this.$vuetify.theme.dark = this.$cookie.get("dark");
  },
  mounted() {
    this.$nextTick(() => this.$refs.username.focus());
  },
  methods: {
    login: async function() {
      if(this.$refs.form.validate()){
      this.loading = true;
      this.$axios({
        method: "POST",
        url: "/api/auth",
        data: {
          username: this.username,
          password: this.password,
        },
      }).then(
        (r) => {
          let data = r.data.Data;
          this.$cookie.set("userRole", data.Role);
          this.$cookie.set("groupId", data.GroupID);
          this.$cookie.set("lastLogin", data.LastLogin);
          let getData = {
            Token: data.Token,
            Name: data.Name,
          };
          this.redir(getData);
        }
      ).catch((e) => {
          if(e.message === 'Request failed with status code 500'){
            this.text = "Username atau password salah"
          }else{
            this.text = e.message
          }
          this.snackbar = true;
        })
        .finally(() => {
          this.loading = false;
        });
      }
    },
    redir(data) {
      this.$store.commit("setAuth", data);
      const source = this.$route.query.source;
      this.$router.push(source == undefined || source == "" ? this.checkRole() : source);
    },
    checkRole: function(){
      let url = ""
      let menu  = this.menu
      for(let i in menu){
        if(menu[i].role.includes(this.$cookie.get('userRole'))){
          url = menu[i].to
          break;
        }
      }
      return url
    }
  }
};
</script>

<style scope>
html {
  overflow: hidden;
}
.logo {
  background: url("../../static/logo-siptl.jpeg") no-repeat center center;
  background-size: 80%;
  border-right: solid thin #ddd;
}
.bg-image {
  background: url("../../static/bg.jpg") no-repeat center center;
  background-size: cover;
  filter: blur(8px);
  -webkit-filter: blur(8px);
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>