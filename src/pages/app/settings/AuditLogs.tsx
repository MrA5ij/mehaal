import React from 'react';
import SettingsLayout from "./SettingsLayout";
import { EmptyState } from "../../../components/EmptyState";

export default function AuditLogs() {
  return (
    <SettingsLayout>
      <EmptyState title="Audit Logs" />
    </SettingsLayout>
  );
}
