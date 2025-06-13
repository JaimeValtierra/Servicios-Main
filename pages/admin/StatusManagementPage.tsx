
import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { DocumentStatus, ManagedDocumentStatuses, DocumentTypeKey } from '../../types';
import { SaveIcon, TagIcon } from '../../components/icons/Icons';
import { DOCUMENT_TYPES_LABELS } from '../../constants';

const StatusManagementPage: React.FC = () => {
  const { managedStatusesConfig, updateManagedStatusesConfig } = useData();
  
  // Local state to manage changes before saving
  const [localConfig, setLocalConfig] = useState<ManagedDocumentStatuses[]>(
    JSON.parse(JSON.stringify(managedStatusesConfig)) // Deep copy
  );

  const handleStatusChange = (
    docTypeKey: DocumentTypeKey,
    status: DocumentStatus,
    isChecked: boolean
  ) => {
    setLocalConfig(prevConfig =>
      prevConfig.map(configItem => {
        if (configItem.documentTypeKey === docTypeKey) {
          const newAvailableStatusNames = isChecked
            ? [...configItem.availableStatusNames, status]
            : configItem.availableStatusNames.filter(s => s !== status);
          return { ...configItem, availableStatusNames: newAvailableStatusNames };
        }
        return configItem;
      })
    );
  };

  const handleSaveChanges = (docTypeKey: DocumentTypeKey) => {
    const configToSave = localConfig.find(c => c.documentTypeKey === docTypeKey);
    if (configToSave) {
      updateManagedStatusesConfig(docTypeKey, configToSave.availableStatusNames);
      alert(`Configuración de estados para ${DOCUMENT_TYPES_LABELS[docTypeKey]} guardada.`);
    }
  };

  const allPossibleStatuses = Object.values(DocumentStatus);

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center space-x-3">
        <TagIcon className="w-8 h-8 text-brand-primary" />
        <h1 className="text-3xl font-semibold text-gray-800">Gestión de Estados de Documentos</h1>
      </div>

      <p className="text-gray-600">
        Configure qué estados están disponibles para cada tipo de documento en el sistema. 
        Los cambios aquí afectarán los estados seleccionables al crear o editar documentos.
      </p>

      <div className="space-y-10">
        {localConfig.map(configItem => (
          <section key={configItem.documentTypeKey} className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6 border-b pb-3">
              {configItem.documentTypeLabel}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {allPossibleStatuses.map(statusValue => (
                <div key={statusValue} className="flex items-center space-x-2 p-2 border rounded-md hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    id={`${configItem.documentTypeKey}-${statusValue}`}
                    value={statusValue}
                    checked={configItem.availableStatusNames.includes(statusValue)}
                    onChange={e =>
                      handleStatusChange(configItem.documentTypeKey, statusValue, e.target.checked)
                    }
                    className="h-5 w-5 text-brand-primary rounded border-gray-300 focus:ring-brand-primary-dark"
                  />
                  <label
                    htmlFor={`${configItem.documentTypeKey}-${statusValue}`}
                    className="text-sm font-medium text-gray-700 select-none"
                  >
                    {statusValue}
                  </label>
                </div>
              ))}
            </div>
            <div className="mt-6 text-right">
              <button
                onClick={() => handleSaveChanges(configItem.documentTypeKey)}
                className="flex items-center justify-center px-6 py-2.5 bg-brand-primary text-white rounded-md hover:bg-brand-primary-dark transition-colors text-sm font-medium shadow-sm"
              >
                <SaveIcon className="w-5 h-5 mr-2" />
                Guardar Cambios para {configItem.documentTypeLabel}
              </button>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default StatusManagementPage;
