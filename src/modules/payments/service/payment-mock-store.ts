"use client";

import { useSyncExternalStore } from "react";

import { paymentMock } from "@/modules/payments/data/payment.mock";
import type { Payment } from "@/modules/payments/model/payment.types";
import { paymentSchema } from "@/modules/payments/validation/payment.schema";

const STORAGE_KEY = "net-corp:mock-payments:v1";

const STORE_EVENT = "net-corp:mock-payments-change";

let snapshot: Payment[] | null = null;

function cloneSeed() {
  return paymentMock.map((payment) => structuredClone(payment));
}

function parsePayments(value: unknown): Payment[] | null {
  const result = paymentSchema.array().safeParse(value);

  if (!result.success) {
    return null;
  }

  return result.data;
}

function readStoredPayments() {
  if (typeof window === "undefined") {
    return cloneSeed();
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return cloneSeed();
  }

  try {
    const parsed = parsePayments(JSON.parse(raw));

    return parsed ?? cloneSeed();
  } catch {
    return cloneSeed();
  }
}

function getClientSnapshot() {
  if (!snapshot) {
    snapshot = readStoredPayments();
  }

  return snapshot;
}

function getServerSnapshot() {
  return paymentMock;
}

function notify() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(STORE_EVENT));
}

function persist(payments: Payment[]) {
  snapshot = payments;

  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payments));
  }

  notify();
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handleStoreChange = () => {
    callback();
  };

  const handleStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) {
      return;
    }

    snapshot = null;

    callback();
  };

  window.addEventListener(STORE_EVENT, handleStoreChange);

  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener(STORE_EVENT, handleStoreChange);

    window.removeEventListener("storage", handleStorage);
  };
}

export function addPaymentToMockStore(payment: Payment) {
  const current = getClientSnapshot();

  persist([payment, ...current.filter((item) => item.id !== payment.id)]);
}

export function updatePaymentInMockStore(payment: Payment) {
  const current = getClientSnapshot();

  persist(current.map((item) => (item.id === payment.id ? payment : item)));
}

export function applyPaymentAdjustmentToMockStore(
  cancelledPayment: Payment,
  replacementPayment: Payment
) {
  const current = getClientSnapshot();

  const updated = current.map((item) =>
    item.id === cancelledPayment.id ? cancelledPayment : item
  );

  persist([
    replacementPayment,
    ...updated.filter((item) => item.id !== replacementPayment.id),
  ]);
}

export function resetPaymentMockStore() {
  snapshot = cloneSeed();

  if (typeof window !== "undefined") {
    window.localStorage.removeItem(STORAGE_KEY);
  }

  notify();
}

export function usePaymentMockStore() {
  const payments = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot
  );

  return {
    payments,

    addPayment: addPaymentToMockStore,

    updatePayment: updatePaymentInMockStore,

    applyAdjustment: applyPaymentAdjustmentToMockStore,

    resetPayments: resetPaymentMockStore,
  };
}
