import { useState, useEffect } from "react";

export default function Storage() {
    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last modified</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Storage class</th>
              {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th> */}
            </tr>
          </thead>
          {/* <tbody className="bg-white divide-y divide-gray-200">
            {students.map((student) => (
              <tr key={student._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{student.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{student.school}</td>
                <td className="px-6 py-4 whitespace-nowrap">{student.grade}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(student.birthday).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleUpload(student._id)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <ArrowUpTrayIcon className="h-5 w-5" />
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {student.report != "" ? (
                    <div>
                    <span className="px-2 py-1 text-sm text-green-800 bg-green-100 rounded-full">
                      Generated
                    </span>
                
                  </div>
                  ) : (
                    <button
                      onClick={() => navigate(`/reports/${student._id}`)}
                      className="px-2 py-1 text-sm text-blue-800 bg-blue-100 rounded-full hover:bg-blue-200"
                    >
                      Generate
                    </button>
                  )}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  {student.report != ""? (
                        <div className="flex space-x-3">
                          <a  target={"_blank"}  href = {`${import.meta.env.VITE_PUBLIC_URL}/reports/${student.report}`}>
                          <DocumentIcon className="h-5 w-5"/>
                          </a>
                       </div>
                  ): (
                      <div/>
                  )
                  }
                
                </td>
              </tr>
            ))}
          </tbody> */}
        </table>
      </div>
    )
}
