"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axiosInstance from "@/utils/axiosInstance";
import apiPaths from "@/utils/apiPaths";
import { describeApiError } from "@/utils/apiError";
import { useApiList, useApiResource } from "@/hooks/use-api-resource";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { User, Upload, Camera, MapPin, Loader2, CheckCircle } from "lucide-react";

const validationSchema = Yup.object({
  fullName: Yup.string().required("Full Name is required"),
  address: Yup.string().required("Address is required"),
  contactNumber: Yup.string().required("Contact Number is required"),
});

interface Area {
  areaId: number;
  areaName: string;
  district: string;
}

interface FarmerArea {
  userId: number;
  username: string;
  areaId: number | null;
  areaName: string | null;
  district: string | null;
}

export default function FarmerProfile() {
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [nicFileName, setNicFileName] = useState<string | null>(null);

  // ─── Service area (the only part of this profile that persists) ───────────
  const areasQuery = useApiList<Area>(["areas"], apiPaths.areas.list, {
    errorMessage: "Could not load areas.",
  });
  const myAreaQuery = useApiResource<FarmerArea>(["farmer", "area"], apiPaths.farmers.myArea, {
    errorMessage: "Could not load your service area.",
  });

  const areas = areasQuery.data;
  const savedArea = myAreaQuery.data ?? null;
  const isAreaLoading = areasQuery.isLoading || myAreaQuery.isLoading;
  const areaLoadError = areasQuery.error ?? myAreaQuery.error;

  const loadAreaData = useCallback(async () => {
    await Promise.all([areasQuery.refetch(), myAreaQuery.refetch()]);
  }, [areasQuery, myAreaQuery]);

  // Only what the user has picked this session; the saved values show through
  // underneath, so the form opens on current state without seeding state in an
  // effect.
  const [districtChoice, setDistrictChoice] = useState<string | null>(null);
  const [areaChoice, setAreaChoice] = useState<string | null>(null);
  const [isSavingArea, setIsSavingArea] = useState(false);

  const selectedDistrict = districtChoice ?? savedArea?.district ?? "";
  const selectedAreaId =
    areaChoice ?? (savedArea?.areaId != null ? String(savedArea.areaId) : "");

  const districts = useMemo(
    () => Array.from(new Set(areas.map((area) => area.district))).sort(),
    [areas]
  );

  const areasInDistrict = useMemo(
    () => areas.filter((area) => area.district === selectedDistrict),
    [areas, selectedDistrict]
  );

  const isAreaDirty = selectedAreaId !== "" && Number(selectedAreaId) !== savedArea?.areaId;

  const handleDistrictChange = (district: string) => {
    setDistrictChoice(district);
    // The previously chosen area belongs to the old district — clear it.
    setAreaChoice("");
  };

  const handleSaveArea = async () => {
    if (!isAreaDirty) return;

    setIsSavingArea(true);
    const toastId = toast.loading("Saving your service area...");

    try {
      const { data } = await axiosInstance.patch<FarmerArea>(apiPaths.farmers.myArea, {
        areaId: Number(selectedAreaId),
      });

      await myAreaQuery.refetch();

      toast.dismiss(toastId);
      toast.success("Service area updated!", {
        description: `${data.areaName}, ${data.district}`,
        icon: <CheckCircle className="w-5 h-5 text-primary" />,
      });
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Could not update your service area.", {
        description: describeApiError(error, "Please check server connection."),
      });
    } finally {
      setIsSavingArea(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      fullName: "Arjuna Perera",
      address: "123, Kandy Road, Peradeniya",
      contactNumber: "0771234567",
      profilePicture: null,
      nicCard: null,
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

  const handleNicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (file) {
      formik.setFieldValue("nicCard", file);
      setNicFileName(file.name);
    }
  };

  return (
    <div className="flex flex-col min-h-full w-full bg-background">
      <main className="flex-grow px-4 md:px-8 max-w-8xl mx-auto w-full pb-8 space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-primary">My Profile</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Manage your personal information and uploaded documents.
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
                <CardTitle className="text-xl text-primary">Basic Details</CardTitle>
                <CardDescription>Update your contact and personal information.</CardDescription>
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
                  <label className="block text-sm font-medium mb-1.5">Address</label>
                  <div className="relative group">
                    <Input
                      type="text"
                      {...formik.getFieldProps('address')}
                      className="h-10"
                      aria-invalid={!!(formik.touched.address && formik.errors.address)}
                    />
                  </div>
                  {formik.touched.address && formik.errors.address && (
                    <p className="text-destructive text-xs mt-1">{formik.errors.address as string}</p>
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
                  <label className="block text-sm font-medium mb-1.5">NIC Card Upload</label>
                  <div className="flex items-center gap-4">
                    <Button type="button" variant="outline" className="relative cursor-pointer">
                      <Upload className="w-4 h-4 mr-2" />
                      {nicFileName ? "Change NIC" : "Upload NIC"}
                      <input 
                        type="file" 
                        accept="image/*,.pdf" 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                        onChange={handleNicChange}
                      />
                    </Button>
                    <span className="text-sm text-muted-foreground truncate max-w-[200px]">
                      {nicFileName || "No file chosen"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Upload a clear photo or PDF of your National Identity Card.</p>
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

      {/* Service Area — separate from the form above because this is the only
          section wired to the backend; the details form is still a stub. */}
      <Card className="border-border shadow-sm">
        <CardHeader className="border-b border-border bg-primary/5 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-xl text-primary">Service Area</CardTitle>
              <CardDescription>
                Determines which agrarian service officer reviews your fertilizer requests.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-5">
          {areaLoadError ? (
            <div className="flex flex-col items-start gap-4">
              <p className="text-sm text-destructive">{areaLoadError}</p>
              <Button type="button" variant="outline" onClick={loadAreaData}>
                Retry
              </Button>
            </div>
          ) : (
            <>
              <div className="rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm">
                {isAreaLoading ? (
                  <span className="text-muted-foreground">Loading your current area...</span>
                ) : savedArea?.areaId != null ? (
                  <span className="text-foreground">
                    Currently assigned to{" "}
                    <span className="font-semibold">
                      {savedArea.areaName}, {savedArea.district}
                    </span>
                  </span>
                ) : (
                  <span className="text-muted-foreground">
                    No area set yet — you can&apos;t submit fertilizer requests until you pick one.
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium mb-1.5">District</label>
                  <Select
                    value={selectedDistrict}
                    onValueChange={(value) => handleDistrictChange(value ? String(value) : "")}
                    disabled={isAreaLoading || isSavingArea || districts.length === 0}
                  >
                    <SelectTrigger className="w-full h-10 bg-background">
                      <SelectValue placeholder={isAreaLoading ? "Loading..." : "Select district"} />
                    </SelectTrigger>
                    <SelectContent>
                      {districts.map((district) => (
                        <SelectItem key={district} value={district}>
                          {district}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">Area</label>
                  <Select
                    value={selectedAreaId}
                    onValueChange={(value) => setAreaChoice(value ? String(value) : "")}
                    disabled={isAreaLoading || isSavingArea || !selectedDistrict}
                  >
                    <SelectTrigger className="w-full h-10 bg-background">
                      {/* Function child required: Base UI otherwise renders the
                          raw value, which here is the numeric areaId. */}
                      <SelectValue>
                        {(value) =>
                          areas.find((area) => String(area.areaId) === String(value ?? ""))?.areaName ??
                          (selectedDistrict ? "Select area" : "Select a district first")
                        }
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {areasInDistrict.map((area) => (
                        <SelectItem key={area.areaId} value={String(area.areaId)}>
                          {area.areaName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {!isAreaLoading && districts.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  No areas exist yet — ask an administrator to add them.
                </p>
              )}
            </>
          )}
        </CardContent>
        <CardFooter className="border-t border-border pt-4 flex justify-end">
          <Button
            type="button"
            onClick={handleSaveArea}
            disabled={!isAreaDirty || isSavingArea || isAreaLoading}
            className="h-10 px-6 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSavingArea ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Area"
            )}
          </Button>
        </CardFooter>
      </Card>
      </main>
    </div>
  );
}
