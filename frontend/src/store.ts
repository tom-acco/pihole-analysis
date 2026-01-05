// Utilities
import { defineStore } from "pinia";
import { toast } from "vue3-toastify";

import domainApi from "@/api/domains";
import syncApi from "@/api/sync";

import type { Client, Domain, Sync } from "./interfaces";

export const useStore = defineStore("store", {
  state: () => ({
    syncKey: 0,
    debounceMs: 500,
    cache: {
      syncs: {
        items: [] as Sync[]
      },
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

    async setDomainAcknowledge(domain: Domain | Domain[], value: boolean) {
      const domains = Array.isArray(domain) ? domain : [domain];

      try {
        await domainApi.setAcknowledge(
          domains.map((o) => o.domain),
          value
        );
        domains.map((o) => (o.acknowledged = value));
        toast.success(`${value ? "Acknowledged" : "Unacknowledged"}.`);
      } catch (err) {
        toast.error(err);
      }
    },

    async setDomainFlag(domain: Domain | Domain[], value: boolean) {
      const domains = Array.isArray(domain) ? domain : [domain];

      try {
        await domainApi.setFlag(
          domains.map((o) => o.domain),
          value
        );
        domains.map((o) => (o.flagged = value));
        toast.success(`${value ? "Flagged" : "Unflagged"}.`);
      } catch (err) {
        toast.error(err);
      }
    },

    async setDomainIgnore(domain: Domain | Domain[], value: boolean) {
      const domains = Array.isArray(domain) ? domain : [domain];

      try {
        await domainApi.setIgnore(
          domains.map((o) => o.domain),
          value
        );
        domains.map((o) => (o.ignored = value));
        toast.success(`${value ? "Ignored" : "Unignored"}.`);
      } catch (err) {
        toast.error(err);
      }
    }
  }
});
