import RecipientWizard from "@/components/wizard/RecipientWizard";
import { RECIPIENT_WIZARDS } from "@/lib/wizardConfig";

export default function SinglilPage() {
  return <RecipientWizard config={RECIPIENT_WIZARDS.singil!} />;
}
