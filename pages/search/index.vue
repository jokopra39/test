<template>
    <v-container class="bg">
      <div class="text-center">
        <v-img
          alt="logique"
          class="shrink img-logo"
          contain
          :src="logo"
          transition="scale-transition"
          width="72.2px"
        />
       search
      
    </div>
    </v-container>
  </template>
  <script>
  import Logo from "../../static/logo.png";
  export default {
    name: "index",
    layout: "nologin",
    head() {
      return {
        title: "INDEX",
      };
    },
    data: () => ({
      logo: Logo,
      inputSearch: ""
    }),
    mounted() {
      this.$store.commit("setErrorText", "");
    },
    methods: {
      actionSearch: function(){
        this.$router.push("/auth/login");
        console.log(this.inputSearch)
      }
    }
  };
  </script>
  <style>
  .bg {
    height: 100%;
    padding: 256px 30px 26px;
    background-image: linear-gradient(153deg, #712bda, #a45deb 100%);
  }
  .img-logo {
    margin-left: auto;
    margin-right: auto;
  }
  .inp-search {
    background-color: #fff;
  }
  .space{
    margin-top: 300px;
  }
  .inp{
    text-align: center;
      padding: 8px;
      width: 300px;
      border-radius: 20px;
  }
  .btn-search{
    border: none;
    color: white;
    text-decoration: none;
    background-color: rgba(255, 255, 255, 0.2);
  }
  </style>