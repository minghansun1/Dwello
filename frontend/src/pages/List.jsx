import React from "react";
import Navbar from "../components/Navbar";

function List({ data }) {
  if (!data || data.length === 0) {
    return (
      <div>
        <Navbar />
        <div className="text-center mt-4">
          <h2 className="text-xl text-gray-700">No data to display</h2>
        </div>
      </div>
    );
  }

  // Extract keys from the first dictionary to serve as table headers
  const headers = Object.keys(data[0]);

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto bg-white p-6 shadow rounded mt-4">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
          Data Table
        </h2>
        <table className="table-auto w-full border-collapse border border-gray-300">
          {/* Table Header */}
          <thead>
            <tr className="bg-gray-200">
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="border border-gray-300 px-4 py-2 text-gray-700 font-semibold text-left"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-100">
                {headers.map((header, colIndex) => (
                  <td
                    key={colIndex}
                    className="border border-gray-300 px-4 py-2 text-gray-700"
                  >
                    {row[header]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default List;