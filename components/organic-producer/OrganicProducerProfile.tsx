"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Leaf, Upload, Camera, MapPin, Phone, BadgeCheck } from "lucide-react";
import { toast } from "sonner";

const validationSchema = Yup.object({
  producerName: Yup.string().required("Producer name is required"),
  district: Yup.string().required("District is required"),
  contactNumber: Yup.string().required("Contact number is required"),
});

export default function OrganicProducerProfile() {
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [certFileName, setCertFileName] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      producerName: "Bio-Grow Organics Matale",
      district: "Matale Central",
      contactNumber: "0662234567",
    },
    validationSchema,
    onSubmit: (values) => {
      toast.success("Profile updated successfully!");
    },
  });

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (file) {
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  const handleCertChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (file) setCertFileName(file.name);
  };

  return (
    <div className="flex flex-col min-h-full w-full bg-background">
      <main className="flex-grow px-4 md:px-8 max-w-7xl mx-auto w-full pb-8 space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-primary">Producer Profile</h1>
          <p className="text-lg text-muted-foreground">
            Manage your organic producer credentials and business details.
          </p>
        </div>

        <form onSubmit={formik.handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

            {/* Logo / Avatar */}
            <div className="md:col-span-4">
              <Card className="border-border shadow-sm h-full">
                <CardContent className="pt-6 flex flex-col items-center justify-center space-y-4">
                  <div className="relative group cursor-pointer">
                    <div className="w-40 h-40 rounded-2xl border-4 border-muted flex items-center justify-center overflow-hidden bg-primary/10">
                      {profilePreview ? (
                        <img src={profilePreview} alt="Logo" className="w-full h-full object-cover" />
                      ) : (
                        <Leaf className="w-20 h-20 text-primary" />
                      )}
                    </div>
                    <div className="absolute inset-0 bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
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
                    <h3 className="font-semibold text-lg text-foreground">Organisation Logo</h3>
                    <p className="text-sm text-muted-foreground">Click to upload a new logo</p>
                  </div>

                  {/* Verification badge */}
                  <div className="inline-flex items-center gap-2 bg-secondary/20 text-secondary-foreground px-4 py-2 rounded-full border border-secondary/30">
                    <BadgeCheck className="w-4 h-4 text-primary" />
                    <span className="text-xs font-bold">Gold Verified Supplier</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Details */}
            <div className="md:col-span-8">
              <Card className="border-border shadow-sm">
                <CardHeader className="border-b border-border bg-primary/5 pb-4">
                  <CardTitle className="text-xl text-primary flex items-center gap-2">
                    <Leaf className="w-5 h-5" />
                    Organisation Details
                  </CardTitle>
                  <CardDescription>Update your producer information and certifications.</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-5">

                  <div>
                    <label className="block text-sm font-medium mb-1.5">Producer / Organisation Name</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                        <Leaf className="h-5 w-5" />
                      </div>
                      <Input
                        type="text"
                        {...formik.getFieldProps("producerName")}
                        className="pl-10 h-10"
                        aria-invalid={!!(formik.touched.producerName && formik.errors.producerName)}
                      />
                    </div>
                    {formik.touched.producerName && formik.errors.producerName && (
                      <p className="text-destructive text-xs mt-1">{formik.errors.producerName as string}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5">District / Location</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <Input
                        type="text"
                        {...formik.getFieldProps("district")}
                        className="pl-10 h-10"
                        aria-invalid={!!(formik.touched.district && formik.errors.district)}
                      />
                    </div>
                    {formik.touched.district && formik.errors.district && (
                      <p className="text-destructive text-xs mt-1">{formik.errors.district as string}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5">Contact Number</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                        <Phone className="h-5 w-5" />
                      </div>
                      <Input
                        type="text"
                        {...formik.getFieldProps("contactNumber")}
                        className="pl-10 h-10"
                        aria-invalid={!!(formik.touched.contactNumber && formik.errors.contactNumber)}
                      />
                    </div>
                    {formik.touched.contactNumber && formik.errors.contactNumber && (
                      <p className="text-destructive text-xs mt-1">{formik.errors.contactNumber as string}</p>
                    )}
                  </div>

                  {/* Certification Upload */}
                  <div className="pt-2 space-y-2">
                    <label className="block text-sm font-medium mb-1.5">Organic Certification Document</label>
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        className="relative flex items-center gap-2 py-2 px-4 border border-border rounded-md text-sm font-medium text-foreground hover:bg-muted transition-all"
                      >
                        <Upload className="w-4 h-4" />
                        {certFileName ? "Change Certificate" : "Upload Certificate"}
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          onChange={handleCertChange}
                        />
                      </button>
                      <span className="text-sm text-muted-foreground truncate max-w-[200px]">
                        {certFileName || "No file chosen"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Upload your valid organic certification (PDF or image).
                    </p>
                  </div>
                </CardContent>

                <CardFooter className="border-t border-border pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={formik.isSubmitting || !formik.isValid}
                    className="flex justify-center py-2 px-6 border border-transparent rounded-md text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring transition-all shadow-sm hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
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
