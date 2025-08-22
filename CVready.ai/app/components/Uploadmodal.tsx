import React, { useState, useRef, useEffect } from "react";
import { X, Upload, Check } from "lucide-react";
import Modal from "./Modal";
import { toast } from "react-toastify";

type Role = "Frontend Engineer" | "Backend Engineer" | "Full-Stack Engineer";

interface RolePickerModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { role: Role; file?: File | null }) => void;
  brand?: {
    primary?: string;
    foreground?: string;
  };
  accept?: string;
}

const RolePickerModal: React.FC<RolePickerModalProps> = ({
  open,
  onClose: parentOnClose,
  onSubmit,
  brand,
  accept = ".pdf",
}) => {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [showHelperText, setShowHelperText] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const roles: { value: Role; label: string }[] = [
    { value: "Frontend Engineer", label: "Frontend Engineer" },
    { value: "Backend Engineer", label: "Backend Engineer" },
    { value: "Full-Stack Engineer", label: "Full-Stack Engineer" },
  ];

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setShowHelperText(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const handleClearFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  const handleClose = () => {
    setSelectedRole(null);
    setFile(null);
    setShowHelperText(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    parentOnClose();
  };

  const handleSubmit = () => {
    if (!selectedRole && !file) {
      toast.error("Please select a role and upload a file.");
      setShowHelperText(true);
      return;
    }
    if (!selectedRole) {
      toast.error("Please select a role.");
      setShowHelperText(true);
      return;
    }

    if (!file) {
      toast.error("Please upload a file.");
      return;
    }
    onSubmit({ role: selectedRole, file });
    handleClose();
  };

  return (
    <Modal
      isOpen={open}
      onClose={handleClose}
      title="Please select role and upload your resume"
      panelClassName="max-w-md sm:max-w-lg"
    >
      <div className="space-y-6">
        {/* Role Selection */}
        <div className="space-y-3">
          <div
            className="grid grid-cols-1 gap-3 sm:grid-cols-3"
            role="radiogroup"
            aria-label="Select your role"
          >
            {roles.map((role) => {
              const isSelected = selectedRole === role.value;
              return (
                <button
                  key={role.value}
                  onClick={() => handleRoleSelect(role.value)}
                  className={`
                  cursor-pointer relative p-4 text-sm font-medium rounded-lg border-2 transition-all duration-200
                    focus:outline-none  focus:ring-blue-600 
                    ${
                      isSelected
                        ? "bg-blue-600 text-white border-blue-600 shadow-lg"
                        : "bg-white text-gray-900 border-gray-200 hover:border-blue-600/30 hover:bg-blue-100/30 hover:shadow-md hover:-translate-y-0.5"
                    }
                  `}
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={`Select ${role.label} role`}
                >
                  {role.label}
                  {isSelected && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <Check size={12} className="text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {showHelperText && (
            <p className="text-sm text-red-500 animate-in slide-in-from-top-2 duration-200">
              Please select a role to continue
            </p>
          )}
        </div>

        {/* File Upload */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-900">
            Upload file 
          </label>

          <div className="space-y-2">
            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              onChange={handleFileSelect}
              className="hidden"
              aria-label="Upload file"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 w-full p-3 text-sm border-2 border-dashed rounded-lg transition-colors duration-200
                         focus:outline-none  focus:ring-blue-600  cursor-pointer
                         border-gray-200 hover:border-blue-600/50 hover:bg-blue-100/20"
            >
              <Upload size={16} className="text-gray-500" />
              <span className="text-gray-500">
                {file ? "Change file" : "Upload file"}
              </span>
            </button>

            {file && (
              <div className="flex items-center justify-between p-3 rounded-lg border bg-blue-100/20 border-blue-600/20">
                <span className="text-sm truncate flex-1 mr-2 text-gray-900">
                  {file.name}
                </span>
                <button
                  onClick={handleClearFile}
                  className="p-1 rounded transition-colors duration-200
                             focus:outline-none  focus:ring-blue-600
                             text-gray-500 hover:text-gray-900 cursor-pointer"
                  aria-label="Remove file"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200
                       focus:outline-none  focus:ring-blue-600  hover:-translate-y-0.5
                       text-gray-500 bg-slate-100 hover:bg-slate-100/80 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedRole || !file}
            className={`
              flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
              focus:outline-none  focus:ring-blue-600  
              ${
                selectedRole && file
                  ? "bg-blue-600 text-white border-2 border-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }
            `}
          >
            Continue
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default RolePickerModal;
