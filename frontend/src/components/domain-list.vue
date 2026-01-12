<template>
  <v-text-field v-model="filter" placeholder="Search" append-inner-icon="mdi-magnify" density="compact" hide-details clearable />

  <v-data-table-server
    :loading="loading"
    :headers="headers"
    :items="domainList"
    :items-length="domainCount"
    :search="filter"
    :sort-by="defaultSort"
    @update:options="get"
  >
    <template v-slot:item.status="{ item }">
      <v-tooltip v-if="item.flagged" text="Flagged">
        <template v-slot:activator="{ props }">
          <v-icon class="mr-2" v-bind="props" color="red-darken-2" icon="mdi-flag"></v-icon>
        </template>
      </v-tooltip>

      <v-tooltip v-else :text="item.acknowledged ? 'Acknowledged' : 'New'">
        <template v-slot:activator="{ props }">
          <v-icon
            class="mr-2"
            v-bind="props"
            :color="item.acknowledged ? 'green-darken-2' : 'orange-darken-2'"
            :icon="item.acknowledged ? 'mdi-check' : 'mdi-alert-circle-outline'"
          ></v-icon>
        </template>
      </v-tooltip>
    </template>

    <template v-slot:item.risk="{ item }">
      <risk-rating v-if="item.risk !== null" v-model="item.risk" />
    </template>

    <template v-slot:item.actions="{ item }">
      <domain-menu :domain="item"></domain-menu>
    </template>
  </v-data-table-server>
</template>

<script lang="ts">
  import { defineComponent, ref, computed } from "vue";
  import { toast } from "vue3-toastify";
  import { useStore } from "@/store";

  import type { DataTableHeader } from "vuetify";
  import type { DataTableSortItem } from "vuetify";
  import type { DataTableParams, Domain } from "@/interfaces";

  import RiskRating from "@/components/risk-rating.vue";
  import DomainMenu from "@/components/domain-menu.vue";

  export default defineComponent({
    name: "DomainServerList",

    components: {
      RiskRating,
      DomainMenu
    },

    props: {
      apiMethod: {
        type: Function,
        required: true
      },
      items: {
        type: Array as () => Domain[],
        default: [] as Domain[]
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
        {
          title: "",
          key: "status"
        },
        { title: "Domain", key: "domain" },
        {
          title: "Owner",
          key: "owner"
        },
        {
          title: "Category",
          key: "category"
        },
        {
          title: "Risk",
          key: "risk"
        },
        {
          title: "Count",
          key: "queryCount"
        },
        { title: "", key: "actions", align: "end", sortable: false }
      ]);
      const defaultSort = ref<DataTableSortItem[]>([{ key: "queryCount", order: "desc" }]);

      const domainList = computed<Domain[]>({
        get() {
          return props.items;
        },
        set(value) {
          emit("update:items", value);
        }
      });

      const domainCount = computed<number>({
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
            domainCount.value = total;
            domainList.value = items;
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
        domainList,
        domainCount,
        get
      };
    }
  });
</script>
