<template>
  <v-card>
    <v-card-title>
      <v-row>
        <v-col cols="6">
          <span class="text-h6">Client Domains</span>
        </v-col>
        <v-col class="text-right" cols="6">
          <domain-list-actions v-model="items"></domain-list-actions>
        </v-col>
      </v-row>
    </v-card-title>

    <v-card-text>
      <v-sheet color="rgba(0, 0, 0, .12)">
        <v-container fluid>
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="filter" placeholder="Search" append-inner-icon="mdi-magnify" density="compact" hide-details clearable />
              <v-data-table
                v-model="selectedDomain"
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

  import type { Domain } from "@/interfaces";

  import type { DataTableHeader } from "vuetify";
  import type { DataTableSortItem } from "vuetify";

  import RiskRating from "@/components/risk-rating.vue";
  import DomainMenu from "@/components/domain-menu.vue";
  import DomainListActions from "@/components/domain-list-actions.vue";

  export default defineComponent({
    name: "ClientDomains",

    components: {
      RiskRating,
      DomainMenu,
      DomainListActions
    },

    props: {
      modelValue: {
        type: Array as () => Domain[],
        default: [] as Domain[]
      },
      items: {
        type: Array as () => Domain[],
        default: [] as Domain[]
      }
    },

    emits: ["update:modelValue"],

    setup(props, { emit }) {
      const store = useStore();

      const filter = ref("");
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
          key: "queryCount",
          value: (v) => v.Queries.length
        },
        { title: "", key: "actions", align: "end", sortable: false }
      ]);
      const defaultSort = ref<DataTableSortItem[]>([{ key: "queryCount", order: "desc" }]);

      const selectedDomain = computed<Domain[]>({
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
        selectedDomain
      };
    }
  });
</script>
