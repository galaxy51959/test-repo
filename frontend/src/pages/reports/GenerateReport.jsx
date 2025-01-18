import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { getStudents } from '../../actions/studentActions';

import { REPORT_TEMPLATE_TYPE } from '../../contants/reportConst';
import { generateReport } from '../../actions/reportActions';

export default function GenerateReport() {
	const navigate = useNavigate();
	const [students, setStudents] = useState([]);
	const [loading, setLoading] = useState(false);

	const [studentId, setStudentId] = useState();
	const [templateType, setTemplateType] = useState();

	useEffect(() => {
		fetchStudent();
	}, []);

	const fetchStudent = async () => {
		try {
			const data = await getStudents();
			setStudents(data.students);
		} catch (err) {
			console.error("Error: ", err);
		}
	}

	const handleGenerate = async e => {
		e.preventDefault();
		console.log("Student ID: ", studentId);
		console.log("Template Type: ", templateType);

		try {
			setLoading(true);
			const data = await generateReport(studentId, templateType);
			console.log("Log Data: ", data);
			const a = window.open(`http://localhost:5000/${data.fileName}`, '_blank');
			console.log("Log A: ", a);
		} catch (err) {
			console.error("Error: ", err);
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="bg-white rounded-lg shadow">
			<div className="p-6">
				{/* Header with back button */}
				<div className="flex items-center mb-6">
					<button 
						onClick={() => navigate('/reports')}
						className="mr-4 p-2 hover:bg-gray-100 rounded-lg"
					>
						<ArrowLeftIcon className="h-5 w-5 text-gray-600" />
					</button>
					<h1 className="text-2xl font-semibold">Generate New Report</h1>
				</div>

				{/* Report Generation Form */}
				<form className="max-w-2xl space-y-6" onSubmit={handleGenerate}>
					{/* Student Selection */}
					<div>
						<label htmlFor="student" className="block text-sm font-medium text-gray-700 mb-2">
							Select Student
						</label>
						<select
							id="student"
							value={studentId}
							onChange={e => setStudentId(e.target.value)}
							className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
							required
						>
							<option value="">Choose a student...</option>
							{students.length > 0 && students.map(student => 
								<option value={student._id} key={student._id}>
									{`${student.firstName} ${student.lastName}`}
								</option>
							)}
							{/* Add your student options here */}
						</select>
					</div>

					{/* Report Type Selection */}
					<div>
						<label htmlFor="reportType" className="block text-sm font-medium text-gray-700 mb-2">
							Report Type
						</label>
						<select
							id="reportType"
							value={templateType}
							onChange={e => setTemplateType(e.target.value)}
							className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
							required
						>
							<option value="">Select report type...</option>
							{REPORT_TEMPLATE_TYPE.map(type => 
								<option value={type} key={type}>
									{type}
								</option>
							)}
						</select>
					</div>

					{/* Action Buttons */}
					<div className="flex justify-end space-x-4 pt-4">
						<button
								type="button"
								onClick={() => navigate('/reports')}
								className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
						>
							Cancel
						</button>
						<button
							type="submit"
							className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
							disabled={loading}
						>
							{loading ? 'Generating...' : 'Generate Report'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}