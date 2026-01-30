"use client";

import { useState, useEffect } from "react";
import { format, addDays, startOfWeek, isSameDay, addWeeks, subWeeks } from "date-fns";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";

interface CalendarStripProps {
    selectedDate: Date | undefined;
    onSelectDate: (date: Date) => void;
}

export function CalendarStrip({ selectedDate, onSelectDate }: CalendarStripProps) {
    const [currentWeekStart, setCurrentWeekStart] = useState(() =>
        startOfWeek(new Date(), { weekStartsOn: 1 })
    );
    const [weekDates, setWeekDates] = useState<Date[]>([]);

    useEffect(() => {
        const days = Array.from({ length: 7 }).map((_, i) => addDays(currentWeekStart, i));
        setWeekDates(days);
    }, [currentWeekStart]);

    const goToPreviousWeek = () => {
        setCurrentWeekStart(prev => subWeeks(prev, 1));
    };

    const goToNextWeek = () => {
        setCurrentWeekStart(prev => addWeeks(prev, 1));
    };

    const goToToday = () => {
        const today = startOfWeek(new Date(), { weekStartsOn: 1 });
        setCurrentWeekStart(today);
        onSelectDate(new Date());
    };

    return (
        <div className="space-y-3">
            {/* Navigation Controls */}
            <div className="flex items-center justify-between px-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={goToPreviousWeek}
                    className="rounded-xl"
                >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                </Button>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={goToToday}
                        className="rounded-xl"
                    >
                        Today
                    </Button>

                    {/* Jump to Date Picker */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" size="sm" className="rounded-xl">
                                <Calendar className="w-4 h-4 mr-1" />
                                Jump to Date
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="end">
                            <CalendarPicker
                                mode="single"
                                selected={selectedDate}
                                onSelect={(date) => {
                                    if (date) {
                                        onSelectDate(date);
                                        setCurrentWeekStart(startOfWeek(date, { weekStartsOn: 1 }));
                                    }
                                }}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={goToNextWeek}
                    className="rounded-xl"
                >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
            </div>

            {/* Week Strip */}
            <div className="w-full overflow-x-auto py-2 no-scrollbar">
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
                                        : "bg-white text-muted-foreground border-transparent hover:border-primary/20 hover:bg-white/80 dark:bg-slate-800"
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
        </div>
    );
}
