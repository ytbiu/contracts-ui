// Copyright 2022-2024 use-ink/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { SimpleSpread } from 'types';
import { classes } from 'lib/util';

type Props = SimpleSpread<
  React.InputHTMLAttributes<HTMLInputElement>,
  {
    isDisabled?: boolean;
    isError?: boolean;
    onChange: (_: string) => void;
    value?: string | null;
  }
>;

export function Input({
  children,
  className,
  isDisabled = false,
  isError = false,
  onChange: _onChange,
  placeholder,
  value,
  onFocus,
  type = 'text',
}: Props) {
  function onChange(e: React.ChangeEvent<HTMLInputElement>): void {
    _onChange(e.target.value);
  }

  return (
    <div className={classes(isError && 'isError', 'w-full')}>
      <input
        className={classes(
          'w-full rounded border-gray-200 bg-white text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300',
          isDisabled && 'dark:text-gray-500',
          className,
        )}
        onChange={onChange}
        onFocus={onFocus}
        placeholder={placeholder}
        type={type}
        value={value || ''}
        {...(isDisabled ? { disabled: true } : {})}
      />
      {children}
    </div>
  );
}
