<template>
  <v-card>
    <v-card-text>
      <v-container class="pa-0" fluid>
        <v-row>
          <v-col cols="3">
            <v-btn variant="outlined" color="blue-darken-2" prepend-icon="mdi-search-web" @click="store.interrogateDomain(selectedDomain)" block
              >Interrogate</v-btn
            >
          </v-col>

          <v-col cols="3">
            <v-btn
              :variant="selectedDomain.acknowledged ? 'elevated' : 'outlined'"
              color="green-darken-2"
              prepend-icon="mdi-check"
              @click="store.toggleDomainAcknowledge(selectedDomain)"
              block
              >Acknowledge</v-btn
            >
          </v-col>

          <v-col cols="3">
            <v-btn
              :variant="selectedDomain.flagged ? 'elevated' : 'outlined'"
              color="red-darken-2"
              prepend-icon="mdi-flag"
              @click="store.toggleDomainFlag(selectedDomain)"
              block
              >Flag</v-btn
            >
          </v-col>

          <v-col cols="3">
            <v-btn
              :variant="selectedDomain.ignored ? 'elevated' : 'outlined'"
              color="grey-darken-2"
              prepend-icon="mdi-eye-off"
              @click="store.toggleDomainIgnore(selectedDomain)"
              block
              >Ignore</v-btn
            >
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
  import { defineComponent, computed } from "vue";
  import { useStore } from "@/store";

  import type { Domain } from "@/interfaces";

  export default defineComponent({
    name: "DomainActions",

    props: {
      modelValue: {
        type: Object as () => Domain,
        default: {} as Domain
      }
    },

    setup(props) {
      const store = useStore();
      const selectedDomain = computed<Domain>(() => props.modelValue);

      return {
        store,
        selectedDomain
      };
    }
  });
</script>
