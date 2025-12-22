import React from 'react';
import SettingsLayout from "./SettingsLayout";
import { EmptyState } from "../../../components/EmptyState";

export default function SSO() {
  return (
    <SettingsLayout>
      <EmptyState title="SSO Settings" />
    </SettingsLayout>
  );
}
