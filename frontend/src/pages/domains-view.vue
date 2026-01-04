<template>
  <v-skeleton-loader v-if="loading" type="article"></v-skeleton-loader>

  <v-container v-else class="pa-0 ma-0" fluid>
    <v-row>
      <v-col class="py-0" cols="12">
        <domain-info v-model="domain"></domain-info>
      </v-col>

      <v-col class="py-0" cols="12">
        <domain-actions v-model="domain"></domain-actions>
      </v-col>

      <v-col class="py-0" cols="12">
        <domain-clients v-model="selectedClients" :items="domain.Clients"></domain-clients>
      </v-col>

      <v-col class="py-0" v-if="selectedClients.length === 0" cols="12">
        <v-container fluid>
          <v-row>
            <v-col cols="12">
              <v-alert type="info" variant="outlined"> Select a client from the table above to see more details. </v-alert>
            </v-col>
          </v-row>
        </v-container>
      </v-col>

      <v-col class="py-0" v-if="selectedClients.length >= 1" cols="12">
        <client-info v-model="selectedClient"></client-info>
      </v-col>
      <v-col class="py-0" v-if="selectedClients.length >= 1" cols="12">
        <client-actions v-model="selectedClient"></client-actions>
      </v-col>
      <v-col class="py-0" v-if="selectedClients.length >= 1" cols="12">
        <query-count-line v-model="selectedClient.Queries" :key="selectedClient.id"></query-count-line>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
  import { ref, onMounted } from "vue";
  import { useRoute } from "vue-router";
  import { useStore } from "@/store";

  import api from "@/api/domains";

  import type { Client, Domain } from "@/interfaces";

  import DomainInfo from "@/components/domain-info.vue";
  import DomainActions from "@/components/domain-actions.vue";
  import DomainClients from "@/components/domain-clients.vue";
  import ClientInfo from "@/components/client-info.vue";
  import ClientActions from "@/components/client-actions.vue";
  import QueryCountLine from "@/components/query-count-line.vue";

  export default {
    components: {
      DomainInfo,
      DomainActions,
      DomainClients,
      ClientInfo,
      ClientActions,
      QueryCountLine
    },

    setup() {
      const route = useRoute();
      const store = useStore();

      const loading = ref(true);
      const domain = ref<Domain>({} as Domain);

      const selectedClients = ref<Client[]>([]);
      const selectedClient = computed<Client>({
        get() {
          return selectedClients.value?.[0] ?? ({} as Client);
        },
        set(value) {
          if (!value || !selectedClients.value) return;
          selectedClients.value = [value, ...selectedClients.value.slice(1)];
        }
      });

      const getDomain = async () => {
        domain.value = await api.getDomain(route.query.id as string);
      };

      onMounted(async () => {
        loading.value = true;

        await getDomain();

        setTimeout(() => {
          loading.value = false;
        }, store.debounceMs);
      });

      return {
        store,
        loading,
        domain,
        selectedClients,
        selectedClient
      };
    }
  };
</script>
