import RecipientWizard from "@/components/wizard/RecipientWizard";
import { RECIPIENT_WIZARDS } from "@/lib/wizardConfig";

export default function UkaPage() {
  return <RecipientWizard config={RECIPIENT_WIZARDS.uka!} />;
}
