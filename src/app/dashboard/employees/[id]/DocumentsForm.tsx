"use client";

import {
  deleteEmployeeDocumentAction,
  getEmployeeDocumentsAction,
  uploadEmployeeDocumentAction,
} from "@/actions/employee.actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
// import { Employee, User } from "@/generated/prisma";
// import { DocumentType } from "@prisma/client";
import { Employee, User, DocumentType } from "@prisma/client";
import { X } from "lucide-react";
import React, { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

type Doc = {
  id: string;
  type: DocumentType;
  fileName: string;
  fileUrl: string;
};

type DocumentsFormProps = {
  employee: Employee & { user: User };
};

function DocumentsForm({ employee }: DocumentsFormProps) {
  const [isPending, startTransition] = useTransition();
  const [files, setFiles] = useState<Record<DocumentType, File | null>>({
    ID: null,
    IQAMA: null,
    CONTRACT: null,
    CERTIFICATE: null,
    OTHER: null,
    PASSPORT: null,
    CV: null,
    HIGH_SCHOOL_CERTIFICATE: null,
    UNIVERSITY_CERTIFICATE: null,
    OTHER_CERTIFICATE: null,
  });
  const [documents, setDocuments] = useState<Doc[]>([]);

  const documentTypes: { label: string; key: DocumentType }[] = [
    { label: "ID / Iqama", key: DocumentType.ID },
    { label: "Passport", key: DocumentType.PASSPORT },
    { label: "CV", key: DocumentType.CV },
    {
      label: "High School Certificate",
      key: DocumentType.HIGH_SCHOOL_CERTIFICATE,
    },
    {
      label: "University Certificate",
      key: DocumentType.UNIVERSITY_CERTIFICATE,
    },
    { label: "Other Certificate", key: DocumentType.OTHER_CERTIFICATE },
  ];

  // Load existing documents
  useEffect(() => {
    startTransition(async () => {
      const docs = await getEmployeeDocumentsAction(employee.id);
      setDocuments(docs);
    });
  }, [employee.id]);

  const handleFileChange = (type: DocumentType, file: File | null) => {
    setFiles((prev) => ({ ...prev, [type]: file }));
  };

  const handleUpload = async (type: DocumentType) => {
    const file = files[type];
    if (!file) return toast.error("Please select a file first.");

    startTransition(async () => {
      const { doc, error } = await uploadEmployeeDocumentAction(
        employee.id,
        type,
        file
      );

      if (error) toast.error(error);
      else {
        toast.success(`${type} uploaded successfully.`);
        setFiles((prev) => ({ ...prev, [type]: null }));
        if (!doc) return;
        setDocuments((prev) => [...prev, doc]);
      }
    });
  };

  const handleDelete = async (id: string) => {
    startTransition(async () => {
      try {
        await deleteEmployeeDocumentAction(id);
        setDocuments((prev) => prev.filter((d) => d.id !== id));
        toast.success("Document deleted successfully.");
      } catch (err: any) {
        toast.error(err.message || "Delete failed");
      }
    });
  };

  return (
    <div>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Personal Documents</CardTitle>
        </CardHeader>
        <hr />
        <CardContent className="grid grid-cols-1 gap-y-6 gap-x-8">
          {documentTypes.map(({ label, key }) => (
            <div key={key} className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <Label className="w-[180px] text-muted-foreground">
                  {label}
                </Label>
                <input
                  type="file"
                  onChange={(e) =>
                    handleFileChange(key, e.target.files?.[0] || null)
                  }
                />
                <Button
                  size="sm"
                  onClick={() => handleUpload(key)}
                  disabled={!files[key] || isPending}
                >
                  Upload
                </Button>
              </div>
              <div className="flex flex-col gap-1 ml-[180px]">
                {documents
                  .filter((d) => d.type === key)
                  .map((doc) => (
                    <div key={doc.id} className="flex items-center gap-2">
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 underline truncate"
                      >
                        {doc.fileName}
                      </a>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(doc.id)}
                      >
                        <X className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* <Card className="mt-4">
        <CardHeader className="flex items-center justify-between h-2">
          <CardTitle>Documents</CardTitle>
          <Button
            variant="link"
            size="icon"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </CardHeader>
        <hr />
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
          {types.map((type) => {
            const existingDoc = documents.find((d) => d.type === type);
            return (
              <div key={type} className="flex items-center gap-4">
                <Label className="w-[180px] text-muted-foreground">
                  {type}
                </Label>

                {existingDoc ? (
                  <>
                    <a
                      href={existingDoc.url}
                      target="_blank"
                      className="text-sm text-blue-600 underline truncate"
                    >
                      {existingDoc.fileName}
                    </a>
                    {isEditing && (
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(existingDoc.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    )}
                  </>
                ) : isEditing ? (
                  <>
                    <input
                      type="file"
                      onChange={(e) =>
                        handleFileChange(type, e.target.files?.[0] || null)
                      }
                    />
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleUpload(type)}
                      disabled={!fileMap[type]}
                    >
                      <Save className="h-4 w-4 mr-1" /> Upload
                    </Button>
                  </>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    No document
                  </span>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader className="flex items-center justify-between h-2">
          <CardTitle>Personal Documents</CardTitle>
        </CardHeader>
        <hr />
        <CardContent className="grid grid-cols-1 gap-y-4 gap-x-8">
          <div className="flex items-center">
            <Label className="w-[140px] text-muted-foreground">Iqama</Label>
            <span className="text-sm text-right text-foreground font-medium truncate">
              {employee.user.name}
            </span>
            <input
              type="file"
              // onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>
          <div className="flex items-center">
            <Label className="w-[140px] text-muted-foreground">Passport</Label>
            <span className="text-sm text-right text-foreground font-medium truncate">
              {employee.user.name}
            </span>
          </div>
          <div className="flex items-center">
            <Label className="w-[140px] text-muted-foreground">CV</Label>
            <span className="text-sm text-right text-foreground font-medium truncate">
              {employee.user.name}
            </span>
          </div>
          <div className="flex items-center">
            <Label className="w-[140px] text-muted-foreground">
              High School Certificate
            </Label>
            <span className="text-sm text-right text-foreground font-medium truncate">
              {employee.user.name}
            </span>
          </div>
          <div className="flex items-center">
            <Label className="w-[140px] text-muted-foreground">
              University Certificate
            </Label>
            <span className="text-sm text-right text-foreground font-medium truncate">
              {employee.user.name}
            </span>
          </div>
          <div className="flex items-center">
            <Label className="w-[140px] text-muted-foreground">
              Other Certificate
            </Label>
            <span className="text-sm text-right text-foreground font-medium truncate">
              {employee.user.name}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader className="flex items-center justify-between h-2">
          <CardTitle>Payslips</CardTitle>
          {isEditing ? (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditing(false)}
              >
                <X className="h-4 w-4" />
              </Button>
              <Button
                variant="default"
                size="icon"
                // onClick={handleSave}
                disabled={isPending}
              >
                <Save className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              variant="link"
              size="icon"
              // onClick={() => setIsEditing(true)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
        </CardHeader>
        <hr />
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
          <div className="flex items-center">
            <Label className="w-[140px] text-muted-foreground">
              Primary Address
            </Label>
            <span className="text-sm text-right text-foreground font-medium truncate">
              {employee.user.name}
            </span>
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
}

export default DocumentsForm;
