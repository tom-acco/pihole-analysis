<template>
  <v-card>
    <v-card-title>Client Information</v-card-title>

    <v-card-text>
      <v-sheet color="rgba(0, 0, 0, .12)">
        <v-container fluid>
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field v-model="ipaddressValue" label="IP Address" readonly hide-details />
            </v-col>

            <v-col cols="12" sm="6">
              <editable-text-field v-model="aliasValue" label="Alias" :loading="loading" @save="handleSave" />
            </v-col>
          </v-row>
        </v-container>
      </v-sheet>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
  import { defineComponent, computed, ref, watch } from "vue";
  import { toast } from "vue3-toastify";

  import clientApi from "@/api/clients";
  import EditableTextField from "@/components/editable-text-field.vue";

  import type { Client } from "@/interfaces";

  export default defineComponent({
    name: "ClientInfo",

    components: {
      EditableTextField
    },

    props: {
      modelValue: {
        type: Object as () => Client,
        default: {} as Client
      }
    },

    emits: ["update:modelValue"],

    setup(props, { emit }) {
      const selectedClient = computed<Client>(() => props.modelValue);

      const loading = ref(false);
      const ipaddressValue = ref("");
      const aliasValue = ref("");

      // Initialize IP address value when client changes
      watch(
        () => selectedClient.value.ipaddress,
        (newIpAddress) => {
          if (newIpAddress !== undefined) {
            ipaddressValue.value = newIpAddress;
          }
        },
        { immediate: true }
      );

      // Initialize alias value when client changes
      watch(
        () => selectedClient.value.alias,
        (newAlias) => {
          if (newAlias !== undefined) {
            aliasValue.value = newAlias;
          }
        },
        { immediate: true }
      );

      const handleSave = async (event: { value: string; onSuccess: () => void; onError: () => void }) => {
        if (!selectedClient.value.id) {
          toast.error("No client selected");
          event.onError();
          return;
        }

        loading.value = true;

        try {
          await clientApi.setAlias(String(selectedClient.value.id), event.value);

          // Update the client object
          const updatedClient = { ...selectedClient.value, alias: event.value };
          emit("update:modelValue", updatedClient);

          event.onSuccess();
          toast.success("Alias updated successfully");
        } catch (err) {
          toast.error(err instanceof Error ? err.message : String(err));
          event.onError();
        } finally {
          loading.value = false;
        }
      };

      return {
        selectedClient,
        loading,
        ipaddressValue,
        aliasValue,
        handleSave
      };
    }
  });
</script>
