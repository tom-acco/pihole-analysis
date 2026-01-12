<template>
  <v-text-field v-model="filter" placeholder="Search" append-inner-icon="mdi-magnify" density="compact" hide-details clearable />

  <v-data-table-server
    color="primary"
    :loading="loading"
    :headers="headers"
    :items="clientList"
    :items-length="clientCount"
    :search="filter"
    :sort-by="defaultSort"
    @update:options="get"
  >
    <template v-slot:item.actions="{ item }">
      <client-menu :client="item"></client-menu>
    </template>
  </v-data-table-server>
</template>

<script lang="ts">
  import { defineComponent, ref, computed } from "vue";
  import { toast } from "vue3-toastify";
  import { useStore } from "@/store";

  import type { DataTableHeader } from "vuetify";
  import type { DataTableSortItem } from "vuetify";
  import type { DataTableParams, Client } from "@/interfaces";

  import ClientMenu from "@/components/client-menu.vue";

  export default defineComponent({
    name: "ClientServerList",

    components: {
      ClientMenu
    },

    props: {
      apiMethod: {
        type: Function,
        required: true
      },
      items: {
        type: Array as () => Client[],
        default: [] as Client[]
      },
      total: {
        type: Number as () => number,
        default: 0
      }
    },

    setup(props, { emit }) {
      const store = useStore();

      const loading = ref<boolean>(false);
      const filter = ref<string>("");
      const headers = ref<DataTableHeader[]>([
        { title: "IP Address", key: "ipaddress" },
        {
          title: "Alias",
          key: "alias"
        },
        { title: "", key: "actions", align: "end", sortable: false }
      ]);
      const defaultSort = ref<DataTableSortItem[]>([{ key: "ipaddress", order: "asc" }]);

      const clientList = computed<Client[]>({
        get() {
          return props.items;
        },
        set(value) {
          emit("update:items", value);
        }
      });

      const clientCount = computed<number>({
        get() {
          return props.total;
        },
        set(value) {
          emit("update:total", value);
        }
      });

      let debounce: number | null = null;

      const get = async (params: DataTableParams) => {
        loading.value = true;

        if (debounce) {
          clearTimeout(debounce);
        }

        debounce = setTimeout(async () => {
          try {
            const { total, items } = await props.apiMethod(params);
            clientCount.value = total;
            clientList.value = items;
          } catch (err: any) {
            toast.error(err);
          } finally {
            loading.value = false;
          }
        }, store.debounceMs);
      };

      return {
        store,
        loading,
        filter,
        headers,
        defaultSort,
        clientList,
        clientCount,
        get
      };
    }
  });
</script>
