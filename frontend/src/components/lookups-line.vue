<template>
  <v-card>
    <v-card-title>Domain Lookups</v-card-title>

    <v-card-text>
      <v-container class="pa-0" fluid>
        <v-row>
          <v-col cols="12">
            <v-sheet color="rgba(0, 0, 0, .12)">
              <v-sparkline :labels="labels" :label-size="4" :model-value="lookups" line-width="0.5" height="40" smooth auto-draw>
              </v-sparkline>
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
  import { defineComponent, computed } from "vue";
  import { useStore } from "@/store";

  import type { Lookup } from "@/interfaces";

  export default defineComponent({
    name: "LookupsLine",

    props: {
      modelValue: {
        type: Array as () => Lookup[],
        default: [] as Lookup[]
      }
    },

    setup(props, { emit }) {
      const store = useStore();

      const lookups = computed<number[]>({
        get() {
          return props.modelValue.map((o) => {
            return o.count;
          });
        },
        set(value) {
          emit("update:modelValue", value);
        }
      });

      const labels = computed<number[]>({
        get() {
          return props.modelValue.map((o) => {
            return o.count;
          });
        },
        set(value) {
          emit("update:modelValue", value);
        }
      });

      return {
        store,
        lookups,
        labels
      };
    }
  });
</script>
