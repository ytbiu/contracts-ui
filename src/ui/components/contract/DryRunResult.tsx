// Copyright 2022-2024 use-ink/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { AbiMessage } from '@polkadot/api-contract/types';
import { formatProofSize, formatRefTime } from '../../../lib/formatWeight';
import { DryRunError } from './DryRunError';
import { OutcomeItem } from './OutcomeItem';
import { classes } from 'lib/util';
import { ContractExecResult, Registry } from 'types';
import { useApi } from 'ui/contexts';
import { getDecodedOutput } from 'lib/output';
import { decodeStorageDeposit } from 'lib/callOptions';

interface Props {
  outcome: ContractExecResult;
  message: AbiMessage;
  registry: Registry;
}

export function DryRunResult({
  outcome: { gasRequired, gasConsumed, storageDeposit, debugMessage, result },
  message,
  registry,
}: Props) {
  const { decodedOutput, isError } = getDecodedOutput({ result, debugMessage }, message, registry);
  const { api } = useApi();
  const { value: storageDepositValue, type: storageDepositType } =
    decodeStorageDeposit(storageDeposit);
  const isDispatchable = message.isMutating || message.isPayable;

  const dispatchError =
    result.isErr && result.asErr.isModule
      ? api.registry.findMetaError(result.asErr.asModule)
      : undefined;

  const shouldDisplayRequired = !gasConsumed.refTime.toBn().eq(gasRequired.refTime.toBn());
  const prediction = result.isErr
    ? 'Contract Reverted!'
    : isError
      ? 'Contract Reverted!'
      : isDispatchable
        ? 'Contract call will be successful!'
        : '';

  return (
    <div
      className="flex flex-col"
      data-cy={`dryRun-${message.method}`}
      key={`dryRun-${message.method}`}
    >
      <>
        {isDispatchable && (
          <div
            className={classes(
              result.isErr || isError ? 'text-red-500' : 'text-green-500',
              'mb-2 font-mono text-sm',
            )}
          >
            {prediction}
          </div>
        )}
        {dispatchError && <DryRunError error={dispatchError} />}

        {!debugMessage.isEmpty && (
          <OutcomeItem
            displayValue={debugMessage.toHuman()}
            key={`debug-${message.method}`}
            title="Debug message"
          />
        )}
        {!dispatchError && (
          <OutcomeItem
            displayValue={decodedOutput}
            key={`err-${message.method}`}
            title={isDispatchable ? 'Execution result' : 'Return value'}
          />
        )}
        {isDispatchable && (
          <div data-cy="dry-run-estimations">
            <span>GasConsumed</span>
            <div className="flex flex-row gap-4">
              <div className="flex-1" title={formatRefTime(gasConsumed.refTime)}>
                <OutcomeItem
                  displayValue={`refTime: ${formatRefTime(gasConsumed.refTime, 'ms')}`}
                  id={`gcr-${message.method}`}
                  key={`gcr-${message.method}`}
                  title=""
                />
              </div>
              <div className="flex-1" title={formatProofSize(gasConsumed.proofSize)}>
                <OutcomeItem
                  displayValue={`proofSize: ${formatProofSize(gasConsumed.proofSize, 'MB')}`}
                  id={`gcp-${message.method}`}
                  key={`gcp-${message.method}`}
                  title=""
                />
              </div>
            </div>

            {shouldDisplayRequired && (
              <>
                <span>GasRequired</span>
                <div className="flex">
                  <div className="basis-1/2 pr-2" title={formatRefTime(gasRequired.refTime)}>
                    <OutcomeItem
                      displayValue={`refTime: ${formatRefTime(gasRequired.refTime, 'ms')}`}
                      id={`grr-${message.method}`}
                      key={`grr-${message.method}`}
                      title=""
                    />
                  </div>
                  <div className="basis-1/2 pl-2" title={formatProofSize(gasRequired.proofSize)}>
                    <OutcomeItem
                      displayValue={`proofSize: ${formatProofSize(gasRequired.proofSize, 'MB')}`}
                      id={`grp-${message.method}`}
                      key={`grp-${message.method}`}
                      title=""
                    />
                  </div>
                </div>
              </>
            )}
            <OutcomeItem
              copyValue={storageDepositValue?.toString() ?? ''}
              displayValue={`${storageDepositType}: ${storageDepositValue?.toHuman() ?? 'none'}`}
              key={`sd-${message.method}`}
              title="StorageDeposit"
            />
          </div>
        )}
      </>
    </div>
  );
}
