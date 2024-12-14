import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function List() {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state?.data; // Accessing data from the navigate state
  console.log("Data received:", data);

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

  const handleRowClick = (rowData) => {
    navigate("/detailed", { state: { data: rowData } });
  };

  return (
    <div className="pt-16">
      <Navbar />
      <div className="mx-auto bg-white p-6 shadow rounded mt-4 inline-block">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4 text-center">
          Data Table
        </h2>
        <table className="table-auto border-collapse border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-200">
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="border border-gray-300 px-2 py-1 text-gray-700 font-semibold text-left"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="hover:bg-gray-100 cursor-pointer"
                onClick={() => handleRowClick(row)} // Navigate on row click
              >
                {headers.map((header, colIndex) => (
                  <td
                    key={colIndex}
                    className="border border-gray-300 px-2 py-1 text-gray-700"
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