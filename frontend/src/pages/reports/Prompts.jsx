import { useState, useEffect, useRef } from "react";
import { HotTable } from "@handsontable/react";
import { registerAllModules } from "handsontable/registry";
import {
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

import {
  getPrompts,
  updatePrompt,
  createPrompt,
} from "../../actions/promptActions";
import { getTemplate } from "../../actions/reportActions";

import LoadingSpinner from "../../components/ui/LoadingSpinner";
import HyperFormula from "hyperformula";

registerAllModules();

export default function Prompts() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
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
    td.innerHTML = value && value.substring(0, 100) + "...";
  };

  const columns = [
    { data: "title", title: "Section Title" },
    // {
    //   data: "attachments",
    //   title: "Attachments",
    //   // type: "autocomplete",
    //   // source: [
    //   //   "No File",
    //   //   "SEIS",
    //   //   "INTERVIEW(Parent)",
    //   //   "INTERVIEW(Teacher)",
    //   //   "Essential Observation",
    //   //   "Classroom Observation",
    //   //   "DAY-C-2",
    //   //   "WRAML-3",
    //   //   "CTONI-2",
    //   //   "WJV",
    //   //   "CAS-2",
    //   //   "TAPS-4",
    //   //   "TVPS-4",
    //   //   "MVPT-4",
    //   //   "BVPT-6",
    //   //   "BG-2",
    //   //   "VMI",
    //   //   "BASC-3(Parent)",
    //   //   "BASC-3(Teacher)",
    //   //   "BASC-3(Self)",
    //   //   "Vineland-3",
    //   //   "FAR",
    //   //   "KTEA-3",
    //   //   "WRAT-5",
    //   //   "WISC-V",
    //   //   "GARS-3(Parent)",
    //   //   "GARS-3(Teacher)",
    //   //   "ASRS-3(Parent)",
    //   //   "ASRS-3(Teacher)",
    //   //   "SUMMARY",
    //   //   "ELLIGIBILITY",
    //   // ],
    //   renderer: (instance, td, row, col, prop, value, cellProperties) => {
    //     const safeValue = Array.isArray(value) ? value : [];
    //     td.innerHTML = safeValue.length > 0 ? safeValue.join(', ') : "";
    //     return td;
    //   },
    // },
    {
      data: "attachments",
      title: "Attachments",
      renderer: (instance, td, row, col, prop, value, cellProperties) => {
        if (!value) {
          td.innerHTML = '';
          return td;
        }
        
        const safeValue = Array.isArray(value) ? value : [value];
        
        const displayValue = safeValue
          .filter(item => item != null && item !== '')
          .join(', ');
          
        td.innerHTML = displayValue;
        return td;
      },
    },
    { data: "humanPrompt", title: "Prompt", renderer: promptRenderer },
    { data: "systemPrompt", title: "System Prompt" },
    { data: "order", title: "Order" },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  // useEffect(() => {
  //   promptsRef.current = prompts;
  // }, [prompts]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const template = await getTemplate();
      const result = [];
      if (template) {
        template.sections.forEach((section) => {
          section.prompts.forEach(prompt => {
            result.push({
              _id: prompt._id,
              title: section.title,
              attachments: prompt.need.join(", "),
              humanPrompt: prompt.humanPrompt,
              systemPrompt: section.systemPrompt,
              order: section.order
            })
          })
        })
      }
      setData(result);
    } catch (error) {
      console.error("Error fetching prompts:", error);
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
              await updatePrompt(data[row]._id, { [prop]: newValue });
            } else {
              const data = await createPrompt({ [prop]: newValue });
              prompts.splice(row, 1, data);
              setPrompts(prompts);
            }
          } catch (error) {
            console.error("Error updating cell:", error);
          }
        }
      }
    }
  };

  const handleRemoveRow = (index, amount, physicalRows, [source]) => {
    console.log(index, amount, physicalRows, source);
    // console.log(prompts[index]);
  };

  const handleRowMove = (
    movedRows,
    finalIndex,
    dropIndex,
    movePossible,
    orderChanged
  ) => {
    console.log(movedRows, finalIndex, dropIndex, movePossible, orderChanged);
    if (!movePossible) {
      return;
    }
    const originalLength = prompts.length;
    prompts.splice(
      finalIndex,
      0,
      movedRows.map((row) => prompts[row])
    );
    console.log(prompts);
    prompts.splice(originalLength);
    console.log(prompts);
    setPrompts(prompts);
  };

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
                  sheetName: "Prompts - Initial",
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
                afterRemoveRow={handleRemoveRow}
                afterRowMove={handleRowMove}
                contextMenu={true}
                filters={true}
                dropdownMenu={true}
                multiColumnSorting={true}
                manualColumnResize={true}
                manualRowResize={true}
                manualRowMove={true}
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
