<template>
  <v-tooltip text="Interrogate All">
    <template v-slot:activator="{ props }">
      <v-chip class="ml-2" v-bind="props" variant="outlined" color="blue-darken-2" @click="store.interrogateDomain(domains)" label>
        <v-icon icon="mdi-search-web"></v-icon>
      </v-chip>
    </template>
  </v-tooltip>

  <v-tooltip text="Acknowledge All">
    <template v-slot:activator="{ props }">
      <v-chip class="ml-2" v-bind="props" variant="outlined" color="green-darken-2" @click="store.setDomainAcknowledge(domains, true)" label>
        <v-icon icon="mdi-check"></v-icon>
      </v-chip>
    </template>
  </v-tooltip>
</template>

<script lang="ts">
  import { defineComponent, computed } from "vue";
  import { useStore } from "@/store";

  import type { Domain } from "@/interfaces";

  export default defineComponent({
    name: "DashboardActions",

    props: {
      modelValue: {
        type: Array as () => Domain[],
        default: [] as Domain[]
      }
    },

    setup(props) {
      const store = useStore();
      const domains = computed<Domain[]>(() => props.modelValue);

      return {
        store,
        domains
      };
    }
  });
</script>
