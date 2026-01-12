// Plugins
import router from "./router";

// Styles
import "unfonts.css";
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import "vue3-toastify/dist/index.css";

// Components
import App from "./App.vue";

// Composables
import { createApp } from "vue";
import { createVuetify } from "vuetify";
import { createPinia } from "pinia";
import Vue3Toastify, { type ToastContainerOptions } from "vue3-toastify";

const app = createApp(App);

const vuetify = createVuetify({
  theme: {
    defaultTheme: "dark"
  },
  defaults: {
    VTextField: {
      variant: "solo-filled",
      color: "primary",
      density: "comfortable",
      flat: true
    },
    VTextarea: {
      variant: "solo-filled",
      color: "primary"
    },
    VCheckbox: {
      variant: "solo-filled",
      color: "primary"
    },
    VSelect: {
      variant: "solo-filled",
      color: "primary"
    },
    VAutocomplete: {
      variant: "solo-filled",
      color: "primary"
    },
    VCombobox: {
      variant: "solo-filled",
      color: "primary"
    },
    VDateInput: {
      variant: "solo-filled",
      color: "primary"
    },
    VDataTable: {
      color: "primary",
      style: "background-color: rgba(0, 0, 0, 0)"
    },
    VDataTableServer: {
      color: "primary",
      style: "background-color: rgba(0, 0, 0, 0)"
    },
    VCard: {
      variant: "flat"
    }
  }
});

const pinia = createPinia();

app.use(vuetify);
app.use(router);
app.use(pinia);

app.use(Vue3Toastify, {
  autoClose: 3000,
  pauseOnHover: false,
  pauseOnFocusLoss: false
} as ToastContainerOptions);

app.mount("#app");
