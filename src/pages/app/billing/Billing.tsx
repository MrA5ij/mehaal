import React from 'react';
import AppLayout from "../../../layouts/AppLayout";
import { EmptyState } from "../../../components/EmptyState";

export default function Billing() {
  return (
    <AppLayout>
      <h1 className="text-3xl font-semibold mb-6">Billing</h1>
      <EmptyState title="No active subscription yet." />
    </AppLayout>
  );
}
