<template>
  <v-app>
    <v-main>
      <v-container>
        <v-row>
          <v-col>
            <v-sheet bg-color="grey-darken-4" rounded>
              <v-tabs color="primary">
                <v-tab to="/dashboard">Dashboard</v-tab>
                <v-tab to="/domains">Domains</v-tab>
                <v-tab to="/clients">Clients</v-tab>
              </v-tabs>
            </v-sheet>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-sheet bg-color="grey-darken-4" rounded>
              <router-view />
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
  //
</script>
