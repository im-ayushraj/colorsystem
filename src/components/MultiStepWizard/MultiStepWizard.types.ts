export interface MultiStepWizardStep {
  title: string;
  optional?: boolean;
  content: React.ReactNode;
  validate?: () => boolean | string | Promise<boolean | string>;
}

export interface MultiStepWizardProps {
  steps: MultiStepWizardStep[];
  initialStep?: number;
  onComplete?: () => void;
  onStepChange?: (step: number) => void;
  loading?: boolean;
  asyncStep?: boolean;
  showSkip?: boolean;
  className?: string;
}
