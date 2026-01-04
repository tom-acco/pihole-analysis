<template>
  <v-container class="pa-0 ma-0" fluid>
    <v-row>
      <v-col class="py-0" cols="12">
        <v-card>
          <v-card-title>
            <v-row>
              <v-col cols="6">
                <span class="text-h6">Sync Log</span>
              </v-col>
              <v-col class="text-right" cols="6">
                <v-chip variant="flat" color="primary" @click="store.syncNow()" label><v-icon icon="mdi-sync"></v-icon></v-chip>
              </v-col>
            </v-row>
          </v-card-title>
          <v-card-text>
            <sync-log :key="store.syncKey"></sync-log>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col class="py-0" cols="12">
        <v-card>
          <v-card-title>
            <v-row>
              <v-col cols="6">
                <span class="text-h6">New Domains</span>
              </v-col>
              <v-col class="text-right" cols="6">
                <domain-list-actions v-model="store.cache.new.items"></domain-list-actions>
              </v-col>
            </v-row>
          </v-card-title>
          <v-card-text>
            <domain-list :api-method="api.getNew" v-model:items="store.cache.new.items" v-model:total="store.cache.new.total"></domain-list>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col class="py-0" cols="12">
        <v-card>
          <v-card-title>
            <v-row>
              <v-col cols="6">
                <span class="text-h6">Flagged Domains</span>
              </v-col>
              <v-col class="text-right" cols="6">
                <domain-list-actions v-model="store.cache.flagged.items"></domain-list-actions>
              </v-col>
            </v-row>
          </v-card-title>
          <v-card-text>
            <domain-list :api-method="api.getFlagged" v-model:items="store.cache.flagged.items" v-model:total="store.cache.flagged.total"></domain-list>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col class="py-0" cols="12">
        <v-card>
          <v-card-title>
            <v-row>
              <v-col cols="6">
                <span class="text-h6">Hidden Domains</span>
              </v-col>
              <v-col class="text-right" cols="6">
                <v-chip variant="flat" color="grey-darken-2" @click="showHidden = !showHidden" label><v-icon :icon="showHidden ? 'mdi-eye-off' : 'mdi-eye'"></v-icon></v-chip>
              </v-col>
            </v-row>
          </v-card-title>
          <v-card-text>
            <domain-list
              v-if="showHidden"
              :api-method="api.getHidden"
              v-model:items="store.cache.hidden.items"
              v-model:total="store.cache.hidden.total"
            ></domain-list>

            <v-alert v-else color="grey" variant="outlined">
              Hidden domains are not shown by default. Show them by clicking the <v-icon icon="mdi-eye" size="small"></v-icon> icon above
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
  import { ref } from "vue";
  import { useStore } from "@/store";

  import api from "@/api/domains";

  import SyncLog from "@/components/sync-log.vue";
  import DomainList from "@/components/domain-list.vue";
  import DomainListActions from "@/components/domain-list-actions.vue";

  export default {
    components: {
      SyncLog,
      DomainList,
      DomainListActions
    },

    setup() {
      const store = useStore();

      const showHidden = ref(false);

      return {
        store,
        api,
        showHidden
      };
    }
  };
</script>
