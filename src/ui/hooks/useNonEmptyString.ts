// Copyright 2022-2024 use-ink/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useCallback } from 'react';
import { useFormField } from './useFormField';
import type { ValidFormField, Validation } from 'types';

export function useNonEmptyString(initialValue = ''): ValidFormField<string> {
  const validate = useCallback((value?: string | null): Validation => {
    if (!value || value.trim().length === 0) {
      return { isValid: false, message: 'Value cannot be empty' };
    }

    return { isValid: true };
  }, []);
  return useFormField(initialValue, validate);
}
