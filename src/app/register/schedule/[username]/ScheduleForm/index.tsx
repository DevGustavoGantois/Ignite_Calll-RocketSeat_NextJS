import { useState } from "react";
import { CalendarStep } from "./CalendarStep";
import { ConfirmStep } from "./CalendarStep/ConfirmStep";

export function ScheduleForm() {
    const [selectedDateTime, setSelectedDateTime] = useState<Date | null>()

    function handleClearSelectedDateTime() {
        return null
    }

    if (selectedDateTime) {
        return (
            <ConfirmStep onCancelConfirmation={handleClearSelectedDateTime} schedulingDate={selectedDateTime} />
        )
    }

    return (
        <CalendarStep onSelectedDateTime={setSelectedDateTime} />
    )
} 