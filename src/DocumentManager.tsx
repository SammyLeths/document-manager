import React, { useState } from "react";
import { FaFolder, FaFileAlt } from "react-icons/fa";
import {
  AiOutlineSortAscending,
  AiOutlineSortDescending,
} from "react-icons/ai";
import { CiFileOn } from "react-icons/ci";

type File = {
  type: string;
  name: string;
  size: string;
  added: string;
};

type Folder = {
  type: "folder";
  name: string;
  files: (File | Folder)[];
};

type FileOrFolder = File | Folder;

const initialData: FileOrFolder[] = [
  {
    type: "pdf",
    name: "Employee Handbook",
    size: "156 kb",
    added: "2017-01-06",
  },
  {
    type: "pdf",
    name: "Public Holiday policy",
    size: "90 kb",
    added: "2016-12-06",
  },
  {
    type: "folder",
    name: "Expenses",
    files: [
      {
        type: "doc",
        name: "Expenses claim form",
        size: "45 kb",
        added: "2017-05-02",
      },
      {
        type: "doc",
        name: "Fuel allowances",
        size: "75 kb",
        added: "2017-05-03",
      },
    ],
  },
  { type: "csv", name: "Cost centres", size: "23 kb", added: "2016-08-12" },
  {
    type: "folder",
    name: "Misc",
    files: [
      {
        type: "doc",
        name: "Christmas party",
        size: "12 kb",
        added: "2017-12-01",
      },
      {
        type: "mov",
        name: "Welcome to the company!",
        size: "450 mb",
        added: "2015-04-24",
      },
    ],
  },
];

