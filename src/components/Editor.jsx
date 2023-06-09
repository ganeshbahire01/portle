import React, { useState, useEffect } from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
} from "draft-js";
import "draft-js/dist/Draft.css";
const MyEditor = () => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  useEffect(() => {
    const savedContent = localStorage.getItem("editorContent");
    if (savedContent !== null) {
      const contentState = convertFromRaw(JSON.parse(savedContent));
      setEditorState(EditorState.createWithContent(contentState));
    }
  }, []);

  const onChange = (newEditorState) => {
    handleBeforeInput(newEditorState);
    setEditorState(newEditorState);
  };

  const handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      onChange(newState);
      return "handled";
    }
    return "not-handled";
  };

  const onTab = (event) => {
    const maxDepth = 4;
    setEditorState(RichUtils.onTab(event, editorState, maxDepth));
  };

  const saveContent = () => {
    const contentState = editorState.getCurrentContent();
    const rawContent = JSON.stringify(convertToRaw(contentState));
    localStorage.setItem("editorContent", rawContent);
    alert("Content Saved Sucesfully")
  };

  const handleBeforeInput = (input) => {
    if (input === "#") {
      setEditorState(RichUtils.toggleBlockType(editorState, "header-one"));
      return "handled";
    } else if (input === "*") {
      setEditorState(RichUtils.toggleInlineStyle(editorState, "BOLD"));
      return "handled";
    }
    return "not-handled";
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "80%",
          margin: "auto",
        }}
      >
        <h1>Editor By Ganesh Bahire</h1>
        <button
          style={{
            backgroundColor: "green",
            color: "white",
            width: "150px",
            height: "50px",
            margin: "auto",
          }}
          onClick={saveContent}
        >
          Save
        </button>
      </div>

      <div
        style={{
          height: "80vh",
          width: "80%",
          border: "1px solid blue",
          margin: "auto",
        }}
      >
        <Editor
          editorState={editorState}
          onChange={onChange}
          handleKeyCommand={handleKeyCommand}
          onTab={onTab}
          handleBeforeInput={handleBeforeInput}
        />
      </div>
    </>
  );
};

export default MyEditor;
