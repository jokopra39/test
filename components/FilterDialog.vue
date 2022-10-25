<template>
  <v-menu
    v-model="filter.dialog"
    :close-on-content-click="false"
    :offset-y="true"
    max-width="300px"
    min-width="300px"
  >
    <template v-slot:activator="{ on }">
      <v-btn
        class="mr-2"
        v-on="on"
        :class="{ 'teal--text': filter.active }"
      >
        <v-icon size="18px">mdi-tune</v-icon>
      </v-btn>
    </template>
    <v-card>
  <v-form ref="form">
    <v-card-title>
      <v-row>
        <v-col>Filter</v-col>
        <v-col class="text-right pr-1">
          <v-btn
            class="mx-2"
            fab
            dark
            x-small
            @click="reset"
            color="grey"
          ><v-icon size="18px">mdi-restart</v-icon></v-btn>
        </v-col>
      </v-row>
    </v-card-title>
    <v-divider />
    <v-card-text>
      <slot name="inputFilter"></slot>
    </v-card-text>
  </v-form>
</v-card>
</v-menu>
</template>

<script>
    export default {
      props: {
        isShow: {
          type: Boolean,
          default: () => {
            return false;
          },
        },
      },
      data: () => ({
        filter: {
            dialog: false,
            active: false
        },
        rulesUsername: {
          required: (value) => !!value || "This field is required.",
        },
        form: {
          Username: "",
          Email: "",
          Name: "",
          Password: "",
          Role: ""
        },
      }),
      methods: {
        reset: function(){
          this.$emit("resetFilter");
        }
      }
    };
    </script>