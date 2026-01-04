<template>
  <v-card>
    <v-card-title>Domain Clients</v-card-title>

    <v-card-text>
      <v-sheet color="rgba(0, 0, 0, .12)">
        <v-container fluid>
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="filter" placeholder="Search" append-inner-icon="mdi-magnify" density="compact" hide-details clearable />
              <v-data-table
                v-model="selectedClient"
                color="primary"
                :headers="headers"
                :items="items"
                :search="filter"
                :sort-by="defaultSort"
                :items-per-page="5"
                select-strategy="single"
                show-select
                return-object
              >
                <template v-slot:item.actions="{ item }">
                  <client-menu :client="item"></client-menu>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-container>
      </v-sheet>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
  import { defineComponent, ref, computed } from "vue";
  import { useStore } from "@/store";

  import type { Client } from "@/interfaces";

  import type { DataTableHeader } from "vuetify";
  import type { DataTableSortItem } from "vuetify";

  import ClientMenu from "@/components/client-menu.vue";

  export default defineComponent({
    name: "DomainClients",

    components: {
      ClientMenu
    },

    props: {
      modelValue: {
        type: Array as () => Client[],
        default: [] as Client[]
      },
      items: {
        type: Array as () => Client[],
        default: [] as Client[]
      }
    },

    emits: ["update:modelValue"],

    setup(props, { emit }) {
      const store = useStore();

      const filter = ref("");
      const headers = ref<DataTableHeader[]>([
        { title: "IP Address", key: "ipaddress" },
        {
          title: "Alias",
          key: "alias"
        },
        {
          title: "Count",
          key: "queryCount",
          value: (v) => v.Queries.length
        },
        { title: "", key: "actions", align: "end", sortable: false }
      ]);
      const defaultSort = ref<DataTableSortItem[]>([{ key: "queryCount", order: "desc" }]);

      const selectedClient = computed<Client[]>({
        get() {
          return props.modelValue;
        },
        set(value) {
          emit("update:modelValue", value);
        }
      });

      return {
        store,
        filter,
        headers,
        defaultSort,
        selectedClient
      };
    }
  });
</script>
