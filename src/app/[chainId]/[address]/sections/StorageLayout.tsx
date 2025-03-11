import { StorageLayoutData } from "@/types/contract";

interface StorageLayoutProps {
  storageLayout: StorageLayoutData;
}

export default function StorageLayout({ storageLayout }: StorageLayoutProps) {
  if (!storageLayout || !storageLayout.types) return null;

  // Function to resolve type name from the types record
  const resolveTypeName = (type: string): string => {
    const typeInfo = storageLayout.types?.[type];
    if (!typeInfo) return type;

    if (typeInfo.key && typeInfo.value) {
      // Handle mappings
      const keyType = resolveTypeName(typeInfo.key);
      const valueType = resolveTypeName(typeInfo.value);
      return `mapping(${keyType} ⇒ ${valueType})`;
    }

    return typeInfo.label;
  };

  return (
    <div>
      <div className="flex items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Storage Layout</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Slot
              </th>
              <th
                scope="col"
                className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Offset
              </th>
              <th
                scope="col"
                className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Bytes
              </th>

              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Label
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Type
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Contract
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {storageLayout.storage.map((item, index) => {
              const typeInfo = storageLayout.types?.[item.type];
              const isEvenSlot = Number(item.slot) % 2 === 0;
              return (
                <tr key={index} className={`${isEvenSlot ? "bg-white" : "bg-gray-50"}`}>
                  <td className="px-2 py-2 text-center whitespace-nowrap text-sm text-gray-500">{item.slot}</td>
                  <td className="px-2 py-2 text-center whitespace-nowrap text-sm text-gray-500">{item.offset}</td>
                  <td className="px-2 py-2 text-center whitespace-nowrap text-sm text-gray-500">
                    {typeInfo?.numberOfBytes || "N/A"}
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900">{item.label}</td>
                  <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500 font-mono">
                    {resolveTypeName(item.type)}
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">{item.contract}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
