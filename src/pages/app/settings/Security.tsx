import React from 'react';
import SettingsLayout from "./SettingsLayout";
import { EmptyState } from "../../../components/EmptyState";

export default function Security() {
  return (
    <SettingsLayout>
      <EmptyState title="Security Settings" />
    </SettingsLayout>
  );
}
