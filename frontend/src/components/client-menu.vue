<template>
  <v-menu>
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" size="small" icon="mdi-dots-horizontal" variant="text"></v-btn>
    </template>

    <v-list :lines="false" density="compact" nav>
      <v-list-item prepend-icon="mdi-arrow-right" :to="`/clients/view?id=${selectedClient.id}`">
        <v-list-item-title>View</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
  import { defineComponent, computed } from "vue";
  import { useStore } from "@/store";

  import type { Client } from "@/interfaces";

  export default defineComponent({
    name: "ClientMenu",

    props: {
      client: {
        type: Object as () => Client,
        default: {} as Client
      }
    },

    setup(props) {
      const store = useStore();
      const selectedClient = computed<Client>(() => props.client);

      return {
        store,
        selectedClient
      };
    }
  });
</script>
