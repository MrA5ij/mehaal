import React from 'react';
import SettingsLayout from "./SettingsLayout";
import { EmptyState } from "../../../components/EmptyState";

export default function Notifications() {
  return (
    <SettingsLayout>
      <EmptyState title="Notifications" />
    </SettingsLayout>
  );
}