const DocumentManager: React.FC = () => {
  const [currentFolder, setCurrentFolder] =
    useState<FileOrFolder[]>(initialData);
  const [breadcrumb, setBreadcrumb] = useState<Folder[]>([]);
  const [filter, setFilter] = useState("");
  const [sortOption, setSortOption] = useState<{
    column: string;
    order: string;
  }>({
    column: "name",
    order: "asc",
  });

  const openFolder = (folder?: Folder) => {
    if (!folder) {
      setBreadcrumb([]);
      setCurrentFolder(initialData);
      return;
    }
    setBreadcrumb([...breadcrumb, folder]);
    setCurrentFolder(folder.files);
  };

  const filteredFiles = currentFolder.filter(
    (item) =>
      "name" in item && item.name.toLowerCase().includes(filter.toLowerCase())
  );

  const sortedFiles = filteredFiles.sort((a, b) => {
    if (sortOption.column === "name") {
      return sortOption.order === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    }

    if (sortOption.column === "size") {
      const parseSize = (size: string) => {
        const [value, unit] = size.toLowerCase().split(" ");
        const factor = unit === "kb" ? 1 : unit === "mb" ? 1024 : 0;
        return parseFloat(value) * factor;
      };

      if ("size" in a && "size" in b) {
        return sortOption.order === "asc"
          ? parseSize(a.size) - parseSize(b.size)
          : parseSize(b.size) - parseSize(a.size);
      }
      return 0;
    }

    if (sortOption.column === "added") {
      const getDate = (item: FileOrFolder) =>
        "added" in item ? new Date(item.added).getTime() : 0;

      return sortOption.order === "asc"
        ? getDate(a) - getDate(b)
        : getDate(b) - getDate(a);
    }

    return 0;
  });

  const handleSort = (column: string, order: string) => {
    setSortOption({ column, order });
  };

  return (
    <div className="">
      <div className="flex items-center space-x-2 mb-4">
        <span
          className="text-blue-500 cursor-pointer"
          onClick={() => openFolder(undefined)}
        >
          Documents
        </span>
        {breadcrumb.map((folder, index) => (
          <React.Fragment key={index}>
            <span className="mx-1">/</span>
            <span
              className="text-blue-500 cursor-pointer"
              onClick={() => {
                setBreadcrumb(breadcrumb.slice(0, index + 1));
                setCurrentFolder(folder.files);
              }}
            >
              {folder.name}
            </span>
          </React.Fragment>
        ))}
      </div>

      <div className="mb-4">
        <input
          type="text"
          className="w-[50%] p-2 border rounded"
          placeholder="Filter by filename..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>
      <div className="p-2 bg-gray-300 overflow-hidden">
        <div className="overflow-x-auto bg-white">
          <table className="w-full table-auto border-collapse">
            <thead className="text-left">
              <tr className="bg-gray-100">
                <th className="p-2 border">
                  <CiFileOn size={20} className="" />
                </th>
                <th className="p-2 border flex">
                  Name
                  <div className="flex ml-4">
                    <a
                      className={`inline-block cursor-pointer p-1 hover:bg-gray-300 ${
                        sortOption.column === "name" &&
                        sortOption.order === "asc"
                          ? "bg-gray-300"
                          : ""
                      }`}
                      onClick={() => handleSort("name", "asc")}
                      aria-label="Name Ascending"
                    >
                      <AiOutlineSortAscending />
                      <span className="sr-only">Name Ascending</span>
                    </a>
                    <a
                      className={`inline-block cursor-pointer ml-1 p-1 hover:bg-gray-300 ${
                        sortOption.column === "name" &&
                        sortOption.order === "desc"
                          ? "bg-gray-300"
                          : ""
                      }`}
                      onClick={() => handleSort("name", "desc")}
                      aria-label="Name Descending"
                    >
                      <AiOutlineSortDescending />
                      <span className="sr-only">Name Descending</span>
                    </a>
                  </div>
                </th>
                <th className="p-2 border">Type</th>
                <th className="p-2 border flex">
                  Size
                  <div className="flex ml-4">
                    <a
                      className={`inline-block cursor-pointer p-1 hover:bg-gray-300 ${
                        sortOption.column === "size" &&
                        sortOption.order === "asc"
                          ? "bg-gray-300"
                          : ""
                      }`}
                      onClick={() => handleSort("size", "asc")}
                    >
                      <AiOutlineSortAscending />
                    </a>
                    <a
                      className={`inline-block cursor-pointer ml-1 p-1 hover:bg-gray-300 ${
                        sortOption.column === "size" &&
                        sortOption.order === "desc"
                          ? "bg-gray-300"
                          : ""
                      }`}
                      onClick={() => handleSort("size", "desc")}
                    >
                      <AiOutlineSortDescending />
                    </a>
                  </div>
                </th>
                <th className="p-2 border">
                  <div className="flex">
                    Added
                    <div className="flex ml-4">
                      <a
                        className={`inline-block cursor-pointer p-1 hover:bg-gray-300 ${
                          sortOption.column === "added" &&
                          sortOption.order === "asc"
                            ? "bg-gray-300"
                            : ""
                        }`}
                        onClick={() => handleSort("added", "asc")}
                      >
                        <AiOutlineSortAscending />
                      </a>
                      <a
                        className={`inline-block cursor-pointer ml-1 p-1 hover:bg-gray-300 ${
                          sortOption.column === "added" &&
                          sortOption.order === "desc"
                            ? "bg-gray-300"
                            : ""
                        }`}
                        onClick={() => handleSort("added", "desc")}
                      >
                        <AiOutlineSortDescending />
                      </a>
                    </div>
                  </div>
                </th>
              </tr>
            </thead>

            <tbody>
              {sortedFiles.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-2 border">
                    {item.type === "folder" ? <FaFolder /> : <FaFileAlt />}
                  </td>
                  <td
                    className="p-2 border cursor-pointer"
                    onClick={() => {
                      if (item.type === "folder") openFolder(item as Folder);
                    }}
                  >
                    {item.name}
                  </td>
                  <td className="p-2 border">{item.type}</td>
                  <td className="p-2 border">
                    {item.type === "folder" ? "-" : (item as File).size}
                  </td>
                  <td className="p-2 border">
                    {item.type === "folder" ? "-" : (item as File).added}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DocumentManager;
