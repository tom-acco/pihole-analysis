<template>
  <v-text-field v-model="localValue" :readonly="!isEditing" :loading="loading" :disabled="loading" :label="label" hide-details>
    <template v-slot:append-inner>
      <v-chip v-if="!isEditing && !disabled" class="ml-2" variant="outlined" color="blue-darken-2" @click="startEdit" label>
        <v-icon icon="mdi-pencil" ></v-icon>
      </v-chip>

      <template v-else>
        <v-chip class="ml-2" variant="outlined" color="green-darken-2" :disabled="loading" @click="handleSave" label>
          <v-icon icon="mdi-check"></v-icon>
        </v-chip>

        <v-chip class="ml-2" variant="outlined" color="red-darken-2" :disabled="loading" @click="cancelEdit" label>
          <v-icon icon="mdi-close"></v-icon>
        </v-chip>
      </template>
    </template>
  </v-text-field>
</template>

<script lang="ts">
  import { defineComponent, ref, watch } from "vue";

  export default defineComponent({
    name: "EditableTextField",

    props: {
      modelValue: {
        type: String,
        default: ""
      },
      label: {
        type: String,
        default: "Value"
      },
      loading: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },

    emits: ["update:modelValue", "save"],

    setup(props, { emit }) {
      const isEditing = ref(false);
      const localValue = ref("");
      const originalValue = ref("");

      // Initialize value when prop changes
      watch(
        () => props.modelValue,
        (newValue) => {
          localValue.value = newValue;
          originalValue.value = newValue;
        },
        { immediate: true }
      );

      const startEdit = () => {
        isEditing.value = true;
        originalValue.value = localValue.value;
      };

      const cancelEdit = () => {
        isEditing.value = false;
        localValue.value = originalValue.value;
      };

      const handleSave = () => {
        if (localValue.value === originalValue.value) {
          isEditing.value = false;
          return;
        }

        // Emit the save event with the new value and callbacks
        emit("save", {
          value: localValue.value,
          onSuccess: () => {
            originalValue.value = localValue.value;
            isEditing.value = false;
            emit("update:modelValue", localValue.value);
          },
          onError: () => {
            localValue.value = originalValue.value;
          }
        });
      };

      return {
        isEditing,
        localValue,
        startEdit,
        cancelEdit,
        handleSave
      };
    }
  });
</script>
