import { useState, useEffect, useRef } from "react";
import moment from "moment";
import { HotTable } from "@handsontable/react";
import { registerAllModules } from "handsontable/registry";
import {
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
// import "handsontable/dist/handsontable.full.min.css";
import {
  getStudents,
  updateStudent,
  addStudent,
  deleteStudent,
} from "../../actions/studentActions";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import Tooltip from "../../components/ui/Tooltip";
import * as XLSX from "xlsx";
import HyperFormula from "hyperformula";

registerAllModules();

export default function Students() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const hotRef = useRef(null);

  const hyperformulaInstance = HyperFormula.buildEmpty({
    licenseKey: "internal-use-in-handsontable",
  });

  const columns = [
    { data: "firstName", title: "First Name" },
    { data: "lastName", title: "Last Name" },
    {
      data: "gender",
      title: "Gender",
      type: "dropdown",
      source: ["Male", "Female"],
    },
    {
      data: "dateOfBirth",
      title: "Date of Birth",
      type: "date",
      renderer: function (instance, td, row, col, prop, value, cellProperties) {
        if (value) {
          const date = moment(value).format("DD/MM/YYYY");
          td.innerHTML = date;
        } else {
          td.innerHTML = "";
        }
      },
    },
    { data: "grade", title: "Grade", type: "numeric" },
    { data: "school", title: "School" },
    {
      data: "language",
      title: "Language",
      type: "dropdown",
      source: [
        "English",
        "Arabic",
        "French",
        "Spanish",
        "German",
        "Italian",
        "Portuguese",
        "Dutch",
        "Russian",
        "Chinese",
        "Japanese",
        "Korean",
        "Hindi",
        "Urdu",
        "Bengali",
        "Punjabi",
        "Tamil",
        "Telugu",
        "Marathi",
        "Gujarati",
        "Kannada",
        "Malayalam",
        "Tulu",
        "Konkani",
        "Maithili",
        "Odia",
        "Assamese",
        "Bhojpuri",
        "Nepali",
        "Sindhi",
        "Sanskrit",
        "Other",
      ],
    },
    {
      data: "parent.name",
      title: "Parent Name",
    },
    {
      data: "parent.phone",
      title: "Parent Phone",
    },
    {
      data: "parent.email",
      title: "Parent Email",
      type: "text",
      validator: function (value, callback) {
        if (!value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          callback(true);
        } else {
          callback(false);
        }
      },
    },
    { data: "teacher.name", title: "Teacher Name" },
    { data: "teacher.phone", title: "Teacher Phone" },
    {
      data: "teacher.email",
      title: "Teacher Email",
      type: "text",
      validator: function (value, callback) {
        if (!value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          callback(true);
        } else {
          callback(false);
        }
      },
    },
  ];

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await getStudents();
      const transformedData = response.students.map((student) => ({
        _id: student._id,
        firstName: student.firstName,
        lastName: student.lastName,
        gender: student.gender,
        dateOfBirth: student.dateOfBirth,
        grade: student.grade,
        school: student.school,
        language: student.language,
        parent: student.parent,
        teacher: student.teacher,
      }));
      setData(transformedData);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = async (changes, source) => {
    console.log(changes, source);

    if (source === "edit" || source === "CopyPaste.paste") {
      for (const [row, prop, oldValue, newValue] of changes) {
        if (oldValue !== newValue) {
          try {
            if (data[row]._id) {
              await updateStudent(data[row]._id, { [prop]: newValue });
            } else {
              const student = await addStudent({ [prop]: newValue });
              data.splice(row, 1, student);
              setData(data);
            }
          } catch (error) {
            console.error("Error updating cell:", error);
          }
        }
      }
    }
  };

  const handleExport = () => {
    console.log(data);
    // Create worksheet from the current data
    const ws = XLSX.utils.json_to_sheet(
      data.map((item) => ({
        "First Name": item.firstName,
        "Last Name": item.lastName,
        Gender: item.gender,
        "Date of Birth": item.dateOfBirth,
        Grade: item.grade,
        School: item.school,
        Language: item.language,
        "Parent Name": item.parentName,
        "Parent Phone": item.parentPhone,
        "Parent Email": item.parentEmail,
        "Teacher Name": item.teacherName,
        "Teacher Phone": item.teacherPhone,
        "Teacher Email": item.teacherEmail,
      }))
    );

    // Create workbook and add the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");

    // Save to file
    XLSX.writeFile(wb, "students.xlsx");
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const workbook = XLSX.read(e.target.result, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const importedData = XLSX.utils.sheet_to_json(worksheet);

        // Transform imported data to match your data structure
        const transformedData = importedData.map((row) => ({
          firstName: row["First Name"] || "",
          lastName: row["Last Name"] || "",
          gender: row["Gender"] || "",
          dateOfBirth: row["Date of Birth"] || "",
          grade: row["Grade"] || "",
          school: row["School"] || "",
          parentName: row["Parent Name"] || "",
          parentPhone: row["Parent Phone"] || "",
          parentEmail: row["Parent Email"] || "",
          teacherName: row["Teacher Name"] || "",
          teacherPhone: row["Teacher Phone"] || "",
          teacherEmail: row["Teacher Email"] || "",
          _id: Date.now() + Math.random(), // Temporary ID for new rows
        }));

        setData([...transformedData, ...data]);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div className="rounded-lg">
      <div className="py-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="px-4 text-xl font-semibold">Students</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <Tooltip text="Export Excel" placement="top">
                <button
                  onClick={handleExport}
                  className="px-4 py-2 bg-green-600 text-sm text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                >
                  <ArrowDownTrayIcon className="h-5 w-5 text-white" />
                </button>
              </Tooltip>
              {/* <Tooltip text="Import Excel" placement="top"> */}
              <label className="px-4 py-2 bg-orange-600 text-sm text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors cursor-pointer">
                <ArrowUpTrayIcon className="h-5 w-5 text-white" />
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>
              {/* </Tooltip> */}
            </div>
          </div>
        </div>
        {/* <div className="px-6 py-4 border-b border-gray-200">
          
        </div> */}

        {/* Main Content */}
        <div className="flex-1">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="border rounded-lg shadow-sm">
              <HotTable
                formulas={{
                  engine: hyperformulaInstance,
                  sheetName: "Students",
                }}
                ref={hotRef}
                data={data}
                columns={columns}
                colHeaders={true}
                rowHeaders={true}
                height="calc(100vh - 200px)"
                width="100%"
                licenseKey="non-commercial-and-evaluation"
                afterChange={handleChange}
                contextMenu={true}
                filters={true}
                dropdownMenu={true}
                multiColumnSorting={true}
                manualColumnResize={true}
                manualRowResize={true}
                stretchH="all"
                autoWrapRow={true}
                className="htCustomStyles"
                settings={{
                  className: "htMiddle",
                  currentHeaderClassName: "current-header",
                  currentRowClassName: "current-row",
                  currentColClassName: "current-col",
                  invalidCellClassName: "invalid-cell",
                }}
                style={{
                  fontSize: "14px",
                  fontFamily: "Inter, sans-serif",
                }}
                customBorders={true}
                comments={true}
                search={true}
                mergeCells={true}
                copyPaste={true}
                fillHandle={true}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
