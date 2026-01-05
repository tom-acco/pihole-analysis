<template>
  <v-menu>
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" size="small" icon="mdi-dots-horizontal" variant="text"></v-btn>
    </template>

    <v-list :lines="false" density="compact" nav>
      <v-list-item prepend-icon="mdi-arrow-right" :to="`/domains/view?id=${selectedDomain.id}`">
        <v-list-item-title>View</v-list-item-title>
      </v-list-item>
      <v-list-item prepend-icon="mdi-search-web" @click="store.interrogateDomain(selectedDomain)">
        <v-list-item-title>Interrogate</v-list-item-title>
      </v-list-item>
      <v-list-item prepend-icon="mdi-check" @click="store.toggleDomainAcknowledge(selectedDomain)">
        <v-list-item-title>Acknowledge</v-list-item-title>
      </v-list-item>
      <v-list-item :prepend-icon="selectedDomain.flagged ? 'mdi-flag-off' : 'mdi-flag'" @click="store.toggleDomainFlag(selectedDomain)">
        <v-list-item-title>{{ selectedDomain.flagged ? "Unflag" : "Flag" }}</v-list-item-title>
      </v-list-item>
      <v-list-item :prepend-icon="selectedDomain.ignored ? 'mdi-eye' : 'mdi-eye-off'" @click="store.toggleDomainIgnore(selectedDomain)">
        <v-list-item-title>{{ selectedDomain.ignored ? "Unignore" : "Ignore" }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
  import { defineComponent, computed } from "vue";
  import { useStore } from "@/store";

  import type { Domain } from "@/interfaces";

  export default defineComponent({
    name: "DomainMenu",

    props: {
      domain: {
        type: Object as () => Domain,
        default: {} as Domain
      }
    },

    setup(props) {
      const store = useStore();
      const selectedDomain = computed<Domain>(() => props.domain);

      return {
        store,
        selectedDomain
      };
    }
  });
</script>
