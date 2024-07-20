import React from "react";
import {
  Box,
  Typography,
  FormControl,
  Autocomplete,
  List, ListItem,
  Checkbox,
  Button,
} from "@mui/material";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import SendIcon from "@mui/icons-material/Send";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import axiosImage from "helper/api-image";
import axios from "helper/api-image";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { Router, useRouter } from "next/router";
import { getspecialistApi } from "store/specialist/services";
import { getServicesTypeFunApi } from "store/service/services";
import toast from "react-hot-toast";
import Image from "next/image";
import { LoadingButtonComponent } from "@/components/UIElements/Buttons/LoadingButton";

const ServiceForm = ({ formData, isEditMode }) => {
  const [selectedSpecialist, setSelectedSpecialist] = useState(null);
  const [selectedSpecialist1, setSelectedSpecialist1] = useState(null);
  const [selectedSpecialist3, setSelectedSpecialist3] = useState(null);
  console.log(selectedSpecialist3, "selectedSpecialist3")
  const [categories, setallcategory] = useState([])
  console.log("categories", categories)
  const router = useRouter();


  const userdata = async () => {
    try {
      const response = await axios.get('/category/all');
      console.log("Response from API:", response.data.result);
      setallcategory(response.data.result)
      if (response.status === 200) {
        toast.success("Data fetched !");
      } else {
        toast.error(`Error: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error in data fetch:", error);
      toast.error("error");
    }
  }

  useEffect(() => {
    userdata()
  }, []);

  const specialistArray = [
    { id: "dummy1", name: "Dummy BRAND 1" },
    { id: "dummy2", name: "Dummy BRAND 2" },
  ];
  const specialistArray1 = [
    { id: "CATAGORY2", name: "Dummy CATAGORY 1" },
    { id: "CATAGORY2", name: "Dummy CATAGORY 2" },
  ];
  const specialistArray3 = [
    { id: "in-stock", name: "in-stock" },
    { id: "out-of-stock ", name: "out-of-stock" },
    { id: "discontinued", name: "discontinued" },
  ];

  const [avatar, setavatar] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [profileImageUrls, setProfileImageUrls] = useState([]);

  const handleFileChange2 = (event, index) => {
    const files = event.target.files;
    console.log("files", files)

    if (!files || files.length === 0) {
      return;
    }

    const updatedProfileImageUrls = [...profileImageUrls];
    console.log("8000000", updatedProfileImageUrls)
    const file = files[0];
    const type = file.type.split("/")[0];

    if (type !== "image") {
      toast.error("Please select an image");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      updatedProfileImageUrls[index] = e.target.result;
      setProfileImageUrls(updatedProfileImageUrls);
    };
  };

  const addNewImage = () => {
    setProfileImageUrls([...profileImageUrls, null]);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) {
      setavatar(null);
      if (isEditMode) {
        setProfileImageUrl(formData?.image || null);
      } else {
        setProfileImageUrl(null);
      }
      return false;
    } else {
      const type = file.type.split("/")[0];
      if (type !== "image") {
        toast.error("Please select an image");
        setavatar(null);
        event.target.value = null;
        if (isEditMode) {
          setProfileImageUrl(formData?.image || null);
        } else {
          setProfileImageUrl(null);
        }
        return false;
      } else {
        setavatar(file);
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
      const shades = formData?.imageURLs?.map(item =>
        item.shade) || [];
      console.log("shades 143", shades)
      setProfileImageUrls(shades.flat());
    }
  }, [formData, isEditMode]);

  const formik = useFormik({
    initialValues: {
      sku: formData?.sku || "NTB7SDVX44",
      title: formData?.title || "",
      slug: formData?.slug || "",
      unit: formData?.unit || "",
      imgUrls: formData?.imageURLs || [
        {
          color: {
            name: "",
            clrCode: ""
          },
          shade: [""]
        }
      ],
      parent: formData?.parent || "",
      children: formData?.children || "",
      price: formData?.price || 0,
      discount: formData?.discount || 0,
      quantity: formData?.quantity || 0,
      status: formData?.status || "in-stock",
      category: {},

      productType: formData?.productType || "",
      description: formData?.description || "",
      additionalInformation: formData?.additionalInformation || [],
      featured: formData?.featured || false,
      sellCount: formData?.sellCount || 0,
      tags: formData?.tags || ["product", "feature"],
      brands: formData?.brands || ""

    },
    validationSchema: Yup.object().shape({
      title: Yup.string().required('Title is required'),
      slug: Yup.string().required('Slug is required'),
      unit: Yup.string().required('Unit is required'),
      parent: Yup.string().required('Parent is required'),
      children: Yup.string().required('Children is required'),
      price: Yup.number().required('Price is required').positive('Price must be a positive number'),
      discount: Yup.number().min(0, 'Discount must be non-negative'),
      quantity: Yup.number().min(0, 'Quantity must be non-negative'),
      productType: Yup.string().required('Product Type is required'),
      description: Yup.string().required('Description is required'),
      additionalInformation: Yup.string().required(
        'required'
      ),
      featured: Yup.boolean().required('Featured is required'),
      sellCount: Yup.number().min(0, 'Sell Count must be non-negative'),
    }),
    onSubmit: async (values) => {
      console.log("Form values:", values);
      try {
        const myServiceData = {
          ...values,
          img: avatar,
          shade: profileImageUrls,
        };
        console.log("myservicedata ", myServiceData);

        const endpoint = isEditMode ? `/product/edit-product/${formData._id}` : '/product/add';
        const Api = isEditMode ?  axiosImage.patch(endpoint, myServiceData) :  axiosImage.post(endpoint, myServiceData);
        const response = await Api;
        console.log("Response from API:", response.data);

        if (response.status === 200) {
          toast.success(`Success:${response.data.message}`);
          router.push("/services")
        } else {
          toast.error(`Error: ${response.data.message}`);
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        toast.error("500 Error / network Error / Route Error.");
      }
    }
  });

  return (
    <>
      <Card sx={{ boxShadow: "none", borderRadius: "10px", p: "25px 20px 15px" }}>
        <Box component="form" noValidate onSubmit={formik.handleSubmit}>
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={12} md={12} lg={6}>
              <Typography as="h5" sx={{ fontWeight: "500", fontSize: "14px", mb: "12px" }}>
                Title
              </Typography>
              <TextField
                name="title"
                fullWidth
                id="title"
                label="Title"
                {...formik.getFieldProps("title")}
                error={formik.touched.title && formik.errors.title ? true : false}
                helperText={formik.touched.title && formik.errors.title ? formik.errors.title : ""}
              />
            </Grid>
            <Grid item xs={12} md={12} lg={6}>
              <Typography as="h5" sx={{ fontWeight: "500", fontSize: "14px", mb: "12px" }}>
                slug
              </Typography>
              <TextField
                name="slug"
                fullWidth
                id="slug"
                label="slug"
                {...formik.getFieldProps("slug")}
                error={formik.touched.slug && formik.errors.slug ? true : false}
                helperText={formik.touched.slug && formik.errors.slug ? formik.errors.slug : ""}
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
                    Upload Product Image
                  </Typography>

                  <TextField
                    fullWidth
                    name="img"
                    type="file"
                    id="file"
                    accept="image/*"
                    onChange={handleFileChange}
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

            <Grid item xs={12} md={12} lg={6}>
              <Typography as="h5" sx={{ fontWeight: "500", fontSize: "14px", mb: "12px" }}>
                Description
              </Typography>
              <TextField
                name="description"
                fullWidth
                id="description"
                label="Description"
                {...formik.getFieldProps("description")}
                error={formik.touched.description && formik.errors.description ? true : false}
                helperText={formik.touched.description && formik.errors.description ? formik.errors.description : ""}
              />
            </Grid>

            <Grid item xs={12} md={12} lg={6}>
              <Typography as="h5" sx={{ fontWeight: "500", fontSize: "14px", mb: "12px" }}>
                Price
              </Typography>
              <TextField
                name="price"
                fullWidth
                id="Price"
                label="Price"
                {...formik.getFieldProps("price")}
                error={formik.touched.img && formik.errors.price ? true : false}
                helperText={formik.touched.price && formik.errors.price ? formik.errors.price : ""}
              />

            </Grid>
            <Grid item xs={12} md={12} lg={6}>
              <Typography as="h5" sx={{ fontWeight: "500", fontSize: "14px", mb: "12px" }}>
                Unit
              </Typography>
              <TextField
                name="unit"
                fullWidth
                id="unit"
                label="Enter Unit"
                {...formik.getFieldProps("unit")}
                error={formik.touched.unit && formik.errors.unit ? true : false}
                helperText={formik.touched.unit && formik.errors.unit ? formik.errors.unit : ""}
              />
            </Grid>
            <Grid item xs={12} md={12} lg={6}>
              <Typography as="h5" sx={{ fontWeight: "500", fontSize: "14px", mb: "12px" }}>
                Discount
              </Typography>
              <TextField
                name="discount"
                fullWidth
                id="discount"
                label="Enter Discount"
                type="number"
                {...formik.getFieldProps("discount")}
                error={formik.touched.discount && formik.errors.discount ? true : false}
                helperText={formik.touched.discount && formik.errors.discount ? formik.errors.discount : ""}
              />
            </Grid>
            <Grid item xs={12} md={12} lg={6}>
              <Typography as="h5" sx={{ fontWeight: "500", fontSize: "14px", mb: "12px" }}>
                Quantity
              </Typography>
              <TextField
                name="quantity"
                fullWidth
                id="quantity"
                label="Enter Quantity"
                type="number"
                {...formik.getFieldProps("quantity")}
                error={formik.touched.quantity && formik.errors.quantity ? true : false}
                helperText={formik.touched.quantity && formik.errors.quantity ? formik.errors.quantity : ""}
              />
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <List>
                  <Typography
                    as="h5"
                    sx={{
                      fontWeight: "500",
                      fontSize: "16px",
                      marginTop: "11px",
                      marginLeft: "12px"
                    }}
                  >
                    Shades
                  </Typography>
                  {[...Array(profileImageUrls.length)].map((_, index) => (
                    <ListItem key={index}>
                      <Box sx={{ display: 'flex', gap: '16px' }}>
                        <TextField
                          label="Color Name"
                          type="text"
                          name={`imgUrls[${index}].color.name`}
                          value={formik.values.imgUrls[index]?.color?.name || ''}
                          onChange={formik.handleChange}
                        />
                        <TextField
                          label="Color Code"
                          type="text"
                          name={`imgUrls[${index}].color.clrCode`}
                          value={formik.values.imgUrls[index]?.color?.clrCode || ''}
                          onChange={formik.handleChange}
                        />
                      </Box>


                      <Box sx={{ display: "flex", alignItems: "end", gap: 1 }}>
                        <Box sx={{ flex: 1, marginLeft: "20px" }}>


                          <TextField
                            fullWidth
                            name={`shade-${index}`}
                            type="file"
                            id={`file-${index}`}
                            accept="image/*"
                            onChange={(event) => handleFileChange2(event, index)}
                          />
                        </Box>
                        {profileImageUrls[index] && (
                          <Image
                            src={profileImageUrls[index]}
                            alt={`profile-${index}`}
                            style={{
                              border: "1px solid #e0e0e0",
                            }}
                            width={50}
                            height={50}
                          />
                        )}
                      </Box>
                    </ListItem>
                  ))}
                </List>
                <Button onClick={addNewImage}>Add Shades</Button>
              </Grid>
            </Grid>


            <Grid item xs={12} md={12} lg={6}>
              <FormControl fullWidth>
                <Typography
                  as="h5"
                  sx={{
                    fontWeight: "500",
                    fontSize: "14px",
                    mb: "12px",
                  }}
                >
                  Brands
                </Typography>

                <Autocomplete
                  value={isEditMode ? (formData?.category?.brand || selectedSpecialist) : selectedSpecialist}

                  onChange={(event, newValue) => {
                    setSelectedSpecialist(newValue);
                    formik.setFieldValue(
                      "brands",
                      newValue?.id || ""
                    );
                  }}
                  options={specialistArray}
                  getOptionLabel={(option) => typeof option === 'string' ? option : option.name}
                  renderInput={(params) => (
                    <TextField {...params} label="Select Brands" />
                  )}
                />
              </FormControl>
            </Grid>


            <Grid item xs={12} md={12} lg={6}>
              <FormControl fullWidth>
                <Typography
                  as="h5"
                  sx={{
                    fontWeight: "500",
                    fontSize: "14px",
                    mb: "12px",
                  }}
                >
                  catagory
                </Typography>

                <Autocomplete

                  value={isEditMode ? (formData?.category?.name || selectedSpecialist3) : selectedSpecialist1}
                  onChange={(event, newValue) => {
                    setSelectedSpecialist1(newValue);
                    formik.setFieldValue("category", { name: newValue?.parent, id: newValue?._id });
                  }}
                  options={categories}
                  // getOptionLabel={(option) => option.parent}
                  getOptionLabel={(option) => typeof option === 'string' ? option : option.parent}
                  renderInput={(params) => (
                    <TextField {...params} label="Select Category" />
                  )}
                />

              </FormControl>
            </Grid>

            <Grid item xs={12} md={12} lg={6}>
              <FormControl fullWidth>
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

                <Autocomplete
                  value={isEditMode ? (formData?.status || selectedSpecialist3) : selectedSpecialist3}
                  onChange={(event, newValue) => {
                    setSelectedSpecialist3(newValue);
                    formik.setFieldValue(
                      "status",
                      newValue?.id || ""
                    );
                  }}
                  options={specialistArray3}
                  getOptionLabel={(option) => typeof option === 'string' ? option : option.name}
                  renderInput={(params) => (
                    <TextField {...params} label="Select Status" />
                  )}
                />
              </FormControl>
            </Grid>


            <Grid item xs={12} md={12} lg={12}>
              <Typography as="h5" sx={{ fontWeight: "500", fontSize: "14px", mb: "12px" }}>
                Additional Information
              </Typography>
              <TextField
                fullWidth
                label="Additional Information"
                minRows={3}
                multiline
                {...formik.getFieldProps("additionalInformation")}
                error={
                  formik.touched.additionalInformation && formik.errors.additionalInformation
                    ? true
                    : false
                }
                helperText={
                  formik.touched.additionalInformation && formik.errors.additionalInformation
                    ? formik.errors.additionalInformation
                    : ""
                }
              />
            </Grid>

            <Grid item xs={12} md={12} lg={6}>
              <Typography as="h5" sx={{ fontWeight: "500", fontSize: "14px", mb: "12px" }}>
                Product Type
              </Typography>
              <TextField
                name="productType"
                fullWidth
                id="productType"
                label="Product Type"
                {...formik.getFieldProps("productType")}
                error={formik.touched.productType && formik.errors.productType ? true : false}
                helperText={formik.touched.productType && formik.errors.productType ? formik.errors.productType : ""}
              />
            </Grid>

            <Grid item xs={12} md={12} lg={6}>
              <Typography as="h5" sx={{ fontWeight: "500", fontSize: "14px", mb: "12px" }}>
                Parent
              </Typography>
              <TextField
                name="parent"
                fullWidth
                id="parent"
                label="Parent"
                {...formik.getFieldProps("parent")}
                error={formik.touched.parent && formik.errors.parent ? true : false}
                helperText={formik.touched.parent && formik.errors.parent ? formik.errors.parent : ""}
              />
            </Grid>

            <Grid item xs={12} md={12} lg={6}>
              <Typography as="h5" sx={{ fontWeight: "500", fontSize: "14px", mb: "12px" }}>
                Children
              </Typography>
              <TextField
                name="children"
                fullWidth
                id="children"
                label="Children"
                {...formik.getFieldProps("children")}
                error={formik.touched.children && formik.errors.children ? true : false}
                helperText={formik.touched.children && formik.errors.children ? formik.errors.children : ""}
              />
            </Grid>

            <Grid item xs={12} md={12} lg={6}>
              <Typography as="h5" sx={{ fontWeight: "500", fontSize: "14px", mb: "12px" }}>
                Tags
              </Typography>
              <TextField
                name="tags"
                fullWidth
                id="tags"
                label="Tags"
              // {...formik.getFieldProps("tags")}
              // error={formik.touched.tags && formik.errors.tags ? true : false}
              // helperText={formik.touched.tags && formik.errors.tags ? formik.errors.tags : ""}
              />
            </Grid>

            <Grid item xs={12} md={12} lg={6}>
              <Typography as="h5" sx={{ fontWeight: "500", fontSize: "14px", mb: "12px" }}>
                Featured
              </Typography>
              <TextField
                name="featured"
                fullWidth
                id="featured"
                label="Featured"
                {...formik.getFieldProps("featured")}
                error={formik.touched.featured && formik.errors.featured ? true : false}
                helperText={formik.touched.featured && formik.errors.featured ? formik.errors.featured : ""}
              />
            </Grid>

            <Grid item xs={12} md={12} lg={6}>
              <Typography as="h5" sx={{ fontWeight: "500", fontSize: "14px", mb: "12px" }}>
                Sell Count
              </Typography>
              <TextField
                name="sellCount"
                fullWidth
                id="sellCount"
                label="Sell Count"
                type="number"
                {...formik.getFieldProps("sellCount")}
                error={formik.touched.sellCount && formik.errors.sellCount ? true : false}
                helperText={formik.touched.sellCount && formik.errors.sellCount ? formik.errors.sellCount : ""}
              />
            </Grid>

            {/* Submit button */}
            <Grid item xs={12} textAlign="left">
              <LoadingButtonComponent
                type="submit"
                fullWidth={false}
                sx={{ paddingX: "30px" }}
                isLoading={false} // Add loading state
                value={
                  <>
                    <SendIcon sx={{ position: "relative", top: "-2px" }} className="mr-5px" />
                    {isEditMode ? "Edit" : "Add"} Product
                  </>
                }
              />
            </Grid>
          </Grid>
        </Box>
      </Card>
    </>
  );
};

export default ServiceForm;
