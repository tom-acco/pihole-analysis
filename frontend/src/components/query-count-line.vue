<template>
  <v-card>
    <v-card-title>Domain Queries</v-card-title>
    <v-card-text>
      <v-container class="pa-0" fluid>
        <v-row>
          <v-col cols="12">
            <v-sheet color="rgba(0, 0, 0, .12)">
              <v-sparkline :model-value="counts" :labels="days" :label-size="4" line-width="0.5" height="40" smooth auto-draw> </v-sparkline>
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

  import type { Query } from "@/interfaces";

  export default defineComponent({
    name: "QueryCountLine",

    props: {
      modelValue: {
        type: Array as () => Query[],
        default: [] as Query[]
      }
    },

    setup(props) {
      const store = useStore();

      // Compute days and counts directly from props.modelValue
      const { days, counts } = computed(() => {
        const map: Record<string, number> = {};

        props.modelValue.forEach((q) => {
          const day = q.timestamp.slice(0, 10); // YYYY-MM-DD
          map[day] = (map[day] || 0) + 1;
        });

        const allDates = Object.keys(map).sort();
        if (allDates.length === 0) return { days: [], counts: [] };

        const startDate = new Date(allDates[0]!);
        const endDate = new Date(allDates[allDates.length - 1]!);

        const dayList: string[] = [];
        const countList: number[] = [];

        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
          const iso = d.toISOString().slice(0, 10);
          const day = String(d.getDate()).padStart(2, "0");
          const month = String(d.getMonth() + 1).padStart(2, "0");

          dayList.push(`${day}/${month}`);
          countList.push(map[iso] ?? 0); // fill missing days with 0
        }

        return { days: dayList, counts: countList };
      }).value;

      return {
        store,
        days,
        counts
      };
    }
  });
</script>
