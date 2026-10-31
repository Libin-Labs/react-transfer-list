'use client';
import { useState, type ReactNode } from 'react';
export interface TransferOption {
  id: string | number;
  label: string;
  disabled?: boolean;
}
export interface TransferListProps {
  options?: readonly TransferOption[];
  value?: readonly (string | number)[];
  defaultValue?: readonly (string | number)[];
  onChange?: (ids: (string | number)[]) => void;
  sourceLabel?: string;
  targetLabel?: string;
  maxVisible?: number;
  disabled?: boolean;
  renderOption?: (option: TransferOption) => ReactNode;
  className?: string;
}
export function TransferList({
  options = [],
  value: controlled,
  defaultValue = [],
  onChange,
  sourceLabel = 'Available',
  targetLabel = 'Selected',
  maxVisible = 200,
  disabled = false,
  renderOption,
  className,
}: TransferListProps) {
  if (
    options.length > 10000 ||
    new Set(options.map((option) => option.id)).size !== options.length ||
    !Number.isInteger(maxVisible) ||
    maxVisible < 1 ||
    maxVisible > 1000
  )
    throw new RangeError('Invalid transfer-list limits or ids.');
  const [internal, setValue] = useState<readonly (string | number)[]>(defaultValue);
  const target = new Set(controlled ?? internal);
  const [queries, setQueries] = useState(['', '']);
  const [checked, setChecked] = useState(new Set<string | number>());
  const lists = [
    options.filter((option) => !target.has(option.id)),
    options.filter((option) => target.has(option.id)),
  ];
  const filtered = lists.map((list, index) =>
    list.filter((option) =>
      option.label.toLocaleLowerCase().includes(queries[index]!.toLocaleLowerCase()),
    ),
  );
  const move = (side: number, all = false) => {
    if (disabled) return;
    const moving = filtered[side]!.filter(
      (option) => !option.disabled && (all || checked.has(option.id)),
    );
    const next = new Set(target);
    for (const option of moving) {
      if (side === 0) next.add(option.id);
      else next.delete(option.id);
    }
    const values = options.filter((option) => next.has(option.id)).map((option) => option.id);
    if (controlled === undefined) setValue(values);
    onChange?.(values);
    const reset = new Set(checked);
    for (const option of moving) reset.delete(option.id);
    setChecked(reset);
  };
  const panel = (side: number) => (
    <fieldset style={{ minWidth: 0, flex: '1 1 200px' }} disabled={disabled}>
      <legend>{side === 0 ? sourceLabel : targetLabel}</legend>
      <input
        type="search"
        aria-label={`Search ${side === 0 ? sourceLabel : targetLabel}`}
        maxLength={256}
        value={queries[side]}
        onChange={(event) =>
          setQueries((previous) =>
            previous.map((query, index) => (index === side ? event.currentTarget.value : query)),
          )
        }
        style={{ width: '100%', boxSizing: 'border-box' }}
      />
      <label>
        <input
          type="checkbox"
          aria-label={`Select all ${side === 0 ? sourceLabel : targetLabel}`}
          checked={
            filtered[side]!.some((option) => !option.disabled) &&
            filtered[side]!.filter((option) => !option.disabled).every((option) =>
              checked.has(option.id),
            )
          }
          onChange={(event) => {
            const next = new Set(checked);
            for (const option of filtered[side]!)
              if (!option.disabled) {
                if (event.currentTarget.checked) next.add(option.id);
                else next.delete(option.id);
              }
            setChecked(next);
          }}
        />
        Select all matching
      </label>
      <ul style={{ height: 240, overflow: 'auto', listStyle: 'none', padding: 0 }}>
        {filtered[side]!.slice(0, maxVisible).map((option) => (
          <li key={`${typeof option.id}:${option.id}`}>
            <label>
              <input
                type="checkbox"
                disabled={option.disabled}
                checked={checked.has(option.id)}
                onChange={() => {
                  const next = new Set(checked);
                  if (next.has(option.id)) next.delete(option.id);
                  else next.add(option.id);
                  setChecked(next);
                }}
              />
              {renderOption ? renderOption(option) : option.label}
            </label>
          </li>
        ))}
      </ul>
      <output>{filtered[side]!.length} matching</output>
      {filtered[side]!.length > maxVisible && <p role="status">Refine search to see more items.</p>}
    </fieldset>
  );
  return (
    <div
      className={className}
      style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}
    >
      {panel(0)}
      <div style={{ display: 'grid', gap: 6 }}>
        {[
          [0, false, 'Move checked right', '>'],
          [0, true, 'Move all matching right', '>>'],
          [1, false, 'Move checked left', '<'],
          [1, true, 'Move all matching left', '<<'],
        ].map(([side, all, label, text]) => (
          <button
            key={String(label)}
            type="button"
            disabled={
              disabled ||
              !filtered[Number(side)]!.some(
                (option) => !option.disabled && (all || checked.has(option.id)),
              )
            }
            aria-label={String(label)}
            title={String(label)}
            onClick={() => move(Number(side), Boolean(all))}
          >
            {String(text)}
          </button>
        ))}
      </div>
      {panel(1)}
    </div>
  );
}
export default TransferList;
