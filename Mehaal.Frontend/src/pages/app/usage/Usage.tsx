import React from 'react';
import AppLayout from "../../../layouts/AppLayout";
import { EmptyState } from "../../../components/EmptyState";

export default function Usage() {
  return (
    <AppLayout>
      <h1 className="text-3xl font-semibold mb-6">Usage</h1>
      <EmptyState title="Usage data will appear here." />
    </AppLayout>
  );
}
