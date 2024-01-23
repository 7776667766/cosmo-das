import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  Button,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Tooltip,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import BrokenImageIcon from "@mui/icons-material/BrokenImage";

import copyImage from "@/public/images/icon/solar_copy-bold.png";
import ContentCopyTwoToneIcon from "@mui/icons-material/ContentCopyTwoTone";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useDispatch, useSelector } from "react-redux";
import { addBusinessFunApi } from "store/business/services";
import { getMyBussinessFunApi } from "store/business/services";
import Image from "next/image";
import { useRouter } from "next/router";

const BusinessForm = () => {
  const { role } = useSelector((state) => state.auth);
  const { business, dataFatched } = useSelector((state) => state.business);
  console.log(business, "business123");
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (!dataFatched) {
      dispatch(
        getMyBussinessFunApi({
          onSuccess: (businessId) => {
            console.log(businessId, "businessIdd");
          },
        })
      );
    }
  }, [dispatch, dataFatched]);

  const handleClickOpen = () => {
    router.push("/dummy-business/add");
  };
  return (
    <>
      <div>
        <ul>
          <li>
            {role === "admin" && (
              <>
                <Button
                  variant="contained"
                  disabled={business.data ? true : false}
                  onClick={handleClickOpen}
                >
                  Add Dummy Business
                </Button>
              </>
            )}
          </li>
        </ul>
      </div>
      <Accordion sx={{ borderRadius: "15px", marginTop: "20px",position:"unset",boxShadow:"none" }}
      
      defaultExpanded={true}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel-content"
          id="panel-header"
          sx={{ border: "none" }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Box
              sx={{
                width: "60px",
                height: "50px",
                borderRadius: "10px",
                overflow: "hidden",
                border: "1px solid gray",
              }}
            >
              {business?.data?.logo && (
                <Image
                  src={business?.data.logo}
                  alt="Logo"
                  width={50} // Set the width as per your requirement
                  height={50} // Set the height as per your requirement
                />
              )}
            </Box>

            <Typography
              variant="h4"
              sx={{ fontSize: 15, fontWeight: 700, color: "black" }}
            >
              {business?.data?.name}
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Card
            sx={{
              boxShadow: "none",
              border: "none",
              borderRadius: "10px",
              p: "25px 20px 15px",
            }}
          >
            <Grid container spacing={1} columnSpacing={{ xs: 1, sm: 2, md: 2 }}>
              <Grid item xs={12} md={8} lg={8} xl={8}>
                {business && (
                  <Card
                    sx={{
                      boxShadow: "none",
                      borderRadius: "10px",
                      p: "0px 20px",
                      mb: "15px",
                    }}
                  >
                    <Grid container spacing={1}>
                      <Grid item xs={12} md={5}>
                        <Box sx={{ display: "flex", gap: "10px" }}>
                          {/* {business?.data?.websiteService === true && (
                            <Typography variant="h6">Website Url</Typography>
                          )} */}
                          {business?.data?.websiteService === true && (
                            <Button
                              variant="outlined"
                              href={`${process.env.NEXT_PUBLIC_FRONTEND_WEB_URL}site/${business?.data.slug}`}
                              target="_blank"
                              sx={{
                                background: "rgba(117, 127, 239, 0.10)",

                                border: "none",
                                textDecoration: "underline",
                                pt: "2px",
                                pb: "1px",
                              }}
                            >
                              {business?.data.slug}
                            </Button>
                          )}
                          <Tooltip title="Copy" arrow  sx={{cursor:"pointer"}}>
                            <Image
                              src={copyImage}
                              alt="Main Image Description"
                              width={20}
                              height={20}
                              title="Copy Image"
                              sx={{ cursor: 'pointer' }} 
                              
                            />
                          </Tooltip>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Box sx={{ display: "flex", gap: "10px" }}>
                          {/* {business?.data?.bookingService === true && (
                            <Typography variant="h6">Booking Url</Typography>
                          )} */}
                          {business?.data?.bookingService === true && (
                            <Button
                              variant="outlined"
                              href={`${process.env.NEXT_PUBLIC_FRONTEND_WEB_URL}booking/${business?.data.slug}`}
                              target="_blank"
                              sx={{
                                background: "rgba(117, 127, 239, 0.10)",

                                border: "none",
                                textDecoration: "underline",
                                pt: "2px",
                                pb: "1px",
                              }}
                            >
                              {business?.data?.slug}
                            </Button>
                          )}
                          <Tooltip title="Copy" arrow>
                            <Image
                             sx={{ cursor: 'pointer' }} 
                              src={copyImage}

                              alt="Main Image Description"
                              width={20}
                              height={20}
                              title="Copy Image"

                            />
                          </Tooltip>
                        </Box>
                      </Grid>
                    </Grid>

                    <Box
                      sx={{
                        mb: "15px",
                      }}
                    >
                      <Box sx={{ marginTop: "10px" }}>
                        {business?.data?.description}
                      </Box>
                      <Box sx={{ marginTop: "10px", display: "block" }}>
                        <Box>{business?.data?.email}</Box>
                        <Box>{business?.data?.phone}</Box>
                        <Box>{business?.data?.address}</Box>
                        <Box>{business?.data?.theme || "N/A"}</Box>
                        <Box>{business?.data?.bannerText}</Box>
                        <Box
                          sx={{
                            backgroundColor: business?.data?.color,
                            width: "50px", // Set your desired width
                            height: "20px",
                            borderRadius: "5px", // Set your desired height
                          }}
                        >
                          {" "}
                        </Box>
                      </Box>
                      <Box></Box>
                    </Box>
                  </Card>
                )}
              </Grid>

              <Grid
                item
                xs={12}
                md={4}
                lg={4}
                xl={4}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "end",
                }}
              >
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "150px", // Set your desired width
                      height: "100px", // Set your desired height
                      border: "1px solid #ccc", // Border style
                      borderRadius: "8px", // Border radius
                      overflow: "hidden",
                      marginTop: "-70px", // Hide overflow content
                    }}
                  >
                    {business?.data?.bannerImg ? (
                      <Image
                        src={business.data.bannerImg}
                        alt="Banner Image"
                        width={70}
                        height={70}
                      />
                    ) : (
                      <IconButton color="primary">
                        <BrokenImageIcon />
                      </IconButton>
                    )}
                  </Box>
                  <Box sx={{ marginTop: "20px" }}>
                    {" "}
                    {business?.data?.socialLinks &&
                    business.data.socialLinks.length > 0 ? (
                      business.data.socialLinks.map((socialLink, index) => (
                        <a
                          key={index}
                          href={socialLink.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            marginRight: "12px",
                            textTransform: "capitalize",
                            marginTop: "30px",
                          }}
                        >
                          {socialLink.name}
                        </a>
                      ))
                    ) : (
                      <span>No social links available</span>
                    )}
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Card>
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default BusinessForm;
