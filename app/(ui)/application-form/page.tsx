"use client";

import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Yup validation schema
const validationSchema = Yup.object({
  fullName: Yup.string().required("Full Name is required"),
  nic: Yup.string().required("NIC is required"),
  landSize: Yup.number().typeError("Must be a number").positive("Must be greater than 0").required("Land Size is required"),
  cropType: Yup.string().required("Crop Type is required"),
  fertilizerType: Yup.string().required("Fertilizer Type is required"),
  quantity: Yup.number().typeError("Must be a number").positive("Must be greater than 0").required("Quantity is required"),
});

export default function ApplicationFormPage() {
  const formik = useFormik({
    initialValues: {
      fullName: "",
      nic: "",
      landSize: "",
      cropType: "",
      fertilizerType: "",
      quantity: "",
    },
    validationSchema,
    onSubmit: (values) => {
      console.log("Form Submitted:", values);
      alert("Application submitted successfully!");
      formik.resetForm();
    },
  });

  return (
    <div className="flex flex-col min-h-full w-full bg-background">
      <main className="flex-grow pt-4 px-4 md:px-8 max-w-7xl mx-auto w-full pb-8 space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-primary">Fertilizer Subsidy Application</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Fill in the details below to apply for your seasonal fertilizer subsidy.
          </p>
        </div>
        
        <form onSubmit={formik.handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Full Name
              </label>
              <div className="relative group">
                <Input
                  type="text"
                  {...formik.getFieldProps('fullName')}
                  className="h-10"
                  aria-invalid={!!(formik.touched.fullName && formik.errors.fullName)}
                  placeholder="e.g. Arjuna Perera"
                />
              </div>
              {formik.touched.fullName && formik.errors.fullName ? (
                <div className="text-destructive text-xs mt-1">{formik.errors.fullName as string}</div>
              ) : null}
            </div>

            {/* NIC */}
            <div>
              <label className="block text-sm font-medium mb-1.5">
                National Identity Card (NIC)
              </label>
              <div className="relative group">
                <Input
                  type="text"
                  {...formik.getFieldProps('nic')}
                  className="h-10"
                  aria-invalid={!!(formik.touched.nic && formik.errors.nic)}
                  placeholder="e.g. 198012345678"
                />
              </div>
              {formik.touched.nic && formik.errors.nic ? (
                <div className="text-destructive text-xs mt-1">{formik.errors.nic as string}</div>
              ) : null}
            </div>

            {/* Land Size */}
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Land Size (Acres)
              </label>
              <div className="relative group">
                <Input
                  type="number"
                  {...formik.getFieldProps('landSize')}
                  className="h-10"
                  aria-invalid={!!(formik.touched.landSize && formik.errors.landSize)}
                  placeholder="e.g. 2.5"
                />
              </div>
              {formik.touched.landSize && formik.errors.landSize ? (
                <div className="text-destructive text-xs mt-1">{formik.errors.landSize as string}</div>
              ) : null}
            </div>

            {/* Crop Type */}
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Primary Crop
              </label>
              <div className="relative group">
                <Select
                  value={formik.values.cropType}
                  onValueChange={(val) => formik.setFieldValue("cropType", val)}
                >
                  <SelectTrigger 
                    className={`w-full h-10 ${formik.touched.cropType && formik.errors.cropType ? 'border-destructive focus-visible:ring-destructive focus-visible:ring-offset-2' : ''}`}
                  >
                    <SelectValue placeholder="Select Crop Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Paddy Rice">Paddy Rice</SelectItem>
                    <SelectItem value="Maize">Maize</SelectItem>
                    <SelectItem value="Tea">Tea</SelectItem>
                    <SelectItem value="Rubber">Rubber</SelectItem>
                    <SelectItem value="Vegetables">Vegetables</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formik.touched.cropType && formik.errors.cropType ? (
                <div className="text-destructive text-xs mt-1">{formik.errors.cropType as string}</div>
              ) : null}
            </div>

            {/* Fertilizer Type */}
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Fertilizer Type
              </label>
              <div className="relative group">
                <Select
                  value={formik.values.fertilizerType}
                  onValueChange={(val) => formik.setFieldValue("fertilizerType", val)}
                >
                  <SelectTrigger 
                    className={`w-full h-10 ${formik.touched.fertilizerType && formik.errors.fertilizerType ? 'border-destructive focus-visible:ring-destructive focus-visible:ring-offset-2' : ''}`}
                  >
                    <SelectValue placeholder="Select Fertilizer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Urea">Urea</SelectItem>
                    <SelectItem value="TSP">TSP (Triple Super Phosphate)</SelectItem>
                    <SelectItem value="MOP">MOP (Muriate of Potash)</SelectItem>
                    <SelectItem value="Organic Compost">Organic Compost</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formik.touched.fertilizerType && formik.errors.fertilizerType ? (
                <div className="text-destructive text-xs mt-1">{formik.errors.fertilizerType as string}</div>
              ) : null}
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Requested Quantity (kg)
              </label>
              <div className="relative group">
                <Input
                  type="number"
                  {...formik.getFieldProps('quantity')}
                  className="h-10"
                  aria-invalid={!!(formik.touched.quantity && formik.errors.quantity)}
                  placeholder="e.g. 50"
                />
              </div>
              {formik.touched.quantity && formik.errors.quantity ? (
                <div className="text-destructive text-xs mt-1">{formik.errors.quantity as string}</div>
              ) : null}
            </div>
          </div>

          <div className="px-0 pb-0 pt-4 flex gap-4 mt-6">
            <Button type="button" variant="outline" onClick={() => formik.resetForm()}>
              Clear Form
            </Button>
            <button
              type="submit"
              disabled={formik.isSubmitting || !formik.isValid || !formik.dirty}
              className="w-auto flex justify-center py-2 px-6 border border-transparent rounded-md text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring transition-all shadow-sm hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Application
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
