import { useMemo } from "react";
import { useTable, useFilters, useSortBy } from "react-table";
import "./LogTable.css";

const LogTable = ({ logs, handleArchiveLog, handleDeleteLog }) => {
  const data = useMemo(() => logs, [logs]);

  const columns = useMemo(
    () => [
      {
        Header: "Log",
        accessor: "text",
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
          <div className="btn-group" role="group">
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => handleArchiveLog(row.original._id)}
            >
              Archive
            </button>
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={() => handleDeleteLog(row.original._id)}
            >
              🗑️
            </button>
          </div>
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
    <div className="table-responsive">
      <input
        type="text"
        className="form-control form-control-sm mb-3"
        placeholder="Search logs..."
        onChange={(e) => setFilter("text", e.target.value)}
      />
      <table {...getTableProps()} className="table table-striped table-hover">
        <thead className="table-light">
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  key={column.id}
                  className="sortable-header"
                >
                  {column.render("Header")}
                  <span className="sort-indicator">
                    {column.isSorted
                      ? column.isSortedDesc
                        ? " 🔽"
                        : " 🔼"
                      : ""}
                  </span>
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
    </div>
  );
};

export default LogTable;
