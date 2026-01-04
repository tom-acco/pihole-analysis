<template>
  <v-container class="pa-0 ma-0" fluid>
    <v-row>
      <v-col class="py-0" cols="12">
        <v-card>
          <v-card-title>
            <v-row>
              <v-col cols="6">
                <span class="text-h6">Domain List</span>
              </v-col>
              <v-col class="text-right" cols="6">
                <domain-list-actions v-model="store.cache.domains.items"></domain-list-actions>
              </v-col>
            </v-row>
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
  import DomainListActions from "@/components/domain-list-actions.vue";

  export default {
    components: {
      DomainList,
      DomainListActions
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
