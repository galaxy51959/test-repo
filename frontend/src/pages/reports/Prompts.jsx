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
    { data: "attachments", title: "Attachments" },
    { data: "humanPrompt", title: "Prompt", renderer: promptRenderer },
    { data: "systemPrompt", title: "System Prompt" },
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
      const template = await getPrompts();
      const result = [];
      if (template) {
        template.sections.forEach((section) => {
          section.prompts.forEach((prompt) => {
            result.push({
              _id: prompt._id,
              title: section.title,
              attachments: prompt.attachments
                ? prompt.attachments.join(" | ")
                : "",
              humanPrompt: prompt.humanPrompt,
              systemPrompt: prompt.systemPrompt,
            });
          });
        });
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
            console.log(data[row]);
            if (data[row]._id) {
              await updatePrompt(
                {
                  promptId: data[row].promptId,
                  sectionId: data[row].sectionId,
                },
                { [prop]: newValue }
              );
            } else {
              const newData = await createPrompt({ [prop]: newValue });
              prompts.splice(row, 1, newData);
              setPrompts([...prompts]);
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
