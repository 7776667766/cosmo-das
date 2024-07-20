import React, { useEffect, useState } from "react";
import { Paper, Table, TableBody, TableContainer, Typography, TableRow } from "@mui/material";
import {
  Box,
  Dialog,
  TextField,
  useMediaQuery,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";

import { styled } from "@mui/material/styles";

import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import TableCell from "@mui/material/TableCell";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import Button from "@mui/material/Button";
import AddIcon from '@mui/icons-material/Add';
import Avatar from "@mui/material/Avatar";
import Image from "next/image";
import Link from "next/link";
import { CustomPaginationTable } from "@/components/Table/CustomPaginationTable";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteServiceFunApi,
  getAllServiceFunApi,
} from "store/service/services";
import TransitionsDialog from "@/components/UIElements/Modal/TransitionsDialog";
import { getMyBussinessFunApi } from "store/business/services";
import { useRouter } from "next/router";
import axios from "helper/api";
import toast from "react-hot-toast";

const ServicesPage = () => {
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: "#EAEEFD",
    },

    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [products, setallproducts] = useState([])
  console.log("products", products)
  const [selectedBusiness, setSelectedBusiness] = useState([]);
  console.log("selected business", selectedBusiness)

  const handleClick = (id) => {
    console.log("id 65", id)
    const selectedBusiness = products?.find((item) => item._id === id);
    setSelectedBusiness(selectedBusiness);
    setOpen(true);
  };
  const handleReject = () => {
    setOpen(false);

    // setOpen2(true);
    // setIsRejecting(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const userdata = async () => {
    try {
      const response = await axios.get('/product/all');

      console.log("Response from API:", response.data.data);
      setallproducts(response.data.data)
      if (response.status === 200) {
        toast.success("Data fetched !");
      } else {
        toast.error(`Error: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error in data fetch:", error);
      toast.error("An error occurred while submitting the form. Please try again later.");
    }
  }

  useEffect(() => {
    userdata()
  }, []);

  const router = useRouter();

  const nextPage = (id) => {
    console.log("id", id)
    router.push(`/services/edit?id=${id}`);
  };
  
  const handleDelete = (id) => {
    dispatch(deleteServiceFunApi(id));
  };

  return (
    <>
      <Card
        sx={{
          boxShadow: "none",
          borderRadius: "10px",
          p: "25px 20px 15px",
          mb: "15px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #EEF0F7",
            paddingBottom: "10px",
            mb: "20px",
          }}
          className="for-dark-bottom-border"
        >
          <Typography
            as="h3"
            sx={{
              fontSize: 18,
              fontWeight: 500,
            }}
          >
            All Products
          </Typography>

          {/* {(role === "owner" || role === "manager") && ( */}
          <Link href="/services/add-service">
            <Button
              variant="contained"
              sx={{
                textTransform: "capitalize",
                borderRadius: "8px",
                fontWeight: "500",
                fontSize: "13px",
                padding: "12px 20px",
                color: "#fff !important",
              }}
            >
              <AddIcon
                sx={{ position: "relative", top: "-1px" }}
                className="mr-5px"
              />
              Add Product
            </Button>
          </Link>
          {/* )} */}
        </Box>

        <CustomPaginationTable
          tableData={products}
          // isLoading={service.isLoading}
          tableHeaderData={
            <>
              <TableCell
                sx={{
                  borderBottom: "1px solid #F7FAFF",
                  fontSize: "13.5px",
                }}
              >
                Name
              </TableCell>

              <TableCell
                sx={{
                  borderBottom: "1px solid #F7FAFF",
                  fontSize: "13.5px",
                }}
              >
                Description
              </TableCell>

              <TableCell
                sx={{
                  borderBottom: "1px solid #F7FAFF",
                  fontSize: "13.5px",
                }}
              >
                Image
              </TableCell>

              <TableCell
                sx={{
                  borderBottom: "1px solid #F7FAFF",
                  fontSize: "13.5px",
                }}
              >
                Price
              </TableCell>

              <TableCell
                align="center"
                sx={{
                  borderBottom: "1px solid #F7FAFF",
                  fontSize: "13.5px",
                }}
              >
                Shade
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  borderBottom: "1px solid #F7FAFF",
                  fontSize: "13.5px",
                }}
              >
                Slug
              </TableCell>

              <TableCell
                align="center"
                sx={{
                  borderBottom: "1px solid #F7FAFF",
                  fontSize: "13.5px",
                }}
              >
                Quantity
              </TableCell>

              <TableCell
                align="center"
                sx={{
                  borderBottom: "1px solid #F7FAFF",
                  fontSize: "13.5px",
                }}
              >
                Product type
              </TableCell>

              <TableCell
                align="right"
                sx={{
                  borderBottom: "1px solid #F7FAFF",
                  fontSize: "13.5px",
                }}
              >
                Action
              </TableCell>
            </>
          }
          tableBodyData={(data, index) => (
            <>
              <TableCell
                sx={{
                  fontWeight: "500",
                  fontSize: "13px",
                  borderBottom: "1px solid #F7FAFF",
                  color: "#260944",
                  pt: "16px",
                  pb: "16px",
                }}
              >
                {data.title}
              </TableCell>

              <TableCell
                sx={{
                  borderBottom: "1px solid #F7FAFF",
                  fontSize: "13px",
                  pt: "16px",
                  pb: "16px",
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 2,
                }}
              >
                {data.description}
              </TableCell>

              <TableCell
                sx={{
                  borderBottom: "1px solid #F7FAFF",
                  pt: "16px",
                  pb: "16px",
                }}
              >
                <Avatar
                  alt="User"
                  src={data.img}
                  sx={{ width: 35, height: 35 }}
                />
              </TableCell>

              <TableCell
                sx={{
                  borderBottom: "1px solid #F7FAFF",
                  fontSize: "13px",
                  pt: "16px",
                  pb: "16px",
                }}
              >
                {data.price}
              </TableCell>
              {/* 
              <TableCell
                align="center"
                sx={{
                  fontWeight: 500,
                  borderBottom: "1px solid #F7FAFF",
                  fontSize: "11px",
                  pt: "16px",
                  pb: "16px",
                }}
              >
                {data?.shade} 
              </TableCell> */}
              <TableCell
                sx={{
                  borderBottom: "1px solid #F7FAFF",
                  fontSize: "13px",
                  pt: "16px",
                  pb: "16px",
                }}
              >
                <Tooltip title="Shade" placement="top"> <IconButton

                  aria-label="edit"
                  size="small"
                  color="primary"
                  className="primary"

                  onClick={(event) => handleClick(data?._id, event)}
                >
                  {data?.requestStatus === "Approved" ? (
                    <VisibilityIcon />
                  ) : data?.requestStatus === "Rejected" ? (
                    <VisibilityIcon />
                  ) : (
                    <DriveFileRenameOutlineIcon fontSize="inherit" />
                  )}
                </IconButton></Tooltip>


              </TableCell>


              <TableCell
                sx={{
                  borderBottom: "1px solid #F7FAFF",
                  fontSize: "13px",
                  pt: "16px",
                  pb: "16px",
                }}
              >
                {data.slug}
              </TableCell>

              <TableCell
                sx={{
                  borderBottom: "1px solid #F7FAFF",
                  fontSize: "13px",
                  pt: "16px",
                  pb: "16px",
                }}
                align="center"
              >
                {data?.quantity}
              </TableCell>

              <TableCell
                sx={{
                  borderBottom: "1px solid #F7FAFF",
                  fontSize: "13px",
                  pt: "16px",
                  pb: "16px",
                }}
                align="center"
              >

                {data?.productType}

              </TableCell>

              <TableCell
                align="right"
                sx={{ borderBottom: "1px solid #F7FAFF" }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "end",
                  }}
                >
                  <Tooltip title="Remove" placement="top">
                    <TransitionsDialog
                      modelButton={
                        <IconButton
                          aria-label="remove"
                          size="small"
                          color="danger"
                          className="danger"
                        >
                          <DeleteIcon fontSize="inherit" />
                        </IconButton>
                      }
                      submitButtonText="Delete"
                      handleSubmit={() => handleDelete(data._id)}
                    >
                      <div style={{ textAlign: "center" }}>
                        <Image
                          src="/images/icon/alert.png"
                          width={150}
                          height={150}
                          alt="ok"
                        />

                        <Typography sx={{ fontSize: 18 }}>
                          <b>Are You Sure You Want To Delete ?</b>
                          <br />
                          <span style={{ fontSize: 14 }}>
                            You are deleting this data & this action is
                            irreversible
                          </span>
                        </Typography>
                      </div>
                    </TransitionsDialog>
                  </Tooltip>

                  {/* {role !== 'admin' ? ( */}
                  <Tooltip title="Edit" placement="top">
                    <IconButton
                      aria-label="edit"
                      size="small"
                      color="primary"
                      className="primary"
                      onClick={() => nextPage(data._id)}
                    >
                      <DriveFileRenameOutlineIcon fontSize="inherit" />
                    </IconButton>
                  </Tooltip>
                  {/* ) : null} */}

                </Box>
              </TableCell>
            </>
          )}


        />

        <Dialog
          open={open}
          onClose={handleClose}
          maxWidth="sm"
          PaperProps={{
            sx: {
              width: "800px",
              borderRadius: "25px",
              padding: "15px",
            },
          }}
        >

          <Box sx={{ display: "flex", justifyContent: "end" }}>
            <Button onClick={handleClose}>
            </Button>
          </Box>


          <Typography
            variant="h6"
            sx={{ textAlign: "start", marginLeft: "10px" }}
          >
            Shade Details
          </Typography>

          <Box
            sx={{
              marginLeft: "10px",
              display: "flex",
              justifyContent: "end",
              paddingRight: "10px",
            }}
          >

          </Box>
          <Box
            style={{
              padding: "10px",
              textAlign: "left",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TableContainer
              component={Paper}
              style={{ width: "100%", boxShadow: "none" }}
            >
              <Table>
                <TableBody>

                  <div>
                    {selectedBusiness.imageURLs?.map((item, index) => (
                      <StyledTableRow key={index}>
                        <StyledTableCell
                          style={{
                            padding: "10px",
                            border: "none",
                          }}
                        >
                          <strong>{item.color.name ? item.color.name : 'No color name found'}</strong>
                          <br />
                          <br />
                          <strong>{item.color.clrCode ? item.color.clrCode : 'No color code found'}</strong>
                          <br />
                          <br />
                          {item.shade.map((shadeUrl, shadeIndex) => (
                            <img key={shadeIndex} src={shadeUrl} alt={`Shade ${shadeIndex}`} style={{ maxWidth: '100px', maxHeight: '100px', margin: '5px' }} />
                          ))}
                        </StyledTableCell>
                        <StyledTableCell
                          style={{
                            padding: "10px",
                            border: "none",
                            textAlign: "end",
                          }}
                        >
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </div>


                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Box>
            <Box
              sx={{
                display: "flex",
                gap: "15px",
                justifyContent: "center",
                marginY: 2,
              }}
            >
              <Button
                variant="contained "
                onClick={handleClose}
                sx={{
                  backgroundColor: "white",
                  color: "#707070",
                  width: "173px",
                  padding: "8px 20px",
                  borderRadius: "8px",
                  border: "2px solid #707070",
                }}
              >
                Close
              </Button>
            </Box>
          </Box>

        </Dialog>


      </Card>
    </>
  );
};

export default ServicesPage;

