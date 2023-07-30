import { useEffect, useState } from 'react';
import './App.css'
// eslint-disable-next-line import/no-named-as-default
import styled from "styled-components"

const FileStyled = styled.div`
  text-align: left;
`;

const DirStyled = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
`;

const DirList = styled.div`
  margin-left: 10px;
`
const DirCollapser = styled.span`
  margin-right: 1px;
  cursor: pointer;
`

const Editor = styled.textarea<{ $error?: boolean }>`
  @media (max-width: 400px) {
    min-width: 90%;
  }
  min-height: 500px;
  min-width: 300px;
  font-family: monospace;
  font-size: 0.8rem;
  ${props => props.$error ? "background: #ff00004a;" : ""}
`
const Layout = styled.div`
  width: 100%;
  display: flex;

  @media (max-width: 400px) {
    flex-direction: column;
    & > :nth-child(2) {
      margin-top: 30px;
      background: blue !important;
    }
  }
  
  @media (min-width: 500px) {
    justify-content: space-around;
  }
`

type File = {
  name: string;
}

type Dir = {
  name: string;

  files: File[]
  dirs: Dir[]
}

type TreeFileViewerProps = {
  root: Dir;
};

const TreeFileViewer: React.FC<TreeFileViewerProps> = ({ root }) => {
  return (
    <DirCompoennt dir={root} />
  )
}

type FileProps = {
  file: File;
}

const FileComponent: React.FC<FileProps> = ({ file }) => {
  return <FileStyled>□ {file.name}</FileStyled>
}

type DirProps = {
  dir: Dir;
}

const DirCompoennt: React.FC<DirProps> = ({ dir }) => {
  const [expanded, setExpanded] = useState<boolean>(true)
  return (
    <DirStyled>
      <div>
        <DirCollapser onClick={() => setExpanded(!expanded)}>{expanded ? "⌄" : "›"}</DirCollapser> 📁 {dir.name}
      </div>
      {
        expanded && (
          <><DirList>
            {dir.files.map((child, idx) => {
              return <FileComponent file={child} key={`${child.name}-${idx}-file`} />;
            })}
          </DirList><DirList>
              {dir.dirs.map((child, idx) => {
                return <DirCompoennt dir={child} key={`${child.name}-${idx}-dir`} />;
              })}
            </DirList></>
        )
      }
    </DirStyled>
  )
}

const exampleDir: Dir = {
  name: 'root',
  files: [{
    name: "package-lock.json"
  }, {
    name: "package.json"
  },
  { name: "vite.config.ts" }
  ],
  dirs: [
    {
      name: 'assets',
      files: [{ name: 'assets.css' }],
      dirs: [
        {
          name: "images",
          files: [
            { name: "background.png" },
          ],
          dirs: [
            {
              name: "empty_dir",
              files: [],
              dirs: []
            }
          ]
        }
      ]
    }
  ]
}

// Validator function for File type
function isValidFile(data: any): data is File {
  return typeof data === "object" && data !== null && typeof data.name === "string";
}

// Validator function for Dir type
function isValidDir(data: any): data is Dir {
  if (typeof data === "object" && data !== null) {
    if (typeof data.name === "string" && Array.isArray(data.files) && Array.isArray(data.dirs)) {
      for (const file of data.files) {
        if (!isValidFile(file)) {
          return false;
        }
      }

      for (const dir of data.dirs) {
        if (!isValidDir(dir)) {
          return false;
        }
      }

      return true;
    }
  }
  return false;
}


function App() {

  const [dir, setDir] = useState<Dir>(exampleDir)
  const [dirInput, setDirInput] = useState(JSON.stringify(exampleDir, (2 as any), 2))
  const [inputError, setInputError] = useState<boolean>(false);

  useEffect(() => {
    try {
      const userDir: unknown = JSON.parse(dirInput)
      if (isValidDir(userDir)) {
        setDir(userDir as Dir);
        setInputError(false);
        return;
      }
      setInputError(true);
    } catch (err) {
      setInputError(true);
    }
  }, [dirInput]);

  return (
    <>
      <h1>TREE FILE VIEWER</h1>
      <Layout>
        <TreeFileViewer root={dir} />
        <div>
          <div>
            <Editor $error={inputError} value={dirInput} onChange={e => setDirInput(e.target.value)} />
          </div>
          <div>
            Try Editing It!
          </div>
        </div>
      </Layout>
    </>
  )
}

export default App
