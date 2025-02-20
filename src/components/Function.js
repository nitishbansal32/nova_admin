import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
} from "@mui/material";
import axios from "axios";

const Functions = () => {
  const [shopData, setShopData] = useState({
    coinBags: [],
    energyBags: [],
    packages: [],
  });

  // Fetch shop data on component mount
  useEffect(() => {
    const fetchShopData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/shop`,
          { headers: { Authorization: token } }
        );
        setShopData(response.data);
      } catch (error) {
        console.error("Error fetching shop data:", error);
      }
    };

    fetchShopData();
  }, []);

  // Handle input changes
  const handleInputChange = (type, index, field, value) => {
    const updatedData = { ...shopData };
    updatedData[type][index][field] = value;
    setShopData(updatedData);
  };

  // Save changes to the backend
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${process.env.REACT_APP_API_URL}/shop`, shopData, {
        headers: { Authorization: token },
      });
      alert("Shop data updated successfully!");
    } catch (error) {
      console.error("Error updating shop data:", error);
      alert("Failed to update shop data.");
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Functions
      </Typography>

      {/* Coin Bags Table */}
      <Typography variant="h6" gutterBottom>
        Coin Bags
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Coins</TableCell>
              <TableCell>Diamonds</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shopData.coinBags.map((bag, index) => (
              <TableRow key={bag.id}>
                <TableCell>{bag.id}</TableCell>
                <TableCell>
                  <TextField
                    value={bag.coins}
                    onChange={(e) =>
                      handleInputChange(
                        "coinBags",
                        index,
                        "coins",
                        e.target.value
                      )
                    }
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={bag.diamonds}
                    onChange={(e) =>
                      handleInputChange(
                        "coinBags",
                        index,
                        "diamonds",
                        e.target.value
                      )
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Energy Bags Table */}
      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
        Energy Bags
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Energy</TableCell>
              <TableCell>Diamonds</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shopData.energyBags.map((bag, index) => (
              <TableRow key={bag.id}>
                <TableCell>{bag.id}</TableCell>
                <TableCell>
                  <TextField
                    value={bag.energy}
                    onChange={(e) =>
                      handleInputChange(
                        "energyBags",
                        index,
                        "energy",
                        e.target.value
                      )
                    }
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={bag.diamonds}
                    onChange={(e) =>
                      handleInputChange(
                        "energyBags",
                        index,
                        "diamonds",
                        e.target.value
                      )
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Packages Table */}
      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
        Packages
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Ether Value</TableCell>
              <TableCell>Diamonds</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shopData.packages.map((pkg, index) => (
              <TableRow key={pkg.id}>
                <TableCell>{pkg.id}</TableCell>
                <TableCell>
                  <TextField
                    value={pkg.name}
                    onChange={(e) =>
                      handleInputChange(
                        "packages",
                        index,
                        "name",
                        e.target.value
                      )
                    }
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={pkg.etherValue}
                    onChange={(e) =>
                      handleInputChange(
                        "packages",
                        index,
                        "etherValue",
                        e.target.value
                      )
                    }
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={pkg.diamondAdd}
                    onChange={(e) =>
                      handleInputChange(
                        "packages",
                        index,
                        "diamondAdd",
                        e.target.value
                      )
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Save Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleSave}
        sx={{ mt: 3 }}
      >
        Save Changes
      </Button>
    </Box>
  );
};

export default Functions;
