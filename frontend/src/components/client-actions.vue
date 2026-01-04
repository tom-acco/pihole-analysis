<template>
  <v-card>
    <v-card-text>
      <v-container class="pa-0" fluid>
        <v-row>
          <v-col cols="3">
            <v-btn variant="outlined" color="blue-darken-2" prepend-icon="mdi-card-account-details" block>Alias</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
  import { defineComponent, computed } from "vue";
  import { useStore } from "@/store";

  import type { Client } from "@/interfaces";

  export default defineComponent({
    name: "ClientActions",

    props: {
      modelValue: {
        type: Object as () => Client,
        default: {} as Client
      }
    },

    setup(props) {
      const store = useStore();
      const selectedClient = computed<Client>(() => props.modelValue);

      return {
        store,
        selectedClient
      };
    }
  });
</script>
