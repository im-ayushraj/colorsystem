import type { Meta, StoryObj } from '@storybook/react';
import { DataTable } from '../components/DataTable/DataTable';
import '../components/DataTable/DataTable.css';

const columns = [
  { key: 'id', header: 'ID', sortable: true },
  { key: 'name', header: 'Name', sortable: true, filterable: true },
  { key: 'role', header: 'Role', filterable: true },
];

const data = [
  { id: 1, name: 'Alice', role: 'Admin' },
  { id: 2, name: 'Bob', role: 'User' },
  { id: 3, name: 'Charlie', role: 'User' },
];

const meta: Meta<typeof DataTable> = {
  title: 'Components/DataTable',
  component: DataTable,
  parameters: {
    docs: {
      description: {
        component: 'Advanced, accessible, and responsive data table with sorting, selection, and more.'
      }
    }
  }
};
export default meta;

type Story = StoryObj<typeof DataTable>;

export const Basic: Story = {
  args: {
    columns,
    data,
    selectionMode: 'multiple',
    expandableRows: {
      expandedContent: (row: any) => <div>Details for {row.name}</div>,
    },
    page: 1,
    pageSize: 10,
    totalCount: 3,
    loading: false,
    filters: {},
    onFilterChange: () => {},
    onPageChange: () => {},
    onSortChange: () => {},
    onSelectionChange: () => {},
    onRowExpand: () => {},
  },
};

// Anatomy, states, accessibility, theming, best practices
export const Documentation: Story = {
  render: () => (
    <div>
      <h3>Component Anatomy</h3>
      <ul>
        <li>Header: Sortable/filterable columns, selection checkbox</li>
        <li>Body: Data rows, hover, selection, expandable, skeleton</li>
        <li>Footer: Pagination controls</li>
      </ul>
      <h3>States & Variants</h3>
      <ul>
        <li>Loading, Empty, Error, Interactive (hover, focus, selected, expanded)</li>
      </ul>
      <h3>Accessibility</h3>
      <ul>
        <li>Keyboard navigation (Tab, Arrow keys, Space/Enter for selection/expand)</li>
        <li>ARIA roles: <code>table</code>, <code>row</code>, <code>columnheader</code>, <code>cell</code></li>
        <li>Focus ring for interactive elements</li>
      </ul>
      <h3>Theming & Responsiveness</h3>
      <ul>
        <li>Uses color tokens for all UI states</li>
        <li>Responsive: scrolls or stacks on mobile</li>
      </ul>
      <h3>Best Practices</h3>
      <ul>
        <li>Use unique <code>id</code> for rows</li>
        <li>Keep columns minimal for mobile</li>
        <li>Don’t overload with actions per row</li>
      </ul>
    </div>
  ),
};
