import React from 'react';
import AppLayout from "../../../layouts/AppLayout";
import { EmptyState } from "../../../components/EmptyState";

export default function Workspaces() {
  return (
    <AppLayout>
      <h1 className="text-3xl font-semibold mb-6">Workspaces</h1>
      <EmptyState title="No organizations yet." />
    </AppLayout>
  );
}
