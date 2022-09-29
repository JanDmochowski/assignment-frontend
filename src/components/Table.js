import React from 'react';
import { useTable, usePagination } from 'react-table';
import styled from 'styled-components';

const DataTable = styled.table`
  margin-top: 1rem;
  margin-bottom: 1rem;
  border: 1px solid #bbb;
  border-spacing: 0px;
  border-radius: 12px;
`

const DataHeaders = styled.tr`
  border-bottom: 1px solid #bbb;
`

const DataHeadersCell = styled.th`
  padding: 1rem;
`

const DataBodyCell = styled.td`
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  border-top: 1px solid #bbb;
`

const Pagination = styled.div`
  text-align: center;
`

const PageSelector = styled.input`
  border-radius: 12px;
  font-size: 16px;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  margin-bottom: 1rem;
  border: 1px solid #bbb;
  padding: 0 0.5rem;
`

export default function Table({ columns, data }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    gotoPage,
    nextPage,
    previousPage,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
    },
    usePagination
  )

  return (
    <>
      <DataTable {...getTableProps()}>
        <thead>
          <DataHeaders>
            {headerGroups.map(headerGroup => (
              headerGroup.headers.map(column => (
                <DataHeadersCell key={column.Header} {...column.getHeaderProps()}>{column.render('Header')}</DataHeadersCell>
              ))
            ))}
          </DataHeaders>
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row)
            return (
              <tr key={i} {...row.getRowProps()}>
                {row.cells.map((cell, index) => {
                  return <DataBodyCell key={index} {...cell.getCellProps()}>{cell.render('Cell')}</DataBodyCell>
                })}
              </tr>
            )
          })}
        </tbody>
      </DataTable>

      {data.length > pageSize ? <Pagination>
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </button>{' '}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </button>{' '}
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
        <span>
          | Go to page:{' '}
          <PageSelector
            type="number"
            defaultValue={pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              gotoPage(page)
            }}
            style={{ width: '100px' }}
          />
        </span>{' '}
      </Pagination> : <div></div>}
    </>
  )
}