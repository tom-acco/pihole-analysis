<template>
  <v-container class="pa-0 ma-0" fluid>
    <v-row>
      <v-col class="py-0" cols="12">
        <v-card>
          <v-card-title>
            <span class="text-h6">Domain List</span>
          </v-card-title>
          <v-card-text>
            <domain-list :api-method="api.getDomains" v-model:items="store.cache.domains.items" v-model:total="store.cache.domains.total"></domain-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
  import { useStore } from "@/store";

  import api from "@/api/domains";

  import DomainList from "@/components/domain-list.vue";

  export default {
    components: {
      DomainList
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
