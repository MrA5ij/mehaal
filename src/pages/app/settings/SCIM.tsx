import React from 'react';
import SettingsLayout from "./SettingsLayout";
import { EmptyState } from "../../../components/EmptyState";

export default function SCIM() {
  return (
    <SettingsLayout>
      <EmptyState title="SCIM Settings" />
    </SettingsLayout>
  );
}
