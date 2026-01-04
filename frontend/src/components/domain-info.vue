<template>
  <v-card>
    <v-card-title>Domain Information</v-card-title>

    <v-card-text>
      <v-sheet color="rgba(0, 0, 0, .12)">
        <v-container fluid>
          <v-row>
            <v-col cols="12">
              <v-chip
                class="mr-2"
                variant="flat"
                :color="selectedDomain.acknowledged ? 'green-darken-2' : 'orange-darken-2'"
                :prepend-icon="selectedDomain.acknowledged ? 'mdi-check' : 'mdi-alert-circle-outline'"
                label
              >
                {{ selectedDomain.acknowledged ? "Acknowledged" : "New" }}
              </v-chip>

              <v-chip v-if="selectedDomain.flagged" class="mr-2" variant="flat" color="red-darken-2" prepend-icon="mdi-flag" label> Flagged </v-chip>

              <v-chip v-if="selectedDomain.hidden" class="mr-2" variant="flat" color="grey-darken-2" prepend-icon="mdi-eye-off" label> Hidden </v-chip>
            </v-col>

            <v-col cols="12" sm="6">
              <p class="font-weight-bold text-high-emphasis">Domain:</p>
              <p>{{ selectedDomain.domain ?? "N/A" }}</p>
            </v-col>

            <v-col cols="12" sm="6">
              <p class="font-weight-bold text-high-emphasis">Risk Rating:</p>
              <risk-rating v-if="selectedDomain" v-model="selectedDomain.risk" />
            </v-col>

            <v-col cols="12" sm="6">
              <p class="font-weight-bold text-high-emphasis">Category:</p>
              <p>{{ selectedDomain.category ?? "N/A" }}</p>
            </v-col>

            <v-col cols="12" sm="6">
              <p class="font-weight-bold text-high-emphasis">Notes:</p>
              <p>{{ selectedDomain.comment ?? "N/A" }}</p>
            </v-col>
          </v-row>
        </v-container>
      </v-sheet>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
  import { defineComponent, computed } from "vue";

  import type { Domain } from "@/interfaces";

  import RiskRating from "@/components/risk-rating.vue";

  export default defineComponent({
    name: "DomainInfo",

    components: { RiskRating },

    props: {
      modelValue: {
        type: Object as () => Domain,
        default: {} as Domain
      }
    },

    setup(props) {
      const selectedDomain = computed<Domain>(() => props.modelValue);

      return {
        selectedDomain
      };
    }
  });
</script>
