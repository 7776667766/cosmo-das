import React, { useEffect, useState } from "react";
import { Box, Typography, Card, Grid, Button, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useFormik } from "formik";
import * as Yup from "yup";
import Image from "next/image";
import { addtemplateApi, edittemplateFunApi } from "store/template/services";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import axiosImage from "helper/api-image";
import toast from "react-hot-toast";

// import toast from "react-toastify";

const TemplateForm = ({ formData, isEditMode }) => {
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [avatar, setAvatar] = useState(null);
  
  const dispatch = useDispatch();
  const router = useRouter();

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (!file) {
      setAvatar(null);
      if (isEditMode) {
        setProfileImageUrl(formData?.img || null);
      } else {
        setProfileImageUrl(null);
      }
      return false;
    } else {
      const type = file.type.split("/")[0];
      if (type !== "image") {
        toast.error("Please select an image");
        setAvatar(null);
        event.target.value = null;
        if (isEditMode) {
          setProfileImageUrl(formData?.img || null);
        } else {
          setProfileImageUrl(null);
        }
        return false;
      } else {
        setAvatar(file);
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
          setProfileImageUrl(e.target.result);
        };
      }
    }
  };

  useEffect(() => {
    if (isEditMode) {
      setProfileImageUrl(formData?.img);
    }
  }, [formData?.img, isEditMode]);

  const initialValues = isEditMode
    ? {
        parent: formData?.parent || "",
        productType: formData?.productType || "",
        status: formData?.status || "Show",
      }
    : {
        parent: "",
        productType: "electronics",
        status: "Show",
      };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object().shape({
      parent: Yup.string().required("Parent is required"),
      productType: Yup.string().required("Product type is required"),
      status: Yup.string().required("Status is required"),
    }),
    onSubmit: async (values) => {
      if (avatar === null && !isEditMode) {
        toast.error("Please select an image");
        return;
      }
      try {
        const formData = {
          ...values,
          img: avatar,
        };

        console.log(formData,"FormData 89")

        if (isEditMode) {
          dispatch(
            edittemplateFunApi({
              data: formData,
              onSuccess: () => {
                router.push("/templates/");
              },
            })
          );
        } 

        const response = await axiosImage.post('/category/add', formData);

        console.log("Response from API:", response.data);

        if (response.status === 200) {
          toast.success("Category Added Sucessfully!");
        } else {
          toast.error(`Error: ${response.data.message}`);
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        toast.error("Error in Adding Category.");

      }
    },
  });

  return (
    <Card
      sx={{
        boxShadow: "none",
        borderRadius: "10px",
        p: "25px 20px 15px",
        mb: "15px",
      }}
    >
      <Box component="form" noValidate onSubmit={formik.handleSubmit}>
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={12} md={12} lg={6}>
            <Typography
              as="h5"
              sx={{
                fontWeight: "500",
                fontSize: "14px",
                mb: "12px",
              }}
            >
              Parent Category
            </Typography>
            <TextField
              autoComplete="parent"
              fullWidth
              label="Enter Parent Category"
              {...formik.getFieldProps("parent")}
              error={formik.touched.parent && formik.errors.parent ? true : false}
              helperText={
                formik.touched.parent && formik.errors.parent
                  ? formik.errors.parent
                  : ""
              }
              InputProps={{
                style: { borderRadius: 8 },
              }}
            />
          </Grid>

          <Grid item xs={12} md={12} lg={6}>
            <Typography
              as="h5"
              sx={{
                fontWeight: "500",
                fontSize: "14px",
                mb: "12px",
              }}
            >
              Product Type
            </Typography>
            <TextField
              fullWidth
              label="Product Type"
              {...formik.getFieldProps("productType")}
              error={
                formik.touched.productType && formik.errors.productType ? true : false
              }
              helperText={
                formik.touched.productType && formik.errors.productType
                  ? formik.errors.productType
                  : ""
              }
              InputProps={{
                style: { borderRadius: 8 },
              }}
            />
          </Grid>

          <Grid item xs={12} md={12} lg={6}>
            <Typography
              as="h5"
              sx={{
                fontWeight: "500",
                fontSize: "14px",
                mb: "12px",
              }}
            >
              Status
            </Typography>
            <TextField
              fullWidth
              label="Status"
              {...formik.getFieldProps("status")}
              error={formik.touched.status && formik.errors.status ? true : false}
              helperText={
                formik.touched.status && formik.errors.status
                  ? formik.errors.status
                  : ""
              }
              InputProps={{
                style: { borderRadius: 8 },
              }}
            />
          </Grid>

          <Grid item xs={12} md={12} lg={6}>
            <Box sx={{ display: "flex", alignItems: "end", gap: 1 }}>
              <Box sx={{ flex: 1 }}>
                <Typography
                  as="h5"
                  sx={{
                    fontWeight: "500",
                    fontSize: "14px",
                    mb: "12px",
                  }}
                >
                  Upload Image
                </Typography>
                <TextField
                  required
                  fullWidth
                  name="img"
                  type="file"
                  onChange={handleImageChange}
                  id="img"
                />
              </Box>
              {profileImageUrl && (
                <Image
                  src={profileImageUrl}
                  alt="profile"
                  style={{
                    border: "1px solid #e0e0e0",
                  }}
                  width={50}
                  height={50}
                />
              )}
            </Box>
          </Grid>

          <Grid item xs={12} textAlign="left">
            <Button
              type="submit"
              variant="contained"
              sx={{
                mt: 1,
                textTransform: "capitalize",
                borderRadius: "8px",
                fontWeight: "500",
                fontSize: "13px",
                padding: "12px 20px",
                color: "#fff !important",
              }}
            >
              <SendIcon
                sx={{
                  position: "relative",
                  top: "-2px",
                }}
                className="mr-5px"
              />
              {isEditMode ? "Edit Template" : "Add Template"}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Card>
  );
};

export default TemplateForm;
