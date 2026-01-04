<template>
  <v-rating v-model="rating" :length="3" :size="15" :color="colour" empty-icon="mdi-rectangle-outline" full-icon="mdi-rectangle" readonly></v-rating>
</template>

<script lang="ts">
  import { defineComponent, computed } from "vue";

  export default defineComponent({
    name: "RiskRating",

    props: {
      modelValue: {
        type: Number,
        default: 0
      }
    },

    setup(props) {
      const rating = computed<number>({
        get() {
          return props.modelValue || 0;
        },
        set(value) {
          return value;
        }
      });

      const colour = computed<string>(() => {
        if (rating.value === 1) return "green";
        if (rating.value === 2) return "orange";
        if (rating.value === 3) return "red";
        return "grey";
      });

      return {
        rating,
        colour
      };
    }
  });
</script>
