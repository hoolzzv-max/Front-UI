import Editor from "@monaco-editor/react";
import { FileCode2, Save } from "lucide-react";
import { EDITOR_CONFIG } from "../../../config/editor";
import { useEditor } from "../hooks/useEditor";
import { FileTabs } from "./FileTabs";

export function EditorPanel() {
  const {
    activeFilePath,
    dirtyFilePaths,
    getActiveFile,
    getTabs,
    setActiveFile,
    closeFile,
    updateFileContent,
    saveFile,
    saveAll,
  } = useEditor();

  const activeFile = getActiveFile();
  const tabs = getTabs();

  const isDirty =
    activeFilePath !== null && dirtyFilePaths.includes(activeFilePath);

  return (
    <section className="flex h-full min-h-0 flex-col bg-neutral-950">
      <header className="flex h-12 shrink-0 items-center justify-between border-b border-neutral-800 px-4">
        <div>
          <h2 className="text-sm font-semibold text-neutral-100">Editor</h2>
          <p className="text-xs text-neutral-500">
            File editing workspace
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => activeFilePath && saveFile(activeFilePath)}
            disabled={!isDirty || !activeFilePath}
            type="button"
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs text-neutral-400 transition hover:border-neutral-700 hover:text-neutral-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save size={14} />
            Save
          </button>

          <button
            onClick={saveAll}
            disabled={dirtyFilePaths.length === 0}
            type="button"
            className="rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs text-neutral-400 transition hover:border-neutral-700 hover:text-neutral-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Save All
          </button>
        </div>
      </header>

      <FileTabs
        tabs={tabs}
        activePath={activeFilePath}
        onSelect={setActiveFile}
        onClose={closeFile}
      />

      <div className="min-h-0 flex-1">
        {!activeFile ? (
          <div className="flex h-full items-center justify-center p-6 text-center">
            <div className="max-w-sm">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900 text-neutral-400">
                <FileCode2 size={24} />
              </div>

              <h3 className="text-sm font-semibold text-neutral-200">
                No file selected
              </h3>

              <p className="mt-2 text-sm leading-6 text-neutral-500">
                افتح ملفًا من Explorer لاحقًا، أو أنشئ ملفًا عبر editorStore.
              </p>
            </div>
          </div>
        ) : (
          <Editor
            key={activeFile.path}
            path={activeFile.path}
            value={activeFile.content}
            language={activeFile.language ?? "plaintext"}
            theme="vs-dark"
            onChange={(value) => {
              updateFileContent(activeFile.path, value ?? "");
            }}
            options={{
              fontSize: EDITOR_CONFIG.fontSize,
              fontFamily: EDITOR_CONFIG.fontFamily,
              tabSize: EDITOR_CONFIG.tabSize,
              wordWrap: EDITOR_CONFIG.wordWrap,
              minimap: {
                enabled: EDITOR_CONFIG.minimap,
              },
              lineNumbers: EDITOR_CONFIG.lineNumbers ? "on" : "off",
              automaticLayout: true,
              scrollBeyondLastLine: false,
              smoothScrolling: true,
              padding: {
                top: 16,
                bottom: 16,
              },
            }}
          />
        )}
      </div>
    </section>
  );
}
