import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
} from "@mui/x-data-grid";
import {
  Typography,
  Box,
  Button,
  Avatar,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import InventoryIcon from "@mui/icons-material/Inventory";
import SearchIcon from "@mui/icons-material/Search";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedTelegramIds, setSelectedTelegramIds] = useState([]); // Store Telegram IDs
  const [openPopup, setOpenPopup] = useState(false);

  // Fetch users
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/users`,
        { headers: { Authorization: token } }
      );
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle refresh button click
  const handleRefresh = () => {
    fetchUsers();
    setSearchQuery("");
    setFilteredUsers(users);
  };

  // Handle search input change
  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Handle search button click
  const handleSearchButtonClick = () => {
    const query = searchQuery.toLowerCase();
    const filtered = users.filter(
      (user) =>
        user.telegramId?.toLowerCase().includes(query) ||
        user.firstName?.toLowerCase().includes(query)
    );
    setFilteredUsers(filtered);
  };

  // Handle row selection
  const handleSelectionChange = (newSelection) => {
    console.log("New Selection:", newSelection);

    // Get the Telegram IDs of the newly selected rows
    const newlySelectedTelegramIds = newSelection
      .map((id) => users.find((user) => user._id === id)?.telegramId)
      .filter(Boolean); // Remove undefined values

    // Get the Telegram IDs of the currently selected rows
    const currentTelegramIds = selectedRows
      .map((id) => users.find((user) => user._id === id)?.telegramId)
      .filter(Boolean); // Remove undefined values

    // Find the Telegram IDs to add (newly selected but not already in the array)
    const idsToAdd = newlySelectedTelegramIds.filter(
      (id) => !selectedTelegramIds.includes(id)
    );

    // Find the Telegram IDs to remove (deselected rows)
    const idsToRemove = currentTelegramIds.filter(
      (id) => !newlySelectedTelegramIds.includes(id)
    );

    // Update the selectedTelegramIds state
    setSelectedTelegramIds((prev) => [
      ...prev.filter((id) => !idsToRemove.includes(id)), // Remove deselected IDs
      ...idsToAdd, // Add newly selected IDs
    ]);

    // Update the selectedRows state (optional, if you still need it)
    setSelectedRows(newSelection);
  };

  useEffect(() => {
    console.log("Selected Telegram IDs:", selectedTelegramIds);
  }, [selectedTelegramIds]);

  // Handle "Add Diamonds" button click
  const handleAddDiamonds = () => {
    console.log("Selected Telegram IDs:", selectedTelegramIds);

    if (selectedTelegramIds.length === 0) {
      alert("No user selected!");
      return;
    }

    setOpenPopup(true);
  };

  // Handle confirmation of adding diamonds
  const handleConfirmAddDiamonds = async (diamonds) => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${process.env.REACT_APP_API_URL}/users/update-diamonds`,
        { telegramIds: selectedTelegramIds, diamonds }, // Use selectedTelegramIds
        { headers: { Authorization: token } }
      );

      alert("Diamonds added successfully!");
      fetchUsers(); // Refresh the user list
    } catch (err) {
      console.error("Error adding diamonds:", err);
      alert("Failed to add diamonds.");
    }
  };

  // Calculate total number of users
  const totalUsers = users.length;

  // Calculate total packageD1, packageD2, and packageD3
  const totalPackageD1 = users.reduce((sum, user) => sum + user.packageD1, 0);
  const totalPackageD2 = users.reduce((sum, user) => sum + user.packageD2, 0);
  const totalPackageD3 = users.reduce((sum, user) => sum + user.packageD3, 0);

  // Define columns for the DataGrid
  const columns = [
    { field: "telegramId", headerName: "Telegram ID", width: 150 },
    { field: "firstName", headerName: "First Name", width: 150 },
    { field: "power", headerName: "Power", width: 150 },
    { field: "coins", headerName: "Coins", width: 100 },
    { field: "diamonds", headerName: "Diamonds", width: 100 },
    { field: "level", headerName: "Level", width: 100 },
    { field: "energy", headerName: "Energy", width: 100 },
    // Gear Columns
    { field: "gear1Level", headerName: "Gear 1 Level", width: 120 },
    {
      field: "gear1LastLevelUp",
      headerName: "Gear 1 Last Level Up",
      width: 180,
    },
    { field: "gear2Level", headerName: "Gear 2 Level", width: 120 },
    {
      field: "gear2LastLevelUp",
      headerName: "Gear 2 Last Level Up",
      width: 180,
    },
    { field: "gear3Level", headerName: "Gear 3 Level", width: 120 },
    {
      field: "gear3LastLevelUp",
      headerName: "Gear 3 Last Level Up",
      width: 180,
    },
    { field: "gear4Level", headerName: "Gear 4 Level", width: 120 },
    {
      field: "gear4LastLevelUp",
      headerName: "Gear 4 Last Level Up",
      width: 180,
    },
    // Coin Pack Columns
    { field: "coinPackCount", headerName: "Coin Pack Count", width: 150 },
    {
      field: "coinPackLastPurchase",
      headerName: "Coin Pack Last Purchase",
      width: 180,
    },
    // Energy Pack Columns
    { field: "energyPackCount", headerName: "Energy Pack Count", width: 150 },
    {
      field: "energyPackLastPurchase",
      headerName: "Energy Pack Last Purchase",
      width: 180,
    },
    // Additional Fields
    { field: "publicAddress", headerName: "Public Address", width: 200 },
    { field: "walletBalance", headerName: "Wallet Balance", width: 150 },
    { field: "packageD1", headerName: "Package D1", width: 120 },
    { field: "packageD2", headerName: "Package D2", width: 120 },
    { field: "packageD3", headerName: "Package D3", width: 120 },
    { field: "referralCode", headerName: "Referral Code", width: 150 },
    { field: "referredBy", headerName: "Referred By", width: 150 },
    { field: "referrals", headerName: "Referrals", width: 200 },
    { field: "referralCount", headerName: "Referral Count", width: 150 },
    {
      field: "milestoneRewardsGiven",
      headerName: "Milestone Rewards Given",
      width: 200,
    },
    { field: "maxEnergyCap", headerName: "Max Energy Cap", width: 150 },
  ];

  // Transform user data for DataGrid
  const rows = filteredUsers.map((user) => ({
    id: user._id, // Ensure this matches the `id` in your data
    telegramId: user.telegramId,
    firstName: user.firstName,
    power: user.power,
    coins: user.coins,
    diamonds: user.diamonds,
    level: user.level,
    energy: user.energy,
    // Gear Data
    gear1Level: user.gears[0]?.level || "N/A",
    gear1LastLevelUp: user.gears[0]?.lastLevelUp
      ? new Date(user.gears[0].lastLevelUp).toLocaleString()
      : "N/A",
    gear2Level: user.gears[1]?.level || "N/A",
    gear2LastLevelUp: user.gears[1]?.lastLevelUp
      ? new Date(user.gears[1].lastLevelUp).toLocaleString()
      : "N/A",
    gear3Level: user.gears[2]?.level || "N/A",
    gear3LastLevelUp: user.gears[2]?.lastLevelUp
      ? new Date(user.gears[2].lastLevelUp).toLocaleString()
      : "N/A",
    gear4Level: user.gears[3]?.level || "N/A",
    gear4LastLevelUp: user.gears[3]?.lastLevelUp
      ? new Date(user.gears[3].lastLevelUp).toLocaleString()
      : "N/A",
    // Coin Pack Data
    coinPackCount: user.coinPack.count,
    coinPackLastPurchase: user.coinPack.lastPurchase
      ? new Date(user.coinPack.lastPurchase).toLocaleString()
      : "N/A",
    // Energy Pack Data
    energyPackCount: user.energyPack.count,
    energyPackLastPurchase: user.energyPack.lastPurchase
      ? new Date(user.energyPack.lastPurchase).toLocaleString()
      : "N/A",
    // Additional Fields
    publicAddress: user.publicAddress || "N/A",
    walletBalance: user.walletBalance,
    packageD1: user.packageD1,
    packageD2: user.packageD2,
    packageD3: user.packageD3,
    referralCode: user.referralCode || "N/A",
    referredBy: user.referredBy || "N/A",
    referrals: user.referrals.join(", ") || "N/A",
    referralCount: user.referralCount,
    milestoneRewardsGiven: user.milestoneRewardsGiven.join(", ") || "N/A",
    maxEnergyCap: user.maxEnergyCap,
  }));

  // Custom Toolbar with Columns Button
  const CustomToolbar = () => {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
      </GridToolbarContainer>
    );
  };

  // Popup component
  const AddDiamondsPopup = ({
    open,
    onClose,
    selectedTelegramIds,
    users, // Pass the users array
    onConfirm,
  }) => {
    const [diamonds, setDiamonds] = useState("");

    const handleConfirm = () => {
      if (!diamonds || isNaN(diamonds)) {
        alert("Please enter a valid number of diamonds.");
        return;
      }
      onConfirm(Number(diamonds));
      onClose();
    };

    // Get user details for selected Telegram IDs
    const selectedUsers = selectedTelegramIds.map((telegramId) =>
      users.find((user) => user.telegramId === telegramId)
    );

    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Add Diamonds</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Number of Diamonds"
            type="number"
            value={diamonds}
            onChange={(e) => setDiamonds(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <Typography variant="h6">Selected Users:</Typography>
          <List>
            {selectedUsers.map((user) => (
              <ListItem key={user.telegramId}>
                <ListItemText
                  primary={`${user.firstName} (${user.telegramId})`} // Display First Name and Telegram ID
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleConfirm} variant="contained" color="primary">
            Send
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 3,
        }}
      >
        <Typography variant="h4" gutterBottom>
          User List
        </Typography>
        <Button variant="contained" onClick={handleRefresh}>
          Refresh
        </Button>
      </Box>

      {/* Search Bar */}
      <Box sx={{ marginBottom: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by Telegram ID or First Name"
          value={searchQuery}
          onChange={handleSearchInputChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleSearchButtonClick}>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Stats Boxes */}
      <Box
        sx={{
          display: "flex",
          gap: 3,
          marginBottom: 3,
          padding: "8px",
        }}
      >
        {/* Total Users Box */}
        <Paper
          sx={{
            p: 3,
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Avatar sx={{ bgcolor: "primary.main" }}>
            <PeopleIcon />
          </Avatar>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h6">Total Users</Typography>
            <Typography variant="h6">{totalUsers}</Typography>
          </Box>
        </Paper>

        {/* Total Package D1 Box */}
        <Paper
          sx={{
            p: 3,
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Avatar sx={{ bgcolor: "secondary.main" }}>
            <InventoryIcon />
          </Avatar>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h6">Total Package D1</Typography>
            <Typography variant="h6">{totalPackageD1}</Typography>
          </Box>
        </Paper>

        {/* Total Package D2 Box */}
        <Paper
          sx={{
            p: 3,
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Avatar sx={{ bgcolor: "success.main" }}>
            <InventoryIcon />
          </Avatar>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h6">Total Package D2</Typography>
            <Typography variant="h6">{totalPackageD2}</Typography>
          </Box>
        </Paper>

        {/* Total Package D3 Box */}
        <Paper
          sx={{
            p: 3,
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Avatar sx={{ bgcolor: "warning.main" }}>
            <InventoryIcon />
          </Avatar>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h6">Total Package D3</Typography>
            <Typography variant="h6">{totalPackageD3}</Typography>
          </Box>
        </Paper>
      </Box>

      {/* Add Diamonds Button */}
      <Button
        variant="contained"
        onClick={handleAddDiamonds}
        sx={{ marginBottom: 2 }}
      >
        Add Diamonds
      </Button>

      {/* Add Diamonds Popup */}
      <AddDiamondsPopup
        open={openPopup}
        onClose={() => setOpenPopup(false)}
        selectedTelegramIds={Array.from(selectedTelegramIds)}
        users={users} // Pass the users array
        onConfirm={handleConfirmAddDiamonds}
      />
      {/* DataGrid */}
      <Box sx={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          checkboxSelection
          disableSelectionOnClick
          onRowSelectionModelChange={handleSelectionChange}
          rowSelectionModel={selectedRows}
          components={{
            Toolbar: CustomToolbar,
          }}
        />
      </Box>
    </Box>
  );
};

export default Dashboard;
