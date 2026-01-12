<template>
  <v-skeleton-loader v-if="loading" type="article"></v-skeleton-loader>

  <v-container v-else class="pa-0 ma-0" fluid>
    <v-row>
      <v-col class="py-0" cols="12">
        <client-info v-model="client"></client-info>
      </v-col>

      <v-col class="py-0" cols="12">
        <client-domains v-model="selectedDomains" :items="client.Domains"></client-domains>
      </v-col>

      <v-col class="py-0" v-if="selectedDomains.length === 0" cols="12">
        <v-container fluid>
          <v-row>
            <v-col cols="12">
              <v-alert type="info" variant="outlined"> Select a domain from the table above to see more details. </v-alert>
            </v-col>
          </v-row>
        </v-container>
      </v-col>

      <v-col class="py-0" v-if="selectedDomains.length >= 1" cols="12">
        <domain-info v-model="selectedDomain"></domain-info>
      </v-col>

      <v-col class="py-0" v-if="selectedDomains.length >= 1" cols="12">
        <domain-actions v-model="selectedDomain"></domain-actions>
      </v-col>

      <v-col class="py-0" v-if="selectedDomains.length >= 1" cols="12">
        <query-count-line v-model="selectedDomain.Queries" :key="selectedDomain.id"></query-count-line>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
  import { ref, computed, onMounted } from "vue";
  import { useRoute } from "vue-router";
  import { useStore } from "@/store";

  import api from "@/api/clients";

  import type { Client, Domain } from "@/interfaces";

  import ClientInfo from "@/components/client-info.vue";
  import ClientDomains from "@/components/client-domains.vue";
  import DomainInfo from "@/components/domain-info.vue";
  import DomainActions from "@/components/domain-actions.vue";
  import QueryCountLine from "@/components/query-count-line.vue";

  export default {
    components: {
      ClientInfo,
      ClientDomains,
      DomainInfo,
      DomainActions,
      QueryCountLine
    },

    setup() {
      const route = useRoute();
      const store = useStore();

      const loading = ref(true);
      const client = ref<Client>({} as Client);
      const selectedDomains = ref<Domain[]>([]);
      const selectedDomain = computed<Domain>({
        get() {
          return selectedDomains.value?.[0] ?? ({} as Domain);
        },
        set(value) {
          if (!value || !selectedDomains.value) return;
          selectedDomains.value = [value, ...selectedDomains.value.slice(1)];
        }
      });

      const getClient = async () => {
        const id = route.query.id;

        if (!id || typeof id !== 'string') {
          throw new Error('Invalid or missing client ID');
        }

        client.value = await api.getClient(id);
      };

      onMounted(async () => {
        loading.value = true;

        try {
          await getClient();
        } catch (err) {
          console.error('Failed to load client:', err);
          // Optionally redirect back to clients list
          // router.push({ name: 'main.clients' });
        } finally {
          setTimeout(() => {
            loading.value = false;
          }, store.debounceMs);
        }
      });

      return {
        store,
        loading,
        client,
        selectedDomains,
        selectedDomain
      };
    }
  };
</script>
