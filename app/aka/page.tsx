import RecipientWizard from "@/components/wizard/RecipientWizard";
import { RECIPIENT_WIZARDS } from "@/lib/wizardConfig";

export default function AkaPage() {
  return <RecipientWizard config={RECIPIENT_WIZARDS.aka!} />;
}
