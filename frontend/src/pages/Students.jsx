import { useState, useEffect } from 'react';
import moment from 'moment';
import { PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import { getStudents } from '../actions/studentActions';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function Students() {
	const [students, setStudents] = useState([]);
	const [loading , setLoading] = useState(true);

	useEffect(() => {
		fetchStudents();
	}, []);

	const fetchStudents = async () => {
		try {
			setLoading(true);
			const data = await getStudents();
			setStudents(data.students);
		} catch (err) {
			console.error('Error: ', err);
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="bg-white rounded-lg shadow">
			{/* Header Section */}
			<div className="p-6">
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-2xl font-semibold">Students</h1>
					<button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700">
						Add New Student
					</button>
				</div>

				{/* Filters */}
				<div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
					<input
						type="text"
						placeholder="Search students..."
						className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
					/>
					<select className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
						<option value="">All Grades</option>
						<option value="6">6th Grade</option>
						<option value="7">7th Grade</option>
						<option value="8">8th Grade</option>
					</select>
					<select className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
						<option value="">All Schools</option>
						<option value="lincoln">Lincoln High School</option>
						<option value="washington">Washington Middle School</option>
					</select>
					<button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
						Reset Filters
					</button>
				</div>

				{/* Table */}
				<div className="overflow-x-auto">
					{loading ? <LoadingSpinner /> : <table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Student Name
								</th>
								{/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Date of Birth
								</th> */}
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Grade
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									School
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Guardian
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Created At
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{students.map((student) => (
								<tr key={student._id} className="hover:bg-gray-50">
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="flex items-center">
											<div className="h-10 w-10 flex-shrink-0">
												<span className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
													{student.firstName.charAt(0)}
												</span>
											</div>
											<div className="ml-4">
												<div className="text-sm font-medium text-gray-900">
													{`${student.firstName} ${student.lastName}`}
												</div>
												<div className="text-sm text-gray-500">
													Birth: {moment(student.dateOfBirth).format("YYYY.MM.DD")}
												</div>
											</div>
										</div>
									</td>
									{/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										{new Date(student.dateOfBirth).toLocaleDateString()}
									</td> */}
									<td className="px-6 py-4 whitespace-nowrap">
										<span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
											{student.grade}
										</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										{student.school}
									</td>
									{student.guardian ? 
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="text-sm text-gray-900">
												{student.guardian.name || 'No Name'}
											</div>
											<div className="text-sm text-gray-500">
												{student.guardian.phone || 'No Phone'}
											</div>
										</td> : 
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
											No Guardian
										</td>
									}
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										{moment(student.createdAt).format("YYYY.MM.DD")}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
										<div className="flex space-x-3">
											<button 
												className="text-blue-600 hover:text-blue-900"
												title="View Details"
											>
												<EyeIcon className="h-5 w-5" />
											</button>
											<button 
												className="text-green-600 hover:text-green-900"
												title="Edit"
											>
												<PencilIcon className="h-5 w-5" />
											</button>
											<button 
												className="text-red-600 hover:text-red-900"
												title="Delete"
											>
												<TrashIcon className="h-5 w-5" />
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>}
				</div>

				{/* Pagination */}
				<div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 sm:px-6">
					<div className="flex-1 flex justify-between sm:hidden">
						<button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
								Previous
						</button>
						<button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
								Next
						</button>
					</div>
					<div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
						<div>
							<p className="text-sm text-gray-700">
								Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
								<span className="font-medium">97</span> results
							</p>
						</div>
						<div>
							<nav className="relative z-0 inline-flex shadow-sm -space-x-px" aria-label="Pagination">
								<button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
									Previous
								</button>
								<button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
									1
								</button>
								<button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-primary text-sm font-medium text-white">
									2
								</button>
								<button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
									3
								</button>
								<button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
									Next
								</button>
							</nav>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}