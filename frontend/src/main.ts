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
      variant: "outlined",
      color: "primary",
      density: "compact"
    },
    VTextarea: {
      variant: "outlined",
      color: "primary"
    },
    VCheckbox: {
      variant: "outlined",
      color: "primary"
    },
    VSelect: {
      variant: "outlined",
      color: "primary"
    },
    VAutocomplete: {
      variant: "outlined",
      color: "primary"
    },
    VCombobox: {
      variant: "outlined",
      color: "primary"
    },
    VDateInput: {
      variant: "outlined",
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
