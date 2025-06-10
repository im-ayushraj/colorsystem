import React, { useState } from 'react';
import type { MultiStepWizardProps } from './MultiStepWizard.types';

export const MultiStepWizard: React.FC<MultiStepWizardProps> = ({
  steps,
  initialStep = 0,
  onComplete,
  onStepChange,
  loading = false,
  asyncStep = false,
  showSkip = false,
  className,
}) => {
  const [current, setCurrent] = useState(initialStep);
  const [completed, setCompleted] = useState<number[]>([]);
  const [stepLoading, setStepLoading] = useState(false);
  const [errors, setErrors] = useState<string | null>(null);

  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(
    typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const goToStep = (idx: number) => {
    setCurrent(idx);
    setErrors(null);
    onStepChange?.(idx);
  };

  const handleNext = async () => {
    setErrors(null);
    const step = steps[current];
    if (step.validate) {
      const result = await step.validate();
      if (result !== true) {
        setErrors(typeof result === 'string' ? result : 'Validation failed');
        return;
      }
    }
    if (asyncStep) setStepLoading(true);
    setTimeout(() => {
      setStepLoading(false);
      setCompleted([...completed, current]);
      if (current < steps.length - 1) goToStep(current + 1);
      else onComplete?.();
    }, asyncStep ? 800 : 0);
  };

  const handlePrev = () => {
    setErrors(null);
    if (current > 0) goToStep(current - 1);
  };

  const handleSkip = () => {
    setErrors(null);
    setCompleted([...completed, current]);
    if (current < steps.length - 1) goToStep(current + 1);
  };

  return (
    <div
      className={className}
      style={{
        maxWidth: 520,
        margin: '0 auto',
        background: 'var(--color-bg-elevated)',
        borderRadius: 20,
        border: '1.5px solid var(--color-border)',
        padding: 40,
        boxShadow: '0 6px 32px 0 rgba(0,0,0,0.09)',
        position: 'relative',
        transition: 'background 0.3s',
      }}
      role="region"
      aria-label="Multi-step wizard"
    >
      {/* Global Theme Switcher */}
      <button
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
          background: 'var(--color-bg-muted)',
          border: 'none',
          borderRadius: 20,
          width: 44,
          height: 44,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px 0 rgba(0,0,0,0.06)',
          cursor: 'pointer',
          color: 'var(--color-primary)',
          fontSize: 22,
          zIndex: 2,
          transition: 'background 0.3s',
        }}
        title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
      {/* Progress Indicator */}
      <ol style={{ display: 'flex', gap: 16, marginBottom: 36, listStyle: 'none', padding: 0, justifyContent: 'center' }} role="list" aria-label="Wizard steps">
        {steps.map((step, idx) => (
          <li key={idx} style={{ flex: 1, textAlign: 'center', position: 'relative' }} role="listitem">
            <div
              tabIndex={0}
              aria-current={idx === current}
              aria-label={step.title + (step.optional ? ' (optional)' : '')}
              style={{
                width: 40, height: 40, borderRadius: '50%',
                background: completed.includes(idx)
                  ? 'var(--color-success)'
                  : idx === current
                  ? 'var(--color-primary)'
                  : 'var(--color-neutral-200)',
                color: completed.includes(idx) || idx === current ? 'var(--color-white)' : 'var(--color-neutral-700)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', fontWeight: 700, fontSize: 20,
                border: idx === current ? '2.5px solid var(--color-primary)' : '2.5px solid var(--color-neutral-200)',
                boxShadow: idx === current ? '0 2px 8px 0 rgba(37,99,235,0.10)' : undefined,
                transition: 'all 0.2s',
              }}>
              {completed.includes(idx) ? '✓' : idx + 1}
            </div>
            <div style={{ marginTop: 10, fontSize: 16, color: idx === current ? 'var(--color-primary)' : 'var(--color-neutral-700)', fontWeight: idx === current ? 600 : 400 }}>
              {step.title} {step.optional && <span style={{ fontSize: 12, color: 'var(--color-neutral-400)' }}>(Optional)</span>}
            </div>
            {idx < steps.length - 1 && (
              <div style={{ position: 'absolute', top: 20, right: -12, width: 24, height: 3, background: 'var(--color-border)', borderRadius: 2 }} />
            )}
          </li>
        ))}
      </ol>
      {/* Step Content */}
      <div
        style={{ minHeight: 150, marginBottom: 24, position: 'relative', transition: 'all 0.3s', borderRadius: 14, background: 'var(--color-bg-default)', boxShadow: '0 2px 12px 0 rgba(0,0,0,0.04)', padding: 28 }}
        tabIndex={0}
        aria-live="polite"
        aria-label={`Step ${current + 1} content`}
      >
        {stepLoading || loading ? (
          <div style={{ textAlign: 'center', color: 'var(--color-primary)', fontSize: 20, fontWeight: 500 }}>Loading...</div>
        ) : (
          <div style={{ animation: 'fadeIn 0.3s' }}>{steps[current].content}</div>
        )}
      </div>
      {/* Error Message */}
      {errors && <div style={{ color: 'var(--color-error)', marginBottom: 14, fontWeight: 500, textAlign: 'center', fontSize: 15 }} role="alert">{errors}</div>}
      {/* Navigation Buttons */}
      <div style={{ display: 'flex', gap: 16, justifyContent: 'flex-end', marginTop: 10 }}>
        <button
          onClick={handlePrev}
          disabled={current === 0 || stepLoading || loading}
          style={{ background: 'var(--color-neutral-200)', color: 'var(--color-neutral-800)', border: 'none', borderRadius: 8, padding: '10px 24px', cursor: current === 0 ? 'not-allowed' : 'pointer', fontWeight: 500, fontSize: 16, boxShadow: '0 1px 4px 0 rgba(0,0,0,0.03)' }}
          className="table-focusable"
          tabIndex={0}
        >Previous</button>
        {showSkip && steps[current].optional && (
          <button
            onClick={handleSkip}
            disabled={stepLoading || loading}
            style={{ background: 'var(--color-info)', color: 'var(--color-white)', border: 'none', borderRadius: 8, padding: '10px 24px', cursor: 'pointer', fontWeight: 500, fontSize: 16, boxShadow: '0 1px 4px 0 rgba(0,0,0,0.03)' }}
            className="table-focusable"
            tabIndex={0}
          >Skip</button>
        )}
        <button
          onClick={handleNext}
          disabled={stepLoading || loading}
          style={{ background: 'var(--color-primary)', color: 'var(--color-white)', border: 'none', borderRadius: 8, padding: '10px 24px', cursor: 'pointer', fontWeight: 500, fontSize: 16, boxShadow: '0 1px 4px 0 rgba(0,0,0,0.04)' }}
          className="table-focusable"
          tabIndex={0}
        >{current === steps.length - 1 ? 'Finish' : 'Next'}</button>
      </div>
    </div>
  );
};
