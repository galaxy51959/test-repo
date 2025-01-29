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

import LoadingSpinner from "../../components/ui/LoadingSpinner";
import HyperFormula from "hyperformula";

registerAllModules();

export default function Prompts() {
  const [loading, setLoading] = useState(true);
  const [prompts, setPrompts] = useState([]);
  const promptsRef = useRef(prompts);
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
    { data: "section", title: "Section" },
    {
      data: "type",
      title: "Type",
      type: "dropdown",
      source: [
        "SEIS",
        "DAY-C-2",
        "WRAML-3",
        "CTONI-2",
        "WJV",
        "CAS-2",
        "TAPS-4",
        "TVPS-4",
        "MVPT-4",
        "BVPT-6",
        "BG-2",
        "VMI",
        "BASC-3(Parent)",
        "BASC-3(Teacher)",
        "BASC-3(Self)",
        "Vineland-3",
        "FAR",
        "KTEA-3",
        "WRAT-5",
        "GARS-3(Parent)",
        "GARS-3(Teacher)",
        "ASRS-3",
      ],
    },
    { data: "humanPrompt", title: "Prompt", renderer: promptRenderer },
    // { data: "systemPrompt", title: "System Prompt" },
    { data: "order", title: "Order" },
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
    promptsRef.current = prompts;
  }, [prompts]);

  const fetchPrompts = async () => {
    try {
      setLoading(true);
      const response = await getPrompts();
      setPrompts(response);
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
            if (prompts[row]._id) {
              await updatePrompt(prompts[row]._id, { [prop]: newValue });
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

  console.log(prompts);

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
                data={prompts}
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
