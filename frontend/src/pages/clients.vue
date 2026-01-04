<template>
  <v-container class="pa-0 ma-0" fluid>
    <v-row>
      <v-col class="py-0" cols="12">
        <v-card>
          <v-card-title>
            <span class="text-h6">Client List</span>
          </v-card-title>
          <v-card-text>
            <client-list :api-method="api.getClients" v-model:items="store.cache.clients.items" v-model:total="store.cache.clients.total"></client-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
  import { useStore } from "@/store";

  import api from "@/api/clients";

  import ClientList from "@/components/client-list.vue";

  export default {
    components: {
      ClientList
    },

    setup() {
      const store = useStore();

      return {
        store,
        api
      };
    }
  };
</script>
