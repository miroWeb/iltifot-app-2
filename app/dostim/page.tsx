import RecipientWizard from "@/components/wizard/RecipientWizard";
import { RECIPIENT_WIZARDS } from "@/lib/wizardConfig";

export default function DostimPage() {
  return <RecipientWizard config={RECIPIENT_WIZARDS.dost!} />;
}
