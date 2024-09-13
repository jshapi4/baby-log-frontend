import { useMemo } from "react";
import { useTable, useFilters, useSortBy } from "react-table";

const LogTable = ({ logs, handleArchiveLog, handleDeleteLog }) => {
  const data = useMemo(() => logs, [logs]);

  const columns = useMemo(
    () => [
      {
        Header: "Log",
        accessor: "text", // accessor is the "key" in your data
      },
      {
        Header: "Timestamp",
        accessor: "timestamp",
        Cell: ({ value }) => new Date(value).toLocaleString(),
      },
      {
        Header: "Actions",
        id: "actions",
        Cell: ({ row }) => (
          <>
            <button onClick={() => handleArchiveLog(row.original._id)}>
              Archive
            </button>
            <button onClick={() => handleDeleteLog(row.original._id)}>
              🗑️
            </button>
          </>
        ),
      },
    ],
    [handleArchiveLog, handleDeleteLog]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setFilter,
  } = useTable(
    {
      columns,
      data,
      initialState: { sortBy: [{ id: "timestamp", desc: true }] },
    },
    useFilters,
    useSortBy
  );

  return (
    <>
      <input
        type="text"
        placeholder="Search logs..."
        onChange={(e) => setFilter("text", e.target.value)}
      />
      <table {...getTableProps()} style={{ width: "100%", marginTop: "20px" }}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  key={column.id}
                >
                  {column.render("Header")}
                  {column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} key={row.original._id}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()} key={cell.column.id}>
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default LogTable;
