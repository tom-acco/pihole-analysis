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
      ignored: {
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

    async interrogateDomain(domain: Domain | Domain[]) {
      const domains = Array.isArray(domain) ? domain : [domain];

      try {
        let i: number = 1;

        const t = toast.loading(`Interrogating ${domains[0]!.domain}.`);

        for (const item of domains) {
          toast.update(t, {
            render: `Interrogating ${item.domain}.`
          });

          const result = await domainApi.interrogate(item.domain);

          item.owner = result.owner;
          item.category = result.category;
          item.risk = result.risk;
          item.comment = result.comment;

          i++;
        }

        toast.update(t, {
          render: `Success.`,
          type: "success",
          isLoading: false,
          autoClose: 1000
        });
      } catch (err) {
        toast.error(err);
      }
    },

    async toggleDomainAcknowledge(domain: Domain | Domain[]) {
      const domains = Array.isArray(domain) ? domain : [domain];

      try {
        for (const item of domains) {
          const result = await domainApi.acknowledge(item.domain);
          item.acknowledged = result.acknowledged;
        }

        toast.success(`Domain acknowledged`);
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

    async toggleDomainIgnore(domain: Domain) {
      try {
        const result = await domainApi.ignore(domain.domain);

        toast.success(`Domain ${result.ignored ? "ignored" : "unignored"}.`);

        domain.ignored = result.ignored;
      } catch (err) {
        toast.error(err);
      }
    }
  }
});
