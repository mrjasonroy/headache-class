import { Header } from "@/components/header";
import { parseDateRangeUrlString } from "@/lib/utils"

export default function Page({
  params,
}: {
  params: {
    range: string
  }
}) {
  try {
    const dates = parseDateRangeUrlString(params.range);
    return (
      <Header selectedDates={dates}  />
    )
  } catch (error) {
    return <div>Error: Invalid Dates</div>
  }
}