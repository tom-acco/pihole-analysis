<template>
  <v-data-table color="primary" :loading="loading" :headers="headers" :items="syncList" :sort-by="defaultSort" :items-per-page="5">
    <template v-slot:item.status="{ item }">
      <v-icon v-if="item.status == 0" color="grey-darken-2" icon="mdi-clock"></v-icon>
      <v-progress-circular v-if="item.status == 1" color="primary" size="21" indeterminate></v-progress-circular>
      <v-icon v-if="item.status == 2" color="green-darken-2" icon="mdi-check-circle"></v-icon>
      <v-icon v-if="item.status == 3" color="red-darken-2" icon="mdi-close-circle"></v-icon>
    </template>
  </v-data-table>
</template>

<script lang="ts">
  import { defineComponent, ref, onMounted } from "vue";
  import { toast } from "vue3-toastify";
  import { useStore } from "@/store";

  import type { Sync } from "@/interfaces";

  import type { DataTableHeader } from "vuetify";
  import type { DataTableSortItem } from "vuetify";

  export default defineComponent({
    name: "SyncLog",

    props: {
      apiMethod: {
        type: Function,
        required: true
      },
      items: {
        type: Array as () => Sync[],
        default: [] as Sync[]
      }
    },

    setup(props, { emit }) {
      const store = useStore();

      const loading = ref(false);
      const headers = ref<DataTableHeader[]>([
        {
          title: "",
          key: "status"
        },
        {
          title: "Started",
          key: "startTime",
          value: (v) => new Date(v.startTime).toLocaleString()
        },
        {
          title: "Finished",
          key: "endTime",
          value: (v) => (v.endTime ? new Date(v.endTime).toLocaleString() : "")
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

      const syncList = computed<Sync[]>({
        get() {
          return props.items;
        },
        set(value) {
          emit("update:items", value);
        }
      });
      const defaultSort = ref<DataTableSortItem[]>([{ key: "startTime", order: "desc" }]);

      const get = async () => {
        try {
          const items = await props.apiMethod();
          syncList.value = items;
        } catch (err: any) {
          toast.error(err);
        } finally {
          setTimeout(async () => {
            await get();
          }, 30000);
        }
      };

      onMounted(async () => {
        loading.value = true;

        setTimeout(async () => {
          try {
            await get();
          } catch (err: any) {
            toast.error(err);
          } finally {
            loading.value = false;
          }
        }, store.debounceMs);
      });

      return {
        store,
        loading,
        headers,
        syncList,
        defaultSort
      };
    }
  });
</script>
