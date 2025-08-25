import { Chip, Stack } from '@mui/material'

const categories = ['Pizza','Burgers','Biryani','South Indian','Chinese','Desserts','Healthy','Cafe','Rolls','Shakes','Momos','Thalis']

export function CategoryChips() {
  return (
    <div className="overflow-x-auto py-3">
      <Stack direction="row" spacing={1} className="min-w-max">
        {categories.map(c => (
          <Chip key={c} label={c} variant="outlined" className="hover:bg-gray-100" />
        ))}
      </Stack>
    </div>
  )
}