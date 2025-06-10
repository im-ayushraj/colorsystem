import './DataTable.css';
import React, { useState } from 'react';
import type { DataTableProps } from './DataTable.types';

export function DataTable<T = any>({
  columns,
  data,
  loading = false,
  page = 1,
  pageSize = 10,
  onPageChange,
  sortKey,
  sortDirection,
  onSortChange,
  selectionMode = 'none',
  selectedRows = [],
  onSelectionChange,
  expandableRows,
  onRowExpand,
  filters = {},
  onFilterChange,
}: DataTableProps<T>) {
  // Selection state (for uncontrolled mode)
  const [internalSelected, setInternalSelected] = useState<(string|number)[]>([]);
  const isControlled = !!onSelectionChange;
  const selected = isControlled ? selectedRows : internalSelected;

  // Expand state
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  // Filter dropdown state
  const [openFilter, setOpenFilter] = useState<string | null>(null);

  // Handle sort click
  const handleSort = (key: string) => {
    if (!onSortChange) return;
    let direction: 'asc' | 'desc' = 'asc';
    if (sortKey === key && sortDirection === 'asc') direction = 'desc';
    onSortChange(key, direction);
  };

  // Handle row selection
  const handleSelectRow = (rowId: string|number) => {
    let newSelected;
    if (selected?.includes(rowId)) {
      newSelected = selected.filter(id => id !== rowId);
    } else {
      newSelected = selectionMode === 'multiple' ? [...selected, rowId] : [rowId];
    }
    if (isControlled && onSelectionChange) onSelectionChange(newSelected);
    else setInternalSelected(newSelected);
  };
  // Handle select all
  const allIds = data.map((row, idx) => (row as any).id ?? idx);
  const allSelected = allIds.length > 0 && allIds.every(id => selected.includes(id));
  const someSelected = allIds.some(id => selected.includes(id));
  const handleSelectAll = () => {
    let newSelected = allSelected ? [] : allIds;
    if (isControlled && onSelectionChange) onSelectionChange(newSelected);
    else setInternalSelected(newSelected);
  };

  // Handle row expand
  const handleExpandRow = (rowIdx: number) => {
    const newSet = new Set(expandedRows);
    if (expandedRows.has(rowIdx)) newSet.delete(rowIdx);
    else newSet.add(rowIdx);
    setExpandedRows(newSet);
    if (onRowExpand) onRowExpand(data[rowIdx], newSet.has(rowIdx));
  };

  return (
    <div
      className="datatable-responsive"
      style={{
        width: '100%',
        overflowX: 'auto',
        background: 'var(--color-bg-elevated)',
        borderRadius: 16,
        border: '1.5px solid var(--color-border)',
        boxShadow: '0 4px 24px 0 rgba(0,0,0,0.06)',
        margin: '0 auto',
        padding: 0,
        transition: 'background 0.3s',
      }}
      role="region"
      aria-label="Advanced data table"
    >
      <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }} role="table">
        <thead style={{ background: 'var(--color-bg-muted)' }}>
          <tr style={{ height: 56 }} role="row">
            {selectionMode !== 'none' && (
              <th>
                {selectionMode === 'multiple' && (
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={el => { if (el) el.indeterminate = !allSelected && someSelected; }}
                    onChange={handleSelectAll}
                    aria-label="Select all rows"
                  />
                )}
              </th>
            )}
            {columns.map((col, idx) => (
              <th
                key={col.key as string || idx}
                style={{ textAlign: 'left', padding: 12, color: 'var(--color-neutral-800)', fontWeight: 600, cursor: col.sortable ? 'pointer' : 'default', userSelect: 'none', position: 'relative' }}
                onClick={col.sortable ? () => handleSort(col.key as string) : undefined}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  {col.header}
                  {col.sortable && (
                    <span style={{ fontSize: 12, color: 'var(--color-primary)' }}>
                      {sortKey === col.key ? (sortDirection === 'asc' ? '▲' : '▼') : '↕'}
                    </span>
                  )}
                  {col.filterable && (
                    <button
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary)' }}
                      aria-label={`Filter ${col.header}`}
                      onClick={e => { e.stopPropagation(); setOpenFilter(openFilter === col.key ? null : col.key as string); }}
                    >
                      ⏷
                    </button>
                  )}
                </span>
                {/* Filter dropdown */}
                {col.filterable && openFilter === col.key && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, zIndex: 10, background: 'var(--color-bg-default)', border: '1px solid var(--color-border)', borderRadius: 4, padding: 8, minWidth: 120, boxShadow: '0 2px 8px 0 rgba(0,0,0,0.08)' }}>
                    <input
                      type="text"
                      placeholder={`Filter ${col.header}`}
                      value={filters[col.key as string] || ''}
                      onChange={e => onFilterChange && onFilterChange({ ...filters, [col.key as string]: e.target.value })}
                      style={{ width: '100%', padding: 4, borderRadius: 4, border: '1px solid var(--color-border)' }}
                    />
                    <button
                      style={{ marginTop: 4, background: 'var(--color-primary)', color: 'var(--color-white)', border: 'none', borderRadius: 4, padding: '4px 8px', cursor: 'pointer', width: '100%' }}
                      onClick={() => setOpenFilter(null)}
                    >Apply</button>
                  </div>
                )}
              </th>
            ))}
            {expandableRows && <th></th>}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            // Loading skeleton rows
            Array.from({ length: 5 }).map((_, idx) => (
              <tr key={idx}>
                {selectionMode !== 'none' && <td><div style={{ height: 16, background: 'var(--color-neutral-200)', borderRadius: 4 }} /></td>}
                {columns.map((col, colIdx) => (
                  <td key={col.key as string || colIdx}>
                    <div style={{ height: 16, background: 'var(--color-neutral-200)', borderRadius: 4, margin: '4px 0' }} />
                  </td>
                ))}
                {expandableRows && <td></td>}
              </tr>
            ))
          ) : (
            data.map((row, rowIdx) => {
              const rowId = (row as any).id ?? rowIdx;
              const isExpanded = expandedRows.has(rowIdx);
              return (
                <React.Fragment key={rowId}>
                  <tr
                    style={{
                      borderBottom: '1px solid var(--color-border)',
                      transition: 'box-shadow 0.2s',
                      boxShadow: 'none',
                      cursor: expandableRows ? 'pointer' : 'default',
                      background: selected.includes(rowId) ? 'var(--color-neutral-100)' : undefined,
                    }}
                    onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 2px 8px 0 rgba(0,0,0,0.04)')}
                    onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
                    role="row"
                  >
                    {selectionMode !== 'none' && (
                      <td>
                        <input
                          type={selectionMode === 'multiple' ? 'checkbox' : 'radio'}
                          checked={selected.includes(rowId)}
                          onChange={() => handleSelectRow(rowId)}
                          aria-label={`Select row ${rowIdx + 1}`}
                        />
                      </td>
                    )}
                    {columns.map((col, colIdx) => (
                      <td key={col.key as string || colIdx} style={{ padding: 12 }} role="cell">
                        {col.render ? col.render(row) : (row as any)[col.key]}
                      </td>
                    ))}
                    {expandableRows && (
                      <td>
                        <button
                          aria-label={isExpanded ? 'Collapse row' : 'Expand row'}
                          onClick={() => handleExpandRow(rowIdx)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}
                          className="table-focusable"
                          tabIndex={0}
                        >
                          {isExpanded ? '▾' : '▸'}
                        </button>
                      </td>
                    )}
                  </tr>
                  {expandableRows && isExpanded && (
                    <tr>
                      <td colSpan={columns.length + (selectionMode !== 'none' ? 1 : 0) + 1} style={{ padding: 0, background: 'var(--color-bg-muted)', transition: 'all 0.3s' }}>
                        <div style={{ padding: 16, animation: 'fadeIn 0.3s' }}>
                          {expandableRows.expandedContent(row)}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })
          )}
        </tbody>
      </table>
      {/* Pagination controls */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: 16,
        gap: 12,
        borderTop: '1px solid var(--color-border)',
        background: 'var(--color-bg-muted)',
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
      }}>
        <button
          style={{ background: 'var(--color-primary)', color: 'var(--color-white)', border: 'none', borderRadius: 6, padding: '8px 20px', cursor: 'pointer', fontWeight: 500, fontSize: 15, boxShadow: '0 1px 4px 0 rgba(0,0,0,0.04)' }}
          disabled={page === 1}
          onClick={() => onPageChange && onPageChange(page - 1)}
          className="table-focusable"
          tabIndex={0}
        >Prev</button>
        <span style={{ color: 'var(--color-neutral-700)', fontWeight: 500, fontSize: 15 }}>Page {page}</span>
        <button
          style={{ background: 'var(--color-primary)', color: 'var(--color-white)', border: 'none', borderRadius: 6, padding: '8px 20px', cursor: 'pointer', fontWeight: 500, fontSize: 15, boxShadow: '0 1px 4px 0 rgba(0,0,0,0.04)' }}
          disabled={data.length < pageSize}
          onClick={() => onPageChange && onPageChange(page + 1)}
          className="table-focusable"
          tabIndex={0}
        >Next</button>
      </div>
    </div>
  );
}
