"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Upload, Camera, Building2 } from "lucide-react";
import { toast } from "sonner";

const validationSchema = Yup.object({
  fullName: Yup.string().required("Full Name is required"),
  centerAddress: Yup.string().required("Agrarian Center Address is required"),
  contactNumber: Yup.string().required("Contact Number is required"),
});

export default function AgrarianProfile() {
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [idFileName, setIdFileName] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      fullName: "Nimal Perera",
      centerAddress: "Kandy Agrarian Service Center, Kandy",
      contactNumber: "0812345678",
      profilePicture: null,
      officialIdCard: null,
    },
    validationSchema,
    onSubmit: (values) => {
      toast.success("Profile updated successfully!");
    },
  });

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (file) {
      formik.setFieldValue("profilePicture", file);
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (file) {
      formik.setFieldValue("officialIdCard", file);
      setIdFileName(file.name);
    }
  };

  return (
    <div className="flex flex-col min-h-full w-full bg-background">
      <main className="flex-grow px-4 md:px-8 max-w-8xl mx-auto w-full pb-8 space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-primary">Officer Profile</h1>
          <p className="text-lg text-muted-foreground">
            Manage your official profile and center details.
          </p>
        </div>

      <form onSubmit={formik.handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Profile Picture Section */}
          <div className="md:col-span-4">
            <Card className="border-border shadow-sm h-full">
              <CardContent className="pt-6 flex flex-col items-center justify-center space-y-4">
                <div className="relative group cursor-pointer">
                  <div className="w-40 h-40 rounded-full border-4 border-muted flex items-center justify-center overflow-hidden bg-secondary">
                    {profilePreview ? (
                      <img src={profilePreview} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-20 h-20 text-secondary-foreground" />
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                    onChange={handleProfilePictureChange}
                  />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-lg text-foreground">Profile Picture</h3>
                  <p className="text-sm text-muted-foreground">Click to upload a new picture</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Basic Details Section */}
          <div className="md:col-span-8">
            <Card className="border-border shadow-sm">
              <CardHeader className="border-b border-border bg-primary/5 pb-4">
                <CardTitle className="text-xl text-primary flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Official Details
                </CardTitle>
                <CardDescription>Update your contact and agrarian center information.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Full Name</label>
                  <div className="relative group">
                    <Input
                      type="text"
                      {...formik.getFieldProps('fullName')}
                      className="h-10"
                      aria-invalid={!!(formik.touched.fullName && formik.errors.fullName)}
                    />
                  </div>
                  {formik.touched.fullName && formik.errors.fullName && (
                    <p className="text-destructive text-xs mt-1">{formik.errors.fullName as string}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">Agrarian Center / Address</label>
                  <div className="relative group">
                    <Input
                      type="text"
                      {...formik.getFieldProps('centerAddress')}
                      className="h-10"
                      aria-invalid={!!(formik.touched.centerAddress && formik.errors.centerAddress)}
                    />
                  </div>
                  {formik.touched.centerAddress && formik.errors.centerAddress && (
                    <p className="text-destructive text-xs mt-1">{formik.errors.centerAddress as string}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">Contact Number</label>
                  <div className="relative group">
                    <Input
                      type="text"
                      {...formik.getFieldProps('contactNumber')}
                      className="h-10"
                      aria-invalid={!!(formik.touched.contactNumber && formik.errors.contactNumber)}
                    />
                  </div>
                  {formik.touched.contactNumber && formik.errors.contactNumber && (
                    <p className="text-destructive text-xs mt-1">{formik.errors.contactNumber as string}</p>
                  )}
                </div>

                <div className="pt-4 space-y-2">
                  <label className="block text-sm font-medium mb-1.5">Official ID Upload</label>
                  <div className="flex items-center gap-4">
                    <Button type="button" variant="outline" className="relative cursor-pointer">
                      <Upload className="w-4 h-4 mr-2" />
                      {idFileName ? "Change ID" : "Upload ID"}
                      <input 
                        type="file" 
                        accept="image/*,.pdf" 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                        onChange={handleIdChange}
                      />
                    </Button>
                    <span className="text-sm text-muted-foreground truncate max-w-[200px]">
                      {idFileName || "No file chosen"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Upload a clear photo or PDF of your Official Agrarian Officer ID.</p>
                </div>
              </CardContent>
              <CardFooter className="border-t border-border pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={formik.isSubmitting || !formik.isValid}
                  className="w-auto flex justify-center py-2 px-6 border border-transparent rounded-md text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring transition-all shadow-sm hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save Changes
                </button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </form>
      </main>
    </div>
  );
}
