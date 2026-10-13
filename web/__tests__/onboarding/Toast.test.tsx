import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Toast } from '../../src/ui/Toast.tsx';

describe('Toast', () => {
  it('says what happened, with a check mark', () => {
    render(<Toast>New code sent to amara@harborbakery.com</Toast>);
    expect(screen.getByText('New code sent to amara@harborbakery.com')).toBeInTheDocument();
  });
});
