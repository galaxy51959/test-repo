import { useState, useEffect, useRef } from "react";
import { HotTable } from "@handsontable/react";
import { registerAllModules } from "handsontable/registry";
import {
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

import { getPrompts, updatePrompt } from "../../actions/promptActions";

import LoadingSpinner from "../../components/ui/LoadingSpinner";
import HyperFormula from "hyperformula";

registerAllModules();

export default function Prompts() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const dataRef = useRef(data);
  const hotRef = useRef(null);

  const hyperformulaInstance = HyperFormula.buildEmpty({
    licenseKey: "internal-use-in-handsontable",
  });

  const promptRenderer = (
    instance,
    td,
    row,
    col,
    prop,
    value,
    cellProperties
  ) => {
    td.innerHTML = value.substring(0, 100) + "...";
  };

  const columns = [
    { data: "protocol", title: "Protocol" },
    { data: "humanPrompt", title: "Prompt", renderer: promptRenderer },
    // { data: "systemPrompt", title: "System Prompt" },
    // { data: "order", title: "Order" },
  ];

  useEffect(() => {
    fetchPrompts();
    // return () => {
    //   console.log(dataRef.current);
    //   const lastStudent = dataRef.current[dataRef.current.length - 1];
    //   if (
    //     lastStudent &&
    //     Object.keys(lastStudent).findIndex(
    //       (key) =>
    //         lastStudent[key] === "" ||
    //         lastStudent[key] === null ||
    //         lastStudent[key] === undefined
    //     ) > -1
    //   ) {
    //     console.log("DELETE");
    //     deleteStudent(lastStudent._id);
    //   }
    // };
  }, []);

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  const fetchPrompts = async () => {
    try {
      setLoading(true);
      const response = await getPrompts();
      setData(response);
    } catch (error) {
      console.error("Error fetching prompts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = async (changes, source) => {
    console.log(changes, source);

    if (source === "edit" || source === "paste") {
      for (const [row, prop, oldValue, newValue] of changes) {
        if (oldValue !== newValue) {
          try {
            data[row]._id
              ? await updatePrompt(data[row]._id, { [prop]: newValue })
              : await createPrompt({ [prop]: newValue });
          } catch (error) {
            console.error("Error updating cell:", error);
          }
        }
      }
    }
  };

  //   const addNewStudent = async () => {
  //     console.log("Add Student:");
  //     const newStudent = {
  //       firstName: "",
  //       lastName: "",
  //       gender: "Male",
  //       dateOfBirth: "",
  //       grade: "",
  //       school: "",
  //       parentName: "",
  //       parentPhone: "",
  //       parentEmail: "",
  //       teacherName: "",
  //       teacherPhone: "",
  //       teacherEmail: "",
  //     };

  //     setData([...data, newStudent]);

  //     const response = await addStudent(newStudent);
  //     data.push(response);
  //     setData(data);

  //     // Focus on the first cell of the new row
  //     if (hotRef.current && hotRef.current.hotInstance) {
  //       setTimeout(() => {
  //         hotRef.current.hotInstance.selectCell(data.length, 0);
  //       }, 100);
  //     }
  //   };

  //   const handleExport = () => {
  //     console.log(data);
  //     // Create worksheet from the current data
  //     const ws = XLSX.utils.json_to_sheet(
  //       data.map((item) => ({
  //         "First Name": item.firstName,
  //         "Last Name": item.lastName,
  //         Gender: item.gender,
  //         "Date of Birth": item.dateOfBirth,
  //         Grade: item.grade,
  //         School: item.school,
  //         Language: item.language,
  //         "Parent Name": item.parentName,
  //         "Parent Phone": item.parentPhone,
  //         "Parent Email": item.parentEmail,
  //         "Teacher Name": item.teacherName,
  //         "Teacher Phone": item.teacherPhone,
  //         "Teacher Email": item.teacherEmail,
  //       }))
  //     );

  //     // Create workbook and add the worksheet
  //     const wb = XLSX.utils.book_new();
  //     XLSX.utils.book_append_sheet(wb, ws, "Students");

  //     // Save to file
  //     XLSX.writeFile(wb, "students.xlsx");
  //   };

  //   const handleImport = (e) => {
  //     const file = e.target.files[0];
  //     if (file) {
  //       const reader = new FileReader();
  //       reader.onload = (e) => {
  //         const workbook = XLSX.read(e.target.result, { type: "array" });
  //         const sheetName = workbook.SheetNames[0];
  //         const worksheet = workbook.Sheets[sheetName];
  //         const importedData = XLSX.utils.sheet_to_json(worksheet);

  //         // Transform imported data to match your data structure
  //         const transformedData = importedData.map((row) => ({
  //           firstName: row["First Name"] || "",
  //           lastName: row["Last Name"] || "",
  //           gender: row["Gender"] || "",
  //           dateOfBirth: row["Date of Birth"] || "",
  //           grade: row["Grade"] || "",
  //           school: row["School"] || "",
  //           parentName: row["Parent Name"] || "",
  //           parentPhone: row["Parent Phone"] || "",
  //           parentEmail: row["Parent Email"] || "",
  //           teacherName: row["Teacher Name"] || "",
  //           teacherPhone: row["Teacher Phone"] || "",
  //           teacherEmail: row["Teacher Email"] || "",
  //           _id: Date.now() + Math.random(), // Temporary ID for new rows
  //         }));

  //         setData([...transformedData, ...data]);
  //       };
  //       reader.readAsArrayBuffer(file);
  //     }
  //   };

  return (
    <div className="rounded-lg">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center mb-4">
          <h1 className="pl-4 text-xl font-semibold">Prompts</h1>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="border rounded-lg shadow-sm">
              <HotTable
                formulas={{
                  engine: hyperformulaInstance,
                  sheetName: "Prompts",
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
