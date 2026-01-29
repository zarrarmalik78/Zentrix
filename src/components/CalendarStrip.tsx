"use client";

import { useState, useEffect } from "react";
import { format, addDays, startOfWeek, isSameDay } from "date-fns";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CalendarStripProps {
    selectedDate: Date | undefined;
    onSelectDate: (date: Date) => void;
}

export function CalendarStrip({ selectedDate, onSelectDate }: CalendarStripProps) {
    const [startDate, setStartDate] = useState(new Date());
    const [weekDates, setWeekDates] = useState<Date[]>([]);

    useEffect(() => {
        const start = startOfWeek(new Date(), { weekStartsOn: 1 }); // Monday start
        const days = Array.from({ length: 7 }).map((_, i) => addDays(start, i));
        setWeekDates(days);
    }, []);

    return (
        <div className="w-full overflow-x-auto py-4 no-scrollbar">
            <div className="flex gap-3 min-w-max px-1">
                {weekDates.map((date, index) => {
                    const isSelected = selectedDate && isSameDay(date, selectedDate);
                    const isToday = isSameDay(date, new Date());

                    return (
                        <motion.button
                            key={date.toString()}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => onSelectDate(date)}
                            className={cn(
                                "flex flex-col items-center justify-center min-w-[4.5rem] h-[5.5rem] rounded-2xl transition-all duration-300 border-2",
                                isSelected
                                    ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 scale-105"
                                    : "bg-white text-muted-foreground border-transparent hover:border-primary/20 hover:bg-white/80"
                            )}
                        >
                            <span className="text-xs font-medium uppercase tracking-wider mb-1">
                                {format(date, "EEE")}
                            </span>
                            <span className={cn("text-2xl font-bold", isSelected ? "text-primary-foreground" : "text-foreground")}>
                                {format(date, "d")}
                            </span>
                            {isToday && (
                                <span className={cn(
                                    "mt-1 w-1.5 h-1.5 rounded-full",
                                    isSelected ? "bg-white" : "bg-primary"
                                )} />
                            )}
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}
