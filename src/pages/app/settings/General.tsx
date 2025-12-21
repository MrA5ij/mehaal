import React from 'react';
import SettingsLayout from "./SettingsLayout";
import { EmptyState } from "../../../components/EmptyState";

export default function General() {
  return (
    <SettingsLayout>
      <EmptyState title="General Settings" />
    </SettingsLayout>
  );
}
