// Utilities
import { defineStore } from "pinia";
import { toast } from "vue3-toastify";

import domainApi from "@/api/domains";
import syncApi from "@/api/sync";

import type { Client, Domain } from "./interfaces";

export const useStore = defineStore("store", {
  state: () => ({
    syncKey: 0,
    debounceMs: 500,
    cache: {
      clients: {
        total: 0 as number,
        items: [] as Client[]
      },
      domains: {
        total: 0 as number,
        items: [] as Domain[]
      },
      new: {
        total: 0 as number,
        items: [] as Domain[]
      },
      flagged: {
        total: 0 as number,
        items: [] as Domain[]
      },
      hidden: {
        total: 0 as number,
        items: [] as Domain[]
      }
    }
  }),

  actions: {
    async syncNow() {
      try {
        const t = toast.loading(`Syncing now...`);

        await syncApi.syncNow();

        toast.update(t, {
          render: `Success.`,
          type: "success",
          isLoading: false,
          autoClose: 1000
        });

        this.syncKey++;
      } catch (err) {
        toast.error(err);
      }
    },

    async interrogateDomain(domain: Domain) {
      try {
        const t = toast.loading(`Submitting interrogation request...`);

        const result = await domainApi.interrogate(domain.domain);

        toast.update(t, {
          render: `Success.`,
          type: "success",
          isLoading: false,
          autoClose: 1000
        });

        domain.owner = result.owner;
        domain.category = result.category;
        domain.risk = result.risk;
        domain.comment = result.comment;
      } catch (err) {
        toast.error(err);
      }
    },

    async toggleDomainAcknowledge(domain: Domain) {
      try {
        const result = await domainApi.acknowledge(domain.domain);

        toast.success(`Domain ${result.acknowledged ? "acknowledged" : "unacknowledged"}.`);

        domain.acknowledged = result.acknowledged;
      } catch (err) {
        toast.error(err);
      }
    },

    async toggleDomainFlag(domain: Domain) {
      try {
        const result = await domainApi.flag(domain.domain);

        toast.success(`Domain ${result.flagged ? "flagged" : "unflagged"}.`);

        domain.flagged = result.flagged;
      } catch (err) {
        toast.error(err);
      }
    },

    async toggleDomainHide(domain: Domain) {
      try {
        const result = await domainApi.hide(domain.domain);

        toast.success(`Domain ${result.hidden ? "hidden" : "unhidden"}.`);

        domain.hidden = result.hidden;
      } catch (err) {
        toast.error(err);
      }
    }
  }
});
