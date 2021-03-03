import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Table as AntdTable } from 'antd';

const handleMouseOver = event => {
  const target = event.target.closest('td');
  if (!target) return null;
  if (target.matches('td:first-child')) return null;
  const table = event.target.closest('table');
  if (!table.contains(target)) return null;
  const tr = target.parentElement;
  const nodes = Array.prototype.slice.call(tr.parentElement.querySelectorAll('tr'));
  let rowIndex = nodes.indexOf(tr);
  const cellIndex = target.cellIndex + 1;

  if (rowIndex === 0) rowIndex = 1;

  let activeCell = table.querySelectorAll(`tr td:nth-child(${cellIndex})`);

  activeCell = Array.prototype.filter.call(activeCell, cell => {
    return !cell.matches(`tr:nth-child(${rowIndex}) ~ tr td:nth-child(${cellIndex})`);
  });

  return Array.prototype.forEach.call(activeCell, cell => {
    cell.classList.add('highlight');
  });
};

const handleMouseOut = event => {
  const target = event.target.closest('td');
  if (!target) return null;

  const table = event.target.closest('table');
  if (!table.contains(target)) return null;

  const activeCell = table.querySelectorAll('.highlight');

  return Array.prototype.forEach.call(activeCell, cell => {
    cell.classList.remove('highlight');
  });
};

const Table = props => {
  const { className } = props;

  useEffect(() => {
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  return (
    <AntdTable
      {...props}
      className={`${className} dashboard-table--hovered-column dashboard-table--sticky`}
    />
  );
};

Table.propTypes = {
  className: PropTypes.string,
};

export default Table;
