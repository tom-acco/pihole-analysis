<template>
  <v-data-table color="primary" :loading="loading" :headers="headers" :items="items" :sort-by="defaultSort" :items-per-page="5"> </v-data-table>
</template>

<script lang="ts">
  import { defineComponent, ref, onMounted, onUpdated } from "vue";
  import { useStore } from "@/store";

  import api from "@/api/sync";

  import type { Sync } from "@/interfaces";

  import type { DataTableHeader } from "vuetify";
  import type { DataTableSortItem } from "vuetify";

  export default defineComponent({
    name: "SyncLog",

    setup() {
      const store = useStore();

      const loading = ref(false);
      const headers = ref<DataTableHeader[]>([
        {
          title: "Started",
          key: "startTime",
          value: (v) => new Date(v.startTime).toLocaleString()
        },
        {
          title: "Finished",
          key: "endTime",
          value: (v) => new Date(v.endTime).toLocaleString()
        },
        {
          title: "Clients",
          key: "clients"
        },
        {
          title: "Domains",
          key: "domains"
        },
        {
          title: "Queries",
          key: "queries"
        }
      ]);
      const items = ref<Sync[]>([]);
      const defaultSort = ref<DataTableSortItem[]>([{ key: "startTime", order: "desc" }]);

      const getSyncLog = async () => {
        items.value = await api.getLog();
      };

      onMounted(async () => {
        loading.value = true;

        await getSyncLog();

        setTimeout(() => {
          loading.value = false;
        }, store.debounceMs);
      });

      return {
        store,
        loading,
        headers,
        items,
        defaultSort
      };
    }
  });
</script>
