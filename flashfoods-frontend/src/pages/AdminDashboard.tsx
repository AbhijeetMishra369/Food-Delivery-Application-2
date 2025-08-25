import { Button, Stack, Typography } from '@mui/material'

export default function AdminDashboard() {
  return (
    <div className="space-y-4">
      <Typography variant="h6" fontWeight={700}>Owner Admin</Typography>
      <div className="border rounded-lg p-3">
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <div>
            <Typography fontWeight={700}>Your Restaurant</Typography>
            <Typography variant="body2" color="text.secondary">Manage details, menu, and orders</Typography>
          </div>
          <Button variant="contained">Add Menu Item</Button>
        </Stack>
      </div>
      <div className="border rounded-lg p-3">
        <Typography fontWeight={700}>Menu</Typography>
        <div className="text-sm text-gray-500">Menu table coming soon...</div>
      </div>
    </div>
  )
}