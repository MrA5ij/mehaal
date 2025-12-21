import React from 'react';
import SettingsLayout from "./SettingsLayout";
import { EmptyState } from "../../../components/EmptyState";

export default function ApiKeys() {
  return (
    <SettingsLayout>
      <EmptyState title="API Keys" />
    </SettingsLayout>
  );
}
