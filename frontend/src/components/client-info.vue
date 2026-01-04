<template>
  <v-card>
    <v-card-title>Client Information</v-card-title>

    <v-card-text>
      <v-sheet color="rgba(0, 0, 0, .12)">
        <v-container fluid>
          <v-row>
            <v-col cols="12" sm="6">
              <p class="font-weight-bold text-high-emphasis">IP Address:</p>
              <p>{{ selectedClient.ipaddress ?? "N/A" }}</p>
            </v-col>

            <v-col cols="12" sm="6">
              <p class="font-weight-bold text-high-emphasis">Alias:</p>
              <p>{{ selectedClient.alias ?? "N/A" }}</p>
            </v-col>
          </v-row>
        </v-container>
      </v-sheet>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
  import { defineComponent, computed } from "vue";

  import type { Client } from "@/interfaces";

  export default defineComponent({
    name: "ClientInfo",

    props: {
      modelValue: {
        type: Object as () => Client,
        default: {} as Client
      }
    },

    setup(props) {
      const selectedClient = computed<Client>(() => props.modelValue);

      return {
        selectedClient
      };
    }
  });
</script>
