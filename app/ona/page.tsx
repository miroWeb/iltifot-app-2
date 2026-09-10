import RecipientWizard from "@/components/wizard/RecipientWizard";
import { RECIPIENT_WIZARDS } from "@/lib/wizardConfig";

export default function OnaPage() {
  return <RecipientWizard config={RECIPIENT_WIZARDS.ona!} />;
}
