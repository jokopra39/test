<template>
  <v-app>
    <v-snackbar color="error" top>
      <template v-slot:action>
        <v-btn color="yellow" text> Close </v-btn>
      </template>
    </v-snackbar>

    <v-snackbar color="primary" timeout="2000" top>
      <template v-slot:action>
        <v-btn color="yellow" text> Close </v-btn>
      </template>
    </v-snackbar>

    <nuxt />
  </v-app>
</template>

<script>
export default {
  computed: {
  },

  data() {
    return {
      drawer: true,
      miniDrawer: false,
      clipped: false,
    };
  },

  methods: {
    home() {
      this.$router.push("/");
    },
  },
};
</script>

